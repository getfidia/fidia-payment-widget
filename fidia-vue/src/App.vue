<template>
  <div id="app">
    <fidia-vue username="Drizzle" purpose="buy me a camera" />
    <fidia-vue username="Drizzle" purpose="buy me a phone" color="green" />
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
