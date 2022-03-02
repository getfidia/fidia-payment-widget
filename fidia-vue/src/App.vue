<template>
  <div>
    <button v-fidia="{ name: 'opeolluwa', slug: 'open-source' }">
      Support Me 💜
    </button>



  
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

};
</script>

<style>
</style>