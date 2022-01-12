<template>
  <div>
    <!-- <button
    class="fidia-embed-target"
    data-fidia-username="opeolluwa"
    data-fidia-slug="Opeolluwa"
  >
    ooo
  </button> -->
    <fidia-vue slug="Opeolluwa" text="buy me a coffee" username="opeolluwa" background="green" />
  </div>
</template>


<script>
import FidiaVue from "./components/FidiaVue.vue";
export default {
  components: { FidiaVue },
  /*  mounted() {
    const fidiaScript = document.createElement("script");
    fidiaScript.async = true;
    fidiaScript.setAttribute(
      "src",
      "https://embed.getfidia.com/js/payment-embed.js"
    );
    document.getElementsByTagName("head")[0].appendChild(fidiaScript);
  }, */

  component: {
    FidiaVue,
  },
};
</script>

<style>
</style>