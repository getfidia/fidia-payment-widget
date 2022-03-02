# Fidia Payment Widget

## Installation

```shell
#todo
npm install fidia-vue --save
```

## Basic Use

Import the plugin into your application entry, typically main.js

```js
import Vue from "vue";
import App from "./App.vue";
// import "fidia-vue"; //if installed from npm
import "./fidia-vue"; // development version
```

Then in your component, add v-fidia binding on any element

```html
<button v-fidia="{ name: 'opeolluwa', slug: 'open-source' }">
  Support Me 💜
</button>
```

## Run in development mode

```
git clone https://github.com/opeolluwa/fidia-payment-widget fidia
cd fidia/fidia-vue
npm i
npm run serve
```
