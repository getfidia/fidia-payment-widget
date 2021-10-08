# Fidia Payment Widget

Fidia payment widget is a widget that embeds a Fidia [payment link](https://getfidia-frontend-test.herokuapp.com/payment-links) on your website. These widgets allows you specify a trigger button which when clicked pops up Fidia's payment link and allows you receive support from your fans/audience without them having to leave your website.

<img height="80px" src="https://res.cloudinary.com/fidia/image/upload/v1633732179/Payment_Button_1_wdddah.png"/>

So you can get a feel of how this works, we created a [demo website](https://embed.getfidia.com/example/) that uses our widget. You only have to click the embedded Fidia button to see it in action. Check it our [here](https://embed.getfidia.com/example/).

### Usage (HTML)
Embedding a Fidia payment link on your website is super simple. First, you need to import our embed script. Add the below code anywhere within your code.

```html
<script src="https://embed.getfidia.com/js/v1.js" async></script>
```

Specify a button which when clicked would popup our payment link widget. This button can be placed anywhere within the body tag and has to have the following attributes:
- class - fidia-embed-target
- data-fidia-username - Your Fidia username
- data-fidia-slug - The slug of the payment link you want to embed

This will look as shown below:

```html
<button class="fidia-embed-target" data-fidia-username="gbahdeyboh" data-fidia-slug="laptop"></button>
```

You can add as many buttons as desired and each of them will be replaced by Fidi's custome button.
