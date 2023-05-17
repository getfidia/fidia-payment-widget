# Fidia Payment Widget

<!-- <img width="1232" alt="Screenshot 2021-10-09 at 12 30 50 AM" src="https://user-images.githubusercontent.com/29985200/136634468-e4c09e65-8685-4b8c-ac7c-aef26cf1d1f3.png"> -->

The Fidia payment widget embeds a Fidia [payment link](https://getfidia.com/payment-links) and [product and booking](https://getfidia.com/product-pages). on your website. This widget allows you to specify a trigger button which when clicked pops up Fidia's payment link/product/booking and allows you to receive support from your fans/audience without them having to leave your website.

<!-- <img height="80px" src="https://res.cloudinary.com/fidia/image/upload/v1633732179/Payment_Button_1_wdddah.png"/> -->

To give you a feel of how this works, we created a [demo website](https://embed.getfidia.com/example/) that uses our widget. You only have to click the embedded Fidia button to see it in action. Check it out for [products](https://embed.getfidia.com/example/product), [pay links](https://embed.getfidia.com/example/payment), and [bookings](https://embed.getfidia.com/example/booking).

## 🚀 Usage

### HTML
Embedding a Fidia payment link/product or booking on your website is super simple. First, you need to import our embed script. Add the below snippet anywhere within your HTML code.

#### Payment Link
```html
<script src="https://embed.getfidia.com/js/payment-embed.js" async></script>
```

#### Product
```html
<script src="https://embed.getfidia.com/js/product-embed.js" async></script>
```
#### Booking
```html
<script src="https://embed.getfidia.com/js/booking-embed.js" async></script>
```

Specify a button that when clicked would pop up our widget. This button can be placed anywhere within the body tag and has to have the following attributes:
- class - `fidia-embed-target` for payment link, `fidia-product-embed-target` for product, and `fidia-booking-embed` for booking
- data-fidia-username - Your Fidia username
- data-fidia-slug - The slug of the payment link/product/booking you want to embed

##### Payment Link additional attributes
- fidia-button-color - button color (defaults if none is specified)
- fidia-button-background - button background (defaults if none is specified)


This will look as shown below:

```html
<button class="fidia-embed-target" data-fidia-username="gbahdeyboh" data-fidia-slug="laptop"></button>
```

You can add as many buttons as desired and each of them will be replaced by Fidia's custom button.
NB: Button text will be replaced by Fidia's button text ("Support me") if you don't specify a button text.

### Vue
Add the below script to your mounted hook. Replace `embedUrl` with the URL of the embed script you want to use.
```javascript
mounted(){
    const fidiaScript = document.createElement('script');
    fidiaScript.async = true;
    fidiaScript.setAttribute('src', embedUrl);
    document.getElementsByTagName("head")[0].appendChild(fidiaScript);
}
```

Then add your button anywhere in your component or it's child component.

```html
<button class="fidia-embed-target" data-fidia-username="gbahdeyboh" data-fidia-slug="laptop"></button>
```

### Nuxt
In your plugins folder, create a file named `fidia-widget.js`. Copy and paste the below code into this file.

```javascript
export default () => { 
    (function() {
        const fidiaScript = document.createElement('script');
        fidiaScript.async = true;
        fidiaScript.setAttribute('src', embedUrl)
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
<button class="fidia-embed-target" data-fidia-username="gbahdeyboh" data-fidia-slug="laptop"></button>
```

## ✨ Contribution
This widget still needs a lot of customizations, improvements, and fixes. PRs and issues are welcomed!