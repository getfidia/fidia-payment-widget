const { createApp } = Vue;
const { required, requiredIf, email } = window.VuelidateValidators;
const { useVuelidate } = window.Vuelidate;
const DateTime = window.luxon.DateTime;

const App = {
	data() {
		return {
			showProduct: false,
			displayLoader: true,
			baseUrl: "https://getfidia-production.herokuapp.com/graphql",
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
			ticket: {},
			purchaseCount: 0,
			subscriptionRedirectUrl: "",
			subscriptionTiers: [],
			selectedTier: "",
			secondsBeforeRedirect: 3,
			redirectInterval: null,
			haveADiscountCode: false,
			discountCode: "",
			haveAppliedADiscountCode: "",
			discountedAmount: 0,
			discountCodeMessage: "",
			discountCodeMessageType: "",
		};
	},

	watch: {
		haveADiscountCode(newValue) {
			if (!newValue) {
				this.haveAppliedADiscountCode = false;
				this.discountedAmount = 0;
			}
		},
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
			if (this.type === "subscription") {
				return this.selectedTierData.amount;
			}
			return this.amount + this.deliveryFee;
		},
		totalAmountAfterDiscount() {
			let totalAmount = this.totalAmount;
			if (this.haveAppliedADiscountCode) {
				totalAmount = totalAmount - this.discountedAmount > 0 ? totalAmount - this.discountedAmount : 0;
			}
			return totalAmount;
		},
		formattedEventDate() {
			const startDate = this.formatTicketDate(this.ticket.startDate, this.ticket.timezone);
			const endDate = this.formatTicketDate(this.ticket.endDate, this.ticket.timezone);

			if (startDate.date === endDate.date) {
				return `${startDate.date} ${startDate.time} - ${endDate.time} ${startDate.offset}`;
			} else {
				return `${startDate.date} ${startDate.time} - ${endDate.date} ${endDate.time} ${startDate.offset}`;
			}
		},
		selectedTierData() {
			if (this.selectedTier) {
				return this.subscriptionTiers.find((tier) => tier._id === this.selectedTier);
			}
			return {};
		},
		shouldShowBuyButton() {
			return (this.type === "subscription" && this.selectedTier) || ["physical", "file", "redirect", "ticket"].includes(this.type);
		},
		haveReachedTicketProductLimit() {
			return this.type === "ticket" && this.ticket.maxCapacity && this.ticket.maxCapacity > 0 && this.purchaseCount >= this.ticket.maxCapacity;
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
                                    ticket {
                                        location
                                        locationUrl
                                        startDate
                                        endDate
                                        timezone
                                        maxCapacity
                                        purchaseCount
                                    }
                                    subscription {
                                        redirect
                                        tier {
                                            _id
                                            name
                                            amount
                                            order
                                            interval
                                            planId
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

				if (product.type === "ticket") {
					this.ticket = product.ticket;
					this.purchaseCount = product?.ticket?.purchaseCount ?? 0;
				}

				if (product.type === "subscription") {
					if (product.subscription.redirect) this.subscriptionRedirectUrl = product.subscription.redirect;
					this.subscriptionTiers = product.subscription.tier.sort((a, b) => a.order - b.order);
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
			// Limit the User from purchasing a ticket product if the maxCapacity have been reached
			if (this.haveReachedTicketProductLimit) return;

			this.showBuyProduct = value;
		},

		openTransactionStatus(value) {
			this.showTransactionStatus = value;
			if (this.transactionStatus === "successful") {
				this.buyersName = "";
				this.buyersEmail = "";
				if (this.isGiftingSomeone) {
					this.recipientEmail = "";
					this.recipientName = "";
					this.isGiftingSomeone = false;
				}
				if (this.type === "physical") {
					this.deliveryAddress = "";
					this.deliveryLocation = "";
					this.phoneNumber = "";
				}
				if (this.type === "subscription") {
					this.selectedTier = "";
				}
				if (this.type === "ticket") this.purchaseCount += 1;
				this.v$.$reset();
				this.closeProductPopup();
				this.transactionStatus = "";
        
				if (this.haveADiscountCode) {
					this.haveADiscountCode = false;
					this.haveAppliedADiscountCode = false;
					this.discountedAmount = 0;
					this.discountCode = "";
				}
        
				if (this.type === "file") this.downloadStarted = false;
			}
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
				if (this.type === "subscription") {
					purchaseProductInput.subscription = {
						tier: this.selectedTier,
					};
				}
				if (this.haveAppliedADiscountCode) purchaseProductInput.discountCode = this.discountCode;
				const { _id, url } = await this.purchaseProduct(purchaseProductInput);
				if (_id) {
					this.transactionStatus = "successful";
					this.productDownloadUrl = url;

					// In cases where the subscription product has a redirect url, redirect the user after 3 second
					if (this.type === "subscription" && !!this.subscriptionRedirectUrl) {
						this.redirectAfterSubscriptionProductPayment();
					}
				}
			} else {
				// Show error message
				this.transactionStatus = "failed";
			}
		},

		async getProduct() {
			this.v$.$touch();

			if (this.type === "physical") this.isValidPhoneNumber = this.phoneNumberInput.isValidNumber();

			if (this.v$.$invalid || (this.type === "physical" && !this.isValidPhoneNumber)) return;

			if (this.totalAmountAfterDiscount === 0) {
				this.getProductForFree();
			} else {
				if (this.haveADiscountCode) {
					const discountedAmount = await this.applyDiscountCode();
					if (!discountedAmount) {
						this.haveAppliedADiscountCode = false;
						this.discountedAmount = 0;
						return;
					}
				}
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
				if (this.type === "physical") {
					purchaseProductInput.physical = {
						deliveryLocation: this.deliveryLocation,
						address: this.deliveryAddress,
						phoneNumber: this.phoneNumberInput.getNumber(),
					};
				}
				if (this.type === "subscription") {
					purchaseProductInput.subscription = {
						tier: this.selectedTier,
					};
				}
				if (this.haveAppliedADiscountCode) purchaseProductInput.discountCode = this.discountCode;
				const { _id, url } = await this.purchaseProduct(purchaseProductInput);
				if (_id) {
					this.productDownloadUrl = url;
					this.openTransactionStatus(true);
					this.transactionStatus = "successful";
					// In cases where the subscription product has a redirect url, redirect the user after 3 second
					if (this.type === "subscription" && !!this.subscriptionRedirectUrl) {
						this.redirectAfterSubscriptionProductPayment();
					}
				}
				this.displayLoader = false;
			} catch {
				this.displayLoader = false;
			}
		},

		makePaymentForProduct() {
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
			if (this.type === "subscription") {
				meta.subscription = JSON.stringify({
					tier: this.selectedTier,
				});
			}
			const paymentData = {
                public_key: "FLWPUBK-002b4d3ce050bd93f3b03f111bfba59f-X",
				tx_ref: this.generateReference(),
				amount: this.totalAmountAfterDiscount,
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
					description: `Buy ${this.name} worth NGN ${this.totalAmountAfterDiscount}`,
					logo: this.image,
				},
				callback: this.makePaymentCallback,
				onclose: this.closedPaymentModal,
			};

			if (this.type === "subscription" && this.selectedTierData.interval !== "none") {
				paymentData.payment_plan = this.selectedTierData.planId;
				paymentData.meta = { ...meta, planId: this.selectedTierData.planId };
			}

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

		formatTicketDate(ticketDate, zone = "Africa/Lagos") {
			const parsedDate = parseInt(ticketDate, 10);
			const date = DateTime.fromMillis(parsedDate, { zone }).toFormat("ccc, LLL dd, y");
			const time = DateTime.fromMillis(parsedDate, { zone }).toFormat("h:mm a");

			const offset = DateTime.fromMillis(parsedDate, { zone }).toFormat("ZZZZ");

			return { date, time, offset };
		},

		formatSubscriptionInterval(interval) {
			let text = "";
			switch (interval) {
				case "none":
					text = "One Time";
					break;
				case "sixMonths":
					text = "Six Months";
					break;
				default:
					text = `${interval.charAt(0).toUpperCase()}${interval.slice(1)}`;
					break;
			}
			return text;
		},

		async applyDiscountCode() {
			this.v$.discountCode.$touch();
			if (this.v$.discountCode.$invalid) return;
			this.displayLoader = true;
			try {
				const discountCodeInput = {
					discountCode: this.discountCode,
					productId: this.productId,
					email: this.buyersEmail,
				};
				const calculateDiscountAmountData = await fetch(this.baseUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `
                                query($input: CalculateDiscountAmountInput!) {
                                    calculateDiscountAmount(input: $input)
                                }
                        `,
						variables: {
							input: discountCodeInput,
						},
					}),
				});
				const responseData = await calculateDiscountAmountData.json();
				if (responseData.data) {
					this.haveAppliedADiscountCode = true;
					this.discountedAmount = responseData.data.calculateDiscountAmount;
					this.displayLoader = false;
					this.discountCodeMessageType = "success";
					this.discountCodeMessage = "Discount Code have been applied sucessfully";
					this.clearDiscountCodeMessage();
					return responseData.data.calculateDiscountAmount;
				} else {
					this.displayLoader = false;
					this.discountCodeMessageType = "error";
					const errorMessage = responseData.errors[0].message;
					if (errorMessage.includes("does not apply")) {
						this.discountCodeMessage = "The provided discount code cannot be applied to this product. Verify the code and try again.";
					} else if (errorMessage.includes("not found")) {
						this.discountCodeMessage = "This provided discount code does not exist. Verify the code and try again.";
					} else if (errorMessage.includes("has expired")) {
						this.discountCodeMessage = "This provided discount code have expired. Verify the code and try again.";
					} else if (errorMessage.includes("yet active")) {
						this.discountCodeMessage = "This provided discount code is not yet active. Verify the code and try again.";
					} else if (errorMessage.includes("used up")) {
						this.discountCodeMessage = "This provided discount code have been used up. Verify the code and try again.";
					} else if (errorMessage.includes("used by")) {
						this.discountCodeMessage = "This provided discount code have already been used by you. Verify the code and try again.";
					} else {
						this.discountCodeMessage = "An error occurred trying to apply this discount code. Verify the code and try again.";
					}
					this.clearDiscountCodeMessage();
				}
			} catch {
				this.displayLoader = false;
			}
		},

		removeDiscountCode() {
			this.discountCodeMessageType = "success";
			this.discountCodeMessage = "Discount Code have been removed sucessfully";
			this.haveAppliedADiscountCode = false;
			this.discountedAmount = 0;
			this.clearDiscountCodeMessage();
		},

		clearDiscountCodeMessage() {
			setTimeout(() => {
				this.discountCodeMessage = "";  
     }, 3000);
      
		redirectAfterSubscriptionProductPayment() {
			this.redirectInterval = setInterval(() => {
				this.secondsBeforeRedirect--;
			}, 1000);

			setTimeout(() => {
				clearInterval(this.redirectInterval);
				this.secondsBeforeRedirect = 3;
				this.openTransactionStatus(false);
				window.open(this.subscriptionRedirectUrl, "_blank");
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
			discountCode: {
				required: requiredIf(function () {
					return this.haveADiscountCode;
				}),
			},
		};
	},
};

const app = createApp(App);
app.mount("#app");
