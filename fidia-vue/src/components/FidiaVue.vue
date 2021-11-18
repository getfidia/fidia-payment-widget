<template>
  <button @click="support">
    <fidia-logo />{{supportText}}
  </button>
</template>

<script>
import FidiaLogo from "./FidiaLogo.vue";
export default {
  components: { FidiaLogo },
  props: {
    supportText: {
      type: String,
      default: "Support Me",
    },
    username: {
      type: String,
      required: true,
    },
    supportPurpose: {
      type: String,
      required: true,
    },
  },

  methods: {
    support() {
      //pass data to iframe for exec
      console.log("supported");
    },
  },
};
</script>

<style scoped>
@import url(./../assets/css/button.css);
@import url(./../assets/css/style.css);
</style>