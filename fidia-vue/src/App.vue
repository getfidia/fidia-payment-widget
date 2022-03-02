<template>
  <div>
    <button v-fidia="{ name: 'opeolluwa', slug: 'open-source' }">
      Support Me 💜
    </button>



    <button
  class="fidia-embed-target"
  data-fidia-username="opeolluwa"
  data-fidia-slug="open-source"
></button>
  </div>
</template>


<script>
import "./fidia-vue";

export default {
  data() {
    return {
      //TODO: bind the directive to dynamic data
      user: { name: "Opeoluwa", slug: "buy me pizza" },
    };
  },
  mounted(){
    const fidiaScript = document.createElement('script');
    fidiaScript.async = true;
    fidiaScript.setAttribute('src', "https://embed.getfidia.com/js/payment-embed.js");
    document.getElementsByTagName("head")[0].appendChild(fidiaScript);
}
};
</script>

<style>
</style>