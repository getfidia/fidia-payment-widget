# Fidia Payment Widget

<img width="1232" alt="Screenshot 2021-10-09 at 12 30 50 AM" src="https://user-images.githubusercontent.com/29985200/136634468-e4c09e65-8685-4b8c-ac7c-aef26cf1d1f3.png">

Fidia payment widget embeds a Fidia [payment link](https://getfidia.com/payment-links) on your website. This widget allows you specify a trigger button which when clicked pops up Fidia's payment link and allows you receive support from your fans/audience without them having to leave your website.

<img height="80px" src="https://res.cloudinary.com/fidia/image/upload/v1633732179/Payment_Button_1_wdddah.png"/>

To give you a feel of how this works, we created a [demo website](https://embed.getfidia.com/example/) that uses our widget. You only have to click the embedded Fidia button to see it in action. Check it out [here](https://embed.getfidia.com/example/).

## 🚀 Usage

### HTML

Embedding a Fidia payment link on your website is super simple. First, you need to import our embed script. Add the below snippet to anywhere within your html code.

```html
<script src="https://embed.getfidia.com/js/payment-embed.js" async></script>
```

Specify a button which when clicked would popup our payment link widget. This button can be placed anywhere within the body tag and has to have the following attributes:

- **class** - fidia-embed-target
- **data-fidia-username** - Your Fidia username
- **data-fidia-slug** - The slug of the payment link you want to embed, typically the text you filled in the input tagged "madkus-design" while creating your link
  <img src=images/slug.png width=300 height=200 style="margin:15px 15px 15px 0px;display:block">

This will look as shown below:

```html
<button
  class="fidia-embed-target"
  data-fidia-username="gbahdeyboh"
  data-fidia-slug="laptop"
></button>
```

You can add as many buttons as desired and each of them will be replaced by Fidia's custom button.

### Vue

Add the below script to your mounted hook.

```javascript
mounted(){
    const fidiaScript = document.createElement('script');
    fidiaScript.async = true;
    fidiaScript.setAttribute('src', "https://embed.getfidia.com/js/payment-embed.js");
    document.getElementsByTagName("head")[0].appendChild(fidiaScript);
}
```

Then add your button anywhere in your component or it's child component.

```html
<button
  class="fidia-embed-target"
  data-fidia-username="gbahdeyboh"
  data-fidia-slug="laptop"
></button>
```

### Nuxt

In your plugins folder, create a file named `fidia-widget.js`. Copy and paste the below code into this file.

```javascript
export default () => {
  (function () {
    const fidiaScript = document.createElement("script");
    fidiaScript.async = true;
    fidiaScript.setAttribute("src", "https://embed.getfidia.com/js/payment-embed.js");
    document.getElementsByTagName("head")[0].appendChild(fidiaScript);
  })();
};
```

In your `nuxt.config.js` file, import this plugin as shown below.

```javascript
plugins: [
    { src: '~/plugins/fidia-widget', mode: 'client' },
],
```

Now you can specify a target button anywhere within your layouts, pages, or components.

```html
<button
  class="fidia-embed-target"
  data-fidia-username="gbahdeyboh"
  data-fidia-slug="laptop"
></button>
```

## ✨ Contribution

This widget still needs a lot of customizations, improvements, and fixes. PRs and issues are definitely welcomed!
