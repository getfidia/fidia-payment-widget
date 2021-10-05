(function(){
    const d = document;
    const w = window;
    const s = d.createElement("iframe");

    s.src = "./index.html";
    // s.src = "http://embed.getfidia.com/";
    s.frameborder = 0;
    s.allowtransparency= true;
    s.style = "display:none; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
    s.name = "Fidia Widget";
    s.id = "fidia-embed-iframe";
    d.getElementsByTagName("body")[0].appendChild(s);

    w.onload = () => {
        let templateFidiaButton = d.querySelectorAll('.fidia-embed-target');
        templateFidiaButton = Array.prototype.slice.call(templateFidiaButton);

        // Replace template buttons with fidia buttons
        for(let i = 0; i < templateFidiaButton.length; i++) {
            const currentButton = templateFidiaButton[i];
            const currentButtonParent = currentButton.parentNode;

            const fidiaUsername = currentButton.getAttribute("data-fidia-username");
            const fidiaSlug = currentButton.getAttribute("data-fidia-slug");

            const newFidiaButton = d.createElement("button");
            newFidiaButton.innerHTML = "Fidia";
            newFidiaButton.setAttribute("data-fidia-username", fidiaUsername);
            newFidiaButton.setAttribute("data-fidia-slug", fidiaSlug);

            currentButtonParent.replaceChild(newFidiaButton, currentButton);

            // Open fidia widget when fidia button is clicked
            newFidiaButton.addEventListener("click", () => {
                const fidiaUsername = currentButton.getAttribute("data-fidia-username");
                const fidiaSlug = currentButton.getAttribute("data-fidia-slug");

                const fidiaIframe = d.querySelector("#fidia-embed-iframe");

                // TODO: Load the data of this payment link 
    
                fidiaIframe.style.display = "block";
            });
        }
    }

    
    let fidiaEmbedButton = d.querySelectorAll('.fidia-embed-button');
    fidiaEmbedButton = Array.prototype.slice.call(fidiaEmbedButton);
    
})()

window.onmessage = (e) => {
    if(e.data = 'closeFidiaIframe'){
        // Close the iframe when this event id emittedm to the parent document,
        const fidiaIframe = document.querySelector('#fidia-embed-iframe');
        fidiaIframe.style.display = 'none';
    }
}
