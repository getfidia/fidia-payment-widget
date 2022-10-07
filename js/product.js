const { createApp } = Vue;
const { required, requiredIf, email } = window.VuelidateValidators;
const { useVuelidate } = window.Vuelidate;

const App = {
	data() {
		return {
			showProduct: false,
			displayLoader: true,
			// baseUrl: "https://getfidia-production.herokuapp.com/graphql",
			baseUrl: "http://localhost:8000/graphql",
			username: "",
			slug: "",
			name: "",
			image: "",
			creator: "",
			productId: "",
			amount: "",
			description: "",
			type: "",
			filename: "",
			filesize: "",
			errorOccured: false,
			showBuyProduct: false,
			buyersName: "",
			buyersEmail: "",
			recipientName: "",
			recipientEmail: "",
			showTransactionStatus: false,
			transactionStatus: "",
			productDownloadUrl: "",
			downloadStarted: false,
			isCreatorVerified: false,
			isGiftingSomeone: false,
			deliveryLocation: "",
			physical: {},
			locations: [],
			phoneNumberInput: null,
			phoneNumber: "",
			isValidPhoneNumber: true,
			autocomplete: null,
			deliveryAddress: "",
		};
	},

	computed: {
		deliveryFee() {
			if (this.deliveryLocation) {
				const deliveryLocation = this.physical.locations.find((location) => location._id === this.deliveryLocation);
				return Number(deliveryLocation.amount);
			}
			return 0;
		},
		totalAmount() {
			return this.amount + this.deliveryFee;
		},
	},

	mounted() {
		window.onmessage = async (e) => {
			// Get relevant data from the server and populate the DOM
			const { fidiaUsername, fidiaSlug } = JSON.parse(e.data);

			this.username = fidiaUsername;
			this.slug = fidiaSlug;
			this.errorOccured = false;

			try {
				const data = await fetch(this.baseUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `query($username: String!, $slug: String!) {
                                viewProductPage(username: $username, slug: $slug) {
                                    _id
                                    name
                                    image
                                    filename
                                    filesize
                                    description
                                    amount
                                    type
                                    user {
                                        bioSection {
                                            name
                                        }
                                        isCreatorVerified
                                    }
                                    physical {
                                        locations {
                                            _id
                                            location
                                            amount
                                            order
                                        }
                                    }
                                }
                            }
                    `,
						variables: { username: fidiaUsername, slug: fidiaSlug },
					}),
				});

				const response = await data.json();

				// If for any reason, this product cannot be fetched or an error occured while trying to fetch this product, show the error page
				if (!response.data) {
					this.displayLoader = false;
					this.showProduct = true;
					this.errorOccured = true;
					return;
				}

				const product = response.data.viewProductPage;

				this.name = product.name;
				this.image = product.image;
				this.creator = product.user.bioSection.name;
				this.description = product.description;
				this.amount = product.amount;
				this.productId = product._id;
				this.filename = product.filename;
				this.filesize = product.filesize;
				this.type = product.type;
				this.isCreatorVerified = product.user.isCreatorVerified;

				if (product.type === "physical") {
					this.physical = product.physical;
					this.locations = product.physical.locations
						.sort((a, b) => a.order - b.order)
						.map(({ _id, location }) => {
							return { key: _id, value: location };
						});

					try {
						if (window.google !== undefined) {
							this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById("address"), {
								fields: ["formatted_address"],
								componentRestrictions: { country: "ng" },
							});
							if (this.autocomplete) {
								window.google.maps.event.addListener(this.autocomplete, "place_changed", () => {
									this.deliveryAddress = this.autocomplete.getPlace().formatted_address;
								});
							}
						}
					} catch {}

					this.phoneNumberInput = window.intlTelInput(document.querySelector("#phone__number"), {
						onlyCountries: ["NG"],
						preferredCountries: ["NG"],
						utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
					});
				}

				this.displayLoader = false;
				this.showProduct = true;
			} catch {
				// If for any reason, this product cannot be fetched or an error occured while trying to fetch this product, show the error page
				this.displayLoader = false;
				this.showProduct = true;
				this.errorOccured = true;
			}
		};
	},

	destroyed() {
		// Remove the google maps instance when this component is unmounted
		if (this.autocomplete && window.google !== undefined) {
			try {
				window.google.maps.event.clearInstanceListeners(this.autocomplete);
			} catch {}
		}
	},

	setup() {
		return { v$: useVuelidate() };
	},

	methods: {
		closeProductPopup() {
			// Tell the parent document to close the iframe
			window.parent.postMessage("closeFidiaProductIframe", "*");
		},

		openBuyProduct(value) {
			this.showBuyProduct = value;
			if (this.transactionStatus === "successful") {
				this.buyersName = "";
				this.buyersEmail = "";
				this.recipientEmail = "";
				this.recipientName = "";
				this.isGiftingSomeone = false;
				this.deliveryAddress = "";
				this.deliveryLocation = "";
				this.phoneNumber = "";
				this.v$.$reset();
			}
		},

		openTransactionStatus(value) {
			this.showTransactionStatus = value;
		},

		tryAgain() {
			this.openTransactionStatus(false);
			setTimeout(() => {
				this.openBuyProduct(true);
			}, 100);
		},

		closedPaymentModal() {
			console.log("payment is closed"); // eslint-disable-line no-console
		},

		generateReference() {
			const date = new Date();
			return date.getTime().toString();
		},

		async purchaseProduct(purchaseProductInput) {
			try {
				const purchaseProductData = await fetch(this.baseUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `
                        mutation($input: ProductPurchaseInput!) {
                            purchaseProduct(input: $input) {
                                _id
                                url
                            }
                        }
                    `,
						variables: { input: purchaseProductInput },
					}),
				});

				const responseData = await purchaseProductData.json();
				return responseData.data.purchaseProduct;
			} catch {
				this.openTransactionStatus(true);
				this.transactionStatus = "failed";
			}
		},

		async makePaymentCallback(response) {
			this.openBuyProduct(false);
			this.openTransactionStatus(true);
			this.transactionStatus = "processing";

			if (response.status === "successful" || response.status === "completed") {
				// Send data to server and display success message
				const txId = String(response.transaction_id);
				const purchaseProductInput = {
					txId,
					productId: this.productId,
					name: this.buyersName,
					email: this.buyersEmail,
				};
				if (this.isGiftingSomeone) {
					purchaseProductInput.recipient = {
						name: this.recipientEmail,
						email: this.recipientEmail,
					};
				}
				if (this.type === "physical") {
					purchaseProductInput.physical = {
						deliveryLocation: this.deliveryLocation,
						address: this.deliveryAddress,
						phoneNumber: this.phoneNumberInput.getNumber(),
					};
				}

				const { _id, url } = await this.purchaseProduct(purchaseProductInput);
				if (_id) {
					this.transactionStatus = "successful";
					this.productDownloadUrl = url;
				}
			} else {
				// Show error message
				this.transactionStatus = "failed";
			}
		},

		getProduct() {
			this.v$.$touch();

			this.isValidPhoneNumber = this.phoneNumberInput.isValidNumber();

			if (this.v$.$invalid || !this.isValidPhoneNumber) return;

			if (this.totalAmount === 0) {
				this.getProductForFree();
			} else {
				this.makePaymentForProduct();
			}
		},

		async getProductForFree() {
			this.openBuyProduct(false);
			this.displayLoader = true;
			try {
				// Save Purchase Record
				const purchaseProductInput = {
					txId: "free",
					productId: this.productId,
					name: this.buyersName,
					email: this.buyersEmail,
				};
				if (this.isGiftingSomeone) {
					purchaseProductInput.recipient = {
						name: this.recipientName,
						email: this.recipientEmail,
					};
				}
				if (this.type === "physical") {
					purchaseProductInput.physical = JSON.stringify({
						deliveryLocation: this.deliveryLocation,
						address: this.deliveryAddress,
						phoneNumber: this.phoneNumberInput.getNumber(),
					});
				}
				const { _id, url } = await this.purchaseProduct(purchaseProductInput);
				if (_id) {
					this.productDownloadUrl = url;
					this.openTransactionStatus(true);
					this.transactionStatus = "successful";
				}
				this.displayLoader = false;
			} catch {
				this.displayLoader = false;
			}
		},

		makePaymentForProduct() {
			// public_key: "FLWPUBK-002b4d3ce050bd93f3b03f111bfba59f-X", flutterwave producttion key
			const meta = {
				productId: this.productId,
				buyersName: this.buyersName,
				buyersEmail: this.buyersEmail,
				purchaseType: "productPage",
			};
			if (this.isGiftingSomeone) {
				meta.recipient = JSON.stringify({
					name: this.recipientName,
					email: this.recipientEmail,
				});
			}
			if (this.type === "physical") {
				meta.physical = JSON.stringify({
					deliveryLocation: this.deliveryLocation,
					address: this.deliveryAddress,
					phoneNumber: this.phoneNumberInput.getNumber(),
				});
			}

			const paymentData = {
				public_key: "FLWPUBK_TEST-5e9c0b1c61cd1ae7d700e350eff2f18f-X",
				tx_ref: this.generateReference(),
				amount: this.totalAmount,
				currency: "NGN",
				payment_options: "",
				redirect_url: "",
				meta,
				customer: {
					name: this.buyersName,
					email: this.buyersEmail,
				},
				customizations: {
					title: `Purchase ${this.name} by ${this.creator}`,
					description: `Buy ${this.name} worth NGN ${this.totalAmount}`,
					logo: this.image,
				},
				callback: this.makePaymentCallback,
				onclose: this.closedPaymentModal,
			};

			window.FlutterwaveCheckout(paymentData);
		},

		downloadProduct() {
			if (this.type === "redirect") {
				window.open(this.productDownloadUrl, "_blank");
			} else if (this.type === "file") {
				this.downloadStarted = true;
				const request = new XMLHttpRequest();
				request.responseType = "blob";
				request.onload = () => {
					const reader = new FileReader();
					reader.readAsDataURL(request.response);
					reader.onload = (e) => {
						this.downloadDataURL(e.target.result);
					};
				};
				request.open("GET", this.productDownloadUrl);
				request.send();
			} else {
				this.openTransactionStatus(false);
			}
		},

		downloadDataURL(url) {
			// Create anchor tag
			const link = document.createElement("a");
			// attach a filename to the anchor tag
			link.download = this.filename;
			// Set the anchor's href attribute to the product download url
			link.href = url;
			// Insert the anchor element into the DOM
			document.body.appendChild(link);
			// Initiate a click on the anchor element
			link.click();
			// Remove the anchor element from the DOM
			document.body.removeChild(link);
		},
	},

	validations() {
		return {
			buyersName: { required },
			buyersEmail: { required, email },
			recipientName: {
				required: requiredIf(function () {
					return this.isGiftingSomeone;
				}),
			},
			recipientEmail: {
				email,
				required: requiredIf(function () {
					return this.isGiftingSomeone;
				}),
			},
			deliveryLocation: {
				required: requiredIf(function () {
					return this.type === "physical";
				}),
			},
			deliveryAddress: {
				required: requiredIf(function () {
					return this.type === "physical";
				}),
			},
			phoneNumber: {
				required: requiredIf(function () {
					return this.type === "physical";
				}),
			},
		};
	},
};

const app = createApp(App);
app.mount("#app");
