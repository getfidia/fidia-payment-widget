# Fidia Payment Widget

<img width="1232" alt="Screenshot 2021-10-09 at 12 30 50 AM" src="https://user-images.githubusercontent.com/29985200/136634468-e4c09e65-8685-4b8c-ac7c-aef26cf1d1f3.png">

Fidia payment widget embeds a Fidia [payment link](https://getfidia.com/payment-links) on your website. This widget allows you specify a trigger button which when clicked pops up Fidia's payment link and allows you receive support from your fans/audience without them having to leave your website.

<br>

<br>

## Installation

```shell
npm install fidia-vue --save
```

## Basic Use

```html
<template>
  <fidia-vue username="Jane Doe" text="Support Me" slug="Buy me a coffee" />
</template>
```

```js
import FidiaVue from 'fidia-vue'
<script>
export default{
    components:{
        FidiaVue
    }
}
</script>
```

## Props
<br>

**PROPS** | **DESCRIPTION** |  **DEFAULT VALUE** | **DATA TYPE** | **REQUIRED**
------ | ------- | -------| -------- | -------
username |  your fidia username| null  | String | true
text | text content of the widget button | Support Me | String | false
slug | purpose for support | null | String | false 
size | component size in px | 210 | Number | false
background | your brand color | #292A73 | String | false
foreground | button text color | #ffffff | String | false
<br> 

## Task List  🐱
- [X] init Fidia-Vue
- [ ] pull request
- [ ] deploy to [npm](https://www.npmjs.com) 