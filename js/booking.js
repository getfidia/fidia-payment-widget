const { createApp } = Vue;
const DatePicker = window.DatePicker;
const DateTime = window.luxon.DateTime;
const { required, requiredIf, email } = window.VuelidateValidators;
const { useVuelidate } = window.Vuelidate;

const bookingApp = {
	components: {
		"date-picker": DatePicker,
	},
	data() {
		const dateMaps = {
			sunday: 0,
			monday: 1,
			tuesday: 2,
			wednesday: 3,
			thursday: 4,
			friday: 5,
			saturday: 6,
		};

		const datePickerLang = {
			monthFormat: "MMMM",
		};

		return {
			customerName: "",
			customerEmail: "",
			mode: "booking",
			showBookingWidget: false,
			displayLoader: true,
			baseUrl: "https://getfidia-production.herokuapp.com/graphql",
			username: "",
			slug: "",
			booking: {},
			bookingSlots: [],
			defaultValue: "",
			selectedDate: "",
			selectedStartTime: "",
			dateMaps,
			haveConnectedGoogleCalendar: false,
			availableTimeSlots: [],
			startTimesForSelectedDate: [],
			datePickerLang,
			isFetchingAvailableSlots: false,
			errorOccured: false,
			paymentStatus: "",
		};
	},

	computed: {
		formattedShortDate() {
			if (this.selectedDate) {
				return DateTime.fromMillis(this.selectedDate).toFormat(
					"ccc, dd LLL."
				);
			}
			return "";
		},
		formattedLongDate() {
			if (this.selectedDate) {
				return DateTime.fromMillis(this.selectedDate).toLocaleString(
					DateTime.DATE_HUGE
				);
			}
			return "";
		},
		bookingDuration() {
			if (
				this.booking.duration === 15 ||
				this.booking.duration === 30 ||
				this.booking.duration === 60
			) {
				return `${this.booking.duration} mins`;
			} else if (this.booking.duration % 60 !== 0) {
				return `${this.booking.duration} mins`;
			} else {
				return `${this.booking.duration / 60} hours`;
			}
		},
		bookedTimeSlot() {
			if (this.selectedStartTime) {
				const { _id, startTime, endTime, date } =
					this.availableTimeSlots.find(
						(slot) => slot.key === this.selectedStartTime
					);
				return { _id, startTime, endTime, date };
			}
			return {};
		},
	},

	async mounted() {
		window.onmessage = async (e) => {
			const { fidiaUsername, fidiaSlug } = JSON.parse(e.data);
			this.username = fidiaUsername;
			this.slug = fidiaSlug;

			try {
				this.errorOccured = false;
				this.displayLoader = true;
				await this.fetchBooking();
				await this.fetchBookingSlots();
				this.showBookingWidget = true;
				this.displayLoader = false;
			} catch (error) {
				this.showBookingWidget = true;
				this.displayLoader = false;
				this.errorOccured = true;
			}
		};
	},

	setup() {
		return { v$: useVuelidate() };
	},

	methods: {
		async fetchBooking() {
			const data = await fetch(this.baseUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `query($username: String!, $slug: String!) {
                        viewBookingPage(username: $username, slug: $slug) {
                            _id
                            name
                            amount
                            description
                            duration
                            location
                            locationUrl
                            timezone
                            user {
                                name
                                profileImage
                            }
                            slots {
                                day
                            }
                            indefiniteDateRange
                            dateRange {
                                start
                                end
                            }
                            user {
                                googleOAuth
                            }
                        }
                    }`,
					variables: { username: this.username, slug: this.slug },
				}),
			});

			const { data: booking } = await data.json();
			this.booking = booking.viewBookingPage;
			this.haveConnectedGoogleCalendar = this.booking.user.googleOAuth;
		},
		async fetchBookingSlots() {
			const data = await fetch(this.baseUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `query($input: ViewAvailableSlotsInput!) {
                        viewAvailableSlots(input: $input) {
                            slots {
                                date
                                day
                                time {
                                    startTime
                                    endTime
                                }
                                _id
                            }
                        }
                    }`,
					variables: { input: { bookingId: this.booking._id } },
				}),
			});

			const { data: bookingSlots } = await data.json();
			this.bookingSlots = bookingSlots.viewAvailableSlots.slots;
			this.defaultValue = this.bookingSlots[0].date;
		},
		disabledDates(date) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			// Returns an array of the created slot days and their corresponding date index: monday - 0, tuesday - 1 .....
			const daysNumberMap = [...this.booking.slots].map((slot) => {
				return this.dateMaps[slot.day];
			});
			// Checks if the current day is included in the days number map
			const isADisabledDate = !daysNumberMap.includes(date.getDay());
			// Checks if there's a date range so as to only enable dates within the set range
			if (this.booking.indefiniteDateRange) {
				return (
					date < today ||
					isADisabledDate ||
					!this.haveConnectedGoogleCalendar
				);
			} else {
				const startDate = new Date(
					parseInt(this.booking.dateRange.start, 10)
				);
				const endDate = new Date(
					parseInt(this.booking.dateRange.end, 10)
				);

				startDate.setHours(0, 0, 0, 0);
				endDate.setHours(0, 0, 0, 0);

				return (
					date < today ||
					isADisabledDate ||
					date < startDate ||
					date > endDate ||
					!this.haveConnectedGoogleCalendar
				);
			}
		},
		selectTimeSlot(timeSlot) {
			this.selectedStartTime = timeSlot;
			this.mode = "book-session";
		},
		convertTimezoneToOffset(timezone) {
			const today = new Date().toISOString();
			const offset = DateTime.fromISO(today, { zone: timezone }).toFormat(
				"ZZZZ"
			);
			return offset;
		},
		checkAvailableTimeSlots(date) {
			this.selectedStartTime = "";
			this.availableTimeSlots = [];
			this.startTimesForSelectedDate = [];
			// Find the slot available slots that are available for the date selected on the calendar
			const selectedDate = DateTime.fromMillis(date).toLocaleString(
				DateTime.DATE_FULL
			);
			const availableSlotsForSelectedDate = this.bookingSlots.find(
				(slot) => {
					return (
						DateTime.fromISO(slot.date).toLocaleString(
							DateTime.DATE_FULL
						) === selectedDate
					);
				}
			);
			// If a particular date matches the date gotten from the server, generate an array of the start and end times for the selected date
			if (availableSlotsForSelectedDate !== undefined) {
				this.availableTimeSlots =
					availableSlotsForSelectedDate.time.map(
						({ startTime, endTime }) => {
							return {
								key: startTime,
								value: this.convertTimeToAMPM(startTime),
								startTime,
								endTime,
								_id: availableSlotsForSelectedDate._id,
								date: availableSlotsForSelectedDate.date,
							};
						}
					);
				// This array holds just the start date so that the user can pick the time they want to book
				this.startTimesForSelectedDate =
					availableSlotsForSelectedDate.time.map(({ startTime }) => {
						return {
							key: startTime,
							value: this.convertTimeToAMPM(startTime),
						};
					});
				// Scroll back to the top of the times picker when the date changes
				this.$refs?.timeSlots?.scrollTo({ top: 0, behavior: "smooth" });
			}
		},
		convertTimeToAMPM(time) {
			let startHour = Number(time.split(":")[0]);
			let startMinute = Number(time.split(":")[1]);

			const meridianType = startHour >= 12 ? "PM" : "AM";
			startHour = startHour > 12 ? `${startHour - 12}` : startHour;
			startHour = startHour < 10 ? `0${startHour}` : startHour;
			startMinute = startMinute < 10 ? `0${startMinute}` : startMinute;

			return `${startHour}:${startMinute} ${meridianType}`;
		},
		async fetchAvailableTimeSlots(date) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			// Check if the selected calendar month and year is in the past
			const todaysMonthAndYear = new Date(
				today.getFullYear(),
				today.getMonth()
			);
			const currentMonthAndYear = new Date(
				date.getFullYear(),
				date.getMonth()
			);
			const isADateInThePast = currentMonthAndYear < todaysMonthAndYear;

			// Checks is the selected calendar and year is not between the selected date range
			let isADateGreaterThanBookingEndDate = false;
			let isADateLesserThanBookingStartDate = false;
			if (!this.booking.indefiniteDateRange) {
				let bookingStartDate = new Date(
					parseInt(this.booking.dateRange.start)
				);
				let bookingEndDate = new Date(
					parseInt(this.booking.dateRange.end)
				);
				bookingStartDate = new Date(
					bookingStartDate.getFullYear(),
					bookingStartDate.getMonth()
				);
				bookingEndDate = new Date(
					bookingEndDate.getFullYear(),
					bookingEndDate.getMonth()
				);
				isADateGreaterThanBookingEndDate =
					currentMonthAndYear.getTime() > bookingEndDate;
				isADateLesserThanBookingStartDate =
					currentMonthAndYear.getTime() < bookingStartDate;
			}

			if (
				isADateInThePast ||
				isADateGreaterThanBookingEndDate ||
				isADateLesserThanBookingStartDate ||
				!this.haveConnectedGoogleCalendar
			)
				return;

			try {
				this.isFetchingAvailableSlots = true;
				const month = date.getMonth() + 1;
				const year = date.getFullYear();

				const data = await fetch(this.baseUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						query: `query($input: ViewAvailableSlotsInput!) {
                            viewAvailableSlots(input: $input) {
                                slots {
                                    date
                                    day
                                    time {
                                        startTime
                                        endTime
                                    }
                                    _id
                                }
                            }
                        }`,
						variables: {
							input: { bookingId: this.booking._id, month, year },
						},
					}),
				});

				const { data: bookingSlots } = await data.json();

				this.bookingSlots = bookingSlots.viewAvailableSlots.slots;
				this.isFetchingAvailableSlots = false;
			} catch {
				this.isFetchingAvailableSlots = false;
			}
		},
		closeBookingModal() {
			this.clearSelectedTimeSlot();
			this.showBookingWidget = false;
			this.mode = "booking";
			// Tell the parent document to close the iframe
			window.parent.postMessage("closeFidiaBookingIframe", "*");
		},
		async validateBookSessionInput() {
			this.v$.$validate();

			if (this.v$.$error) return;

			if (this.booking.amount > 0) {
				await this.initiatePaymentWithFluttterwave();
			} else {
				await this.initializeFreeSessionBooking();
			}
		},
		closedPaymentModal() {},
		generateReference() {
			const date = new Date();
			return date.getTime().toString();
		},
		async handleFlutterwavePaymentCallback(response) {
			this.displayLoader = true;

			if (
				response.status === "successful" ||
				response.status === "completed"
			) {
				const txId = String(response.transaction_id);
				const bookSessionInput = {
					txId,
					bookingId: this.booking._id,
					name: this.customerName,
					email: this.customerEmail,
					slot: this.bookedTimeSlot,
				};
				try {
					await this.bookSession(bookSessionInput);
					this.displayLoader = false;
					this.paymentStatus = "success";
				} catch (err) {
					this.displayLoader = false;
					this.paymentStatus = "failed";
				}
			} else {
				this.displayLoader = false;
				this.paymentStatus = "failed";
			}
		},
		async initiatePaymentWithFluttterwave() {
			const meta = {
				bookingId: this.booking._id,
				name: this.customerName,
				email: this.customerEmail,
				slot: this.bookedTimeSlot,
			};
			const paymentData = {
				public_key: "FLWPUBK-27531e6d80605ea479845bb8a142b7a2-X",
				tx_ref: this.generateReference(),
				amount: this.booking.amount,
				currency: "NGN",
				payment_options: "",
				redirect_url: "",
				meta,
				customer: {
					name: this.customerName,
					email: this.customerEmail,
				},
				customizations: {
					title: `Book ${this.booking.name} by ${this.booking.user.name}`,
					description: `Book ${this.booking.name} worth NGN ${this.booking.amount}`,
					logo: this.booking.user.profileImage,
				},
				callback: this.handleFlutterwavePaymentCallback,
				onclose: this.closedPaymentModal,
			};
			window.FlutterwaveCheckout(paymentData); // Initialize the payment with flutterwave
		},
		async initializeFreeSessionBooking() {
			this.displayLoader = true;
			const bookSessionInput = {
				txId: "free",
				bookingId: this.booking._id,
				name: this.customerName,
				email: this.customerEmail,
				slot: this.bookedTimeSlot,
			};
			try {
				await this.bookSession(bookSessionInput);
				this.displayLoader = false;
				this.mode = "payment-status";
			} catch {
				this.displayLoader = false;
				this.paymentStatus = "failed";
				this.mode = "payment-status";
			}
		},
		async bookSession(bookSessionInput) {
			const data = await fetch(this.baseUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					query: `mutation ($input: BookSessionInput!) {
                        bookSession(input: $input) {
                            _id
                        }
                    }`,
					variables: { input: bookSessionInput },
				}),
			});

			const { data: bookSession } = await data.json();
			if (bookSession.bookSession._id) {
				this.paymentStatus = "success";
				return;
			}
			this.paymentStatus = "failed";
		},
		closeOrTryAgain() {
			if (this.paymentStatus === "success") {
				this.clearSelectedTimeSlot();
				this.closeBookingModal();
				this.mode = "booking";
			} else {
				this.mode = "book-session";
			}
		},
		clearSelectedTimeSlot() {
			this.startTimesForSelectedDate =
				this.startTimesForSelectedDate.filter(
					(time) => time.key !== this.selectedStartTime
				);
			this.selectedStartTime = "";
			this.customerName = "";
			this.customerEmail = "";
			this.v$.$reset();
		},
	},

	validations() {
		return {
			customerName: { required },
			customerEmail: { required, email },
		};
	},
};
const app = createApp(bookingApp);
app.mount("#booking-app");
