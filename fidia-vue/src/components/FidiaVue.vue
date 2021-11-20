<template>
  <button
    @click="support"
    class="fidia-widget-button"
    :style="{ backgroundColor: color, width: size + 'px' }"
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
    color: {
      type: String,
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
      //pass data to API to exec to the payment
      const { username, slug } = this;
      const fidiaEmbedData = { username, slug };
      console.log(fidiaEmbedData);
    },
  },
  mounted() {
    const d = document;
    // // const w = window;
    const f = d.createElement("iframe");
    f.src = "https://embed.getfidia.com/";
    // // f.src = "../index.html";
    f.frameborder = 0;
    f.allowtransparency = true;
    f.style =
      "display:none; position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
    f.name = "Fidia Widget";
    f.id = "fidia-embed-iframe";
    d.getElementsByTagName("body")[0].appendChild(f);
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