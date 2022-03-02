import Vue from "vue"

Vue.directive('fidia', {
    bind: function (el, binding) {
        //for debugging alone
        el.style.color = "green";

        //get the data bindings on the directive and set the element innerText to the provided text value
        const userData = binding.value;
        el.innerText = userData.slug;

        el.onclick = () => {
            const d = document;
            const f = d.createElement("iframe");
            const w = window;


            // f.src = "https://embed.getfidia.com/payment.html";
            f.setAttribute("src", "http://127.0.0.1:3000/src/payment.html")
            f.frameborder = 0;
            f.allowtransparency = true;
            f.style = "display:block; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
            f.name = "Fidia Widget";
            f.id = "fidia-embed-iframe";
            d.getElementsByTagName("body")[0].appendChild(f);


            //parse the user data obtained from v-fidia directive binding
            const { name: fidiaUsername, slug: fidiaSlug } = userData
            const fidiaEmbedData = JSON.stringify({
                fidiaUsername,
                fidiaSlug,
            });

            //for debugging alone
            console.log(fidiaEmbedData);

            // Child window and parent window can only communicate over events
            const fidiaIframe = d.querySelector("#fidia-embed-iframe");
            fidiaIframe.contentWindow.postMessage(fidiaEmbedData, '*');

            w.onmessage = (e) => {
                if (e.data == 'closeFidiaIframe') {
                    // Close the iframe when this event is emitted to the parent document,
                    const fidiaIframe = document.querySelector('#fidia-embed-iframe');
                    fidiaIframe.style.display = 'none';
                }
            }

        }

    }
})



