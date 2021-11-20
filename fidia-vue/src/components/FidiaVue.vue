<template>
  <button @click="support" class="fidia-widget-button">
    <fidia-logo />
    {{ purpose }}
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
    purpose: {
      type: String,
      required: true,
    },
  },

  methods: {
    support() {
      //pass data to iframe to exec to the payment
      console.log("supported");
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