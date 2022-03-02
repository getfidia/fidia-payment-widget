import Vue from "vue"

Vue.directive('fidia', {
    bind: function (el, binding) {
        //for debugging alone
        el.style.color = "purple";

        //get the data bindings on the directive and set the element innerText to the provided text value
        const userData = binding.value;


        el.onclick = () => {
            const d = document;
            // const w = window;
            const f = d.createElement("iframe");

            f.src = "https://embed.getfidia.com/payment.html";
            // f.src = "../payment.html";
            f.frameborder = 0;
            f.allowtransparency = true;
            f.style = "display:none; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
            f.name = "Fidia Widget";
            f.id = "fidia-embed-iframe";
            d.getElementsByTagName("body")[0].appendChild(f);


                //parse the user data obtained from v-fidia directive binding
                const { name: fidiaUsername, slug: fidiaSlug } = userData
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
            // });
        }
    }
})




