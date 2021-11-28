<template>
  <div id="app">
    <fidia-vue username="opeolluwa" slug="buy me a drone"  background="black" size="200" foreground="grey"/>

  </div>
</template>

<script>
import FidiaVue from "./components/FidiaVue.vue";

export default {
  name: "App",
  components: {
    FidiaVue,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
