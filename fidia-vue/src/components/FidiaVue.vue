<template>
  <button
    @click="support"
    class="fidia-widget-button"
    :style="{
      backgroundColor: background,
      width: size + 'px',
      color: foreground,
    }"
  >
    <fidia-logo />
    {{ slug }}
  </button>
</template>

<script>
import FidiaLogo from "./FidiaLogo.vue";
export default {
  components: { FidiaLogo },

  props: {
    text: {
      type: String,
      default: "Support Me",
    },
    username: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    fixed: {
      type: Boolean,
      required: false,
    },
    background: {
      type: String,
    },
    foreground: {
      type: String,
      default: "#fff",
    },
    size: {
      type: Number,
    },
    position: {
      type: String,
      default: "bottom-right",
    },
  },

  methods: {
    support() {
      //extract data from props
      const { username, slug } = this;
      const fidiaEmbedData = JSON.stringify({ username, slug });

      const d = document;
      // const w = window;
      const f = d.createElement("iframe");
      f.src = "https://embed.getfidia.com/";
      // f.src = "http://localhost:8082/";

      f.frameborder = 0;
      f.allowtransparency = true;
      f.style =
        "display:none; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
      f.name = "Fidia Widget";
      f.id = "fidia-embed-iframe";
      d.getElementsByTagName("body")[0].appendChild(f);

      const fidiaIframe = document.querySelector("#fidia-embed-iframe");
      setTimeout(() => {
        fidiaIframe.style.display = "block";
      }, 30);

      // Child window and parent window can only communicate over events
      fidiaIframe.contentWindow.postMessage(fidiaEmbedData, "*");

      /*     w.onmessage = (e) => {
        if ((e.data = "closeFidiaIframe")) {
          // Close the iframe when this event is emitted to the parent document,
          const fidiaIframe = document.querySelector("#fidia-embed-iframe");
          fidiaIframe.style.display = "none";
        }
      }; */
    },
  },
};
</script>

<style scoped>
@import url(./../assets/css/button.css);
@import url(./../assets/css/style.css);
button {
  text-transform: capitalize;
}
</style>