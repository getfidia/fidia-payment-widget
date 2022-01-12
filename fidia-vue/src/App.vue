<template>
  <button
    class="fidia-embed-target"
    data-fidia-username="opeolluwa"
    data-fidia-slug="Opeolluwa"
  >
    ooo
  </button>
</template>


<script>
export default {
  mounted() {
    const fidiaScript = document.createElement("script");
    fidiaScript.async = true;
    fidiaScript.setAttribute(
      "src",
      "https://embed.getfidia.com/js/payment-embed.js"
    );
    document.getElementsByTagName("head")[0].appendChild(fidiaScript);
  },
};
</script>

<style>
</style>