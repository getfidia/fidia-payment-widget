/*!
 * Fidia Payment Links Widget
 * (c) 2021 - Present Gbadebo Bello
 * Released under the MIT License.
 */
(function () {
    const d = document;
    const w = window;
    const f = d.createElement("iframe");

    f.src = "https://embed.getfidia.com/product.html";
    // f.src = "../product.html";
    f.frameborder = 0;
    f.allowtransparency = true;
    f.style = "display:none; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
    f.name = "Fidia Widget";
    f.id = "fidia-embed-iframe";
    d.getElementsByTagName("body")[0].appendChild(f);

    const s = d.createElement("link");
    s.rel = "stylesheet";
    s.href = "https://embed.getfidia.com/css/button.css";
    // s.href = '../css/button.css';
    d.getElementsByTagName("head")[0].appendChild(s);

    // Get the user specified template button(s)
    let templateFidiaButton = d.querySelectorAll(".fidia-embed-target");
    templateFidiaButton = Array.prototype.slice.call(templateFidiaButton);

    // Replace template buttons with fidia button(s)
    for (let i = 0; i < templateFidiaButton.length; i++) {
        const currentButton = templateFidiaButton[i];
        const currentButtonParent = currentButton.parentNode;

        // create a new button to embed
        const newFidiaButton = d.createElement("button");
        newFidiaButton.innerHTML = `
            <svg style="padding-right: 10px;" width="26" height="29" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 9.99992C14.6519 9.99992 15.9408 10.3909 17.0371 11.1235C18.1335 11.856 18.9879 12.8972 19.4925 14.1154C19.9971 15.3335 20.1291 16.674 19.8719 17.9672C19.6147 19.2604 18.9797 20.4483 18.0474 21.3806C17.115 22.313 15.9271 22.9479 14.6339 23.2052C13.3407 23.4624 12.0003 23.3304 10.7821 22.8258C9.56393 22.3212 8.52274 21.4667 7.7902 20.3704C7.05766 19.2741 6.66666 17.9851 6.66666 16.6666C6.66867 14.8991 7.37169 13.2046 8.6215 11.9548C9.87131 10.7049 11.5658 10.0019 13.3333 9.99992ZM13.3333 3.33325C10.6962 3.33325 8.11838 4.11524 5.92573 5.58032C3.73307 7.04541 2.02411 9.12779 1.01494 11.5641C0.00576946 14.0005 -0.258275 16.6814 0.256195 19.2678C0.770664 21.8542 2.04054 24.23 3.90524 26.0947C5.76994 27.9594 8.14571 29.2293 10.7321 29.7437C13.3185 30.2582 15.9994 29.9941 18.4358 28.985C20.8721 27.9758 22.9545 26.2668 24.4196 24.0742C25.8847 21.8815 26.6667 19.3037 26.6667 16.6666C26.6667 13.1304 25.2619 9.73898 22.7614 7.23849C20.2609 4.73801 16.8696 3.33325 13.3333 3.33325Z" fill="white"/>
                <path d="M13.3333 6.66667C15.1743 6.66667 16.6667 5.17428 16.6667 3.33333C16.6667 1.49238 15.1743 0 13.3333 0C11.4924 0 10 1.49238 10 3.33333C10 5.17428 11.4924 6.66667 13.3333 6.66667Z" fill="#F49C00"/>
            </svg>
            Buy Now
        `;
        newFidiaButton.setAttribute("data-fidia-username", currentButton.getAttribute("data-fidia-username"));
        newFidiaButton.setAttribute("data-fidia-slug", currentButton.getAttribute("data-fidia-slug"));
        newFidiaButton.setAttribute("class", "fidia-widget-button");

        currentButtonParent.replaceChild(newFidiaButton, currentButton);

        // Open fidia widget when fidia button is clicked
        newFidiaButton.addEventListener("click", (e) => {
            const fidiaUsername = e.target.getAttribute("data-fidia-username");
            const fidiaSlug = e.target.getAttribute("data-fidia-slug");

            const fidiaEmbedData = JSON.stringify({
                fidiaUsername,
                fidiaSlug,
            });

            const fidiaIframe = d.querySelector("#fidia-embed-iframe");
            setTimeout(() => {
                fidiaIframe.style.display = "block";
            }, 30);

            // Child window and parent window can only communicate over events
            fidiaIframe.contentWindow.postMessage(fidiaEmbedData, "*");
        });
    }

    w.onmessage = (e) => {
        if ((e.data = "closeFidiaIframe")) {
            // Close the iframe when this event is emitted to the parent document,
            const fidiaIframe = document.querySelector("#fidia-embed-iframe");
            fidiaIframe.style.display = "none";
        }
    };
})();
