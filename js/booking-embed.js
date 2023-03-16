/*!
 * Fidia Payment Links Widget
 * (c) 2021 - Present Gbadebo Bello
 * Released under the MIT License.
 */

(function () {
    const d = document;
	const w = window;
	const f = d.createElement("iframe");

    f.src = "https://embed.getfidia.com/booking.html";
    // f.src = "../booking.html";
    f.frameborder = 0;
	f.allowtransparency = true;
	f.style = "display:none; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
	f.name = "Fidia Booking Widget";
	f.id = "fidia-booking-embed-iframe";
	d.getElementsByTagName("body")[0].appendChild(f);

	const s = d.createElement("link");
	s.rel = "stylesheet";
    s.href = "https://embed.getfidia.com/css/button.css";
	// s.href = '../css/button.css';
	d.getElementsByTagName("head")[0].appendChild(s);

    // Get the user specified template button(s)
	let templateFidiaButton = d.querySelectorAll(".fidia-booking-embed");
	templateFidiaButton = Array.prototype.slice.call(templateFidiaButton);

    // Replace template buttons with fidia button(s)
	for (let i = 0; i < templateFidiaButton.length; i++) {
		const currentButton = templateFidiaButton[i];
		const currentButtonParent = currentButton.parentNode;

		// create a new button to embed
		const newFidiaButton = d.createElement("button");
		newFidiaButton.innerHTML = currentButton.innerHTML;
		newFidiaButton.setAttribute("fidia-username", currentButton.getAttribute("fidia-username"));
		newFidiaButton.setAttribute("fidia-booking-slug", currentButton.getAttribute("fidia-booking-slug"));
		newFidiaButton.setAttribute("class", "fidia-widget-button");

		currentButtonParent.replaceChild(newFidiaButton, currentButton);

        // Open fidia widget when fidia button is clicked
		newFidiaButton.addEventListener("click", (e) => {
			const fidiaUsername = e.target.getAttribute("fidia-username");
			const fidiaSlug = e.target.getAttribute("fidia-booking-slug");

			const fidiaEmbedData = JSON.stringify({
				fidiaUsername,
				fidiaSlug,
			});

			const fidiaBookingIframe = d.querySelector("#fidia-booking-embed-iframe");
			setTimeout(() => {
				fidiaBookingIframe.style.display = "block";
			}, 30);

			// Child window and parent window can only communicate over events
			document.body.style.overflow = "hidden";
			fidiaBookingIframe.contentWindow.postMessage(fidiaEmbedData, "*");
		});
    }

    w.onmessage = (e) => {
		if (e.data === "closeFidiaBookingIframe") {
			// Close the iframe when this event is emitted to the parent document,
			const bookingIframes = document.querySelectorAll("#fidia-booking-embed-iframe");
            bookingIframes.forEach((iframe) => {
				iframe.style.display = "none";
			});
			document.body.style.overflow = "visible";
		}
	};
})();