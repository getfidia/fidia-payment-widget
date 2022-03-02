import Vue from "vue"

Vue.directive('fidia', {
    bind: function (el, binding) {
        //get the data bindings on the v-fidia directive 
        const userData = binding.value;

        const fidiaScript = document.createElement('script');
        fidiaScript.async = true;
        fidiaScript.setAttribute('src', "https://embed.getfidia.com/js/payment-embed.js");
        document.getElementsByTagName("head")[0].appendChild(fidiaScript);
        const d = document;


        el.onclick = () => {
            if (!d.getElementById("fidia-embed-iframe")) {
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
            }



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




