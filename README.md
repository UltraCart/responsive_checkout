#### Demo
A demo is [here](http://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demos/responsive_checkout/cart.html?ADD=BONE).  It contains instructions to add a dog bone to a dummy account 'DEMO'.  To complete the checkout, use a Visa card 4444333322221111 with any future expiration and any CVV (try 123).

#### Introduction
The UltraCart responsive checkout contains reference implementations (well, so far just one) of javascript based checkouts that are built on the [UltraCart REST API](http://docs.ultracart.com/display/ucdoc/UltraCart+REST+Checkout+API) and designed to be mobile friendly.  There is a [working demo](http://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demos/responsive_checkout/cart.html?ADD=BONE) hosted on the UltraCart servers.  Do not download that version.  It is modified slightly to run on our non-PHP servers.  See the Getting Started section for instructions on setting up your own site.

#### Getting Started
To Use:

1. Download the latest release.
2. See the [README.md](cart_implementations/backbone/README.md)  file within the [cart_implementations/backbone](cart_implementations/backbone) directory.  It has instructions for generating javascript files needed to create a working cart.
3. Install the cart_implementations/backbone directory tree in your php web server.
4. Test rest_proxy.php by typing the full path to it (wherever you put it) in your web browser address bar.  

   |URL|Expected Result|
   |---|---------------|
   |```rest_proxy.php```|"UltraCart rest proxy script called incorrectly.  _url query parameter is required.|
   |```rest_proxy.php?_url=/rest/cart```|"Missing Merchant Id."|
   |```rest_proxy.php?_url=/rest/cart&_mid=DEMO```|you should receive back the json for an empty cart|

5. Edit cart.html.  Scroll to the bottom and look for a script tag containing several variables.

   |Variable Name|Comments|
   |-------------|--------|
   |merchantId|Change this to your own Merchant ID|
   |continueShoppingUrl|Change this to whatever your main product catalog or intro page is|
   
6. See this page: http://docs.ultracart.com/display/ucdoc/UltraCart+REST+Checkout+API and read the section titled "Things you'll wish you read first".  It will help you out with common problems. 
7. The main page is cart.html. The files you'll most likely edit are master.js and the templates in scripts/handlebars.


Some people find these [small examples](https://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demo1.html) helpful.  They give examples of the REST API calls used in the responsive checkout.

#### Applying Hosted Fields to an existing checkout based on this reference example

1. Update jQuery (1.11.3) and JSON (json3) libraries (cart.html)
2. Add a reference to the hosted fields javascript file.
```<script type="text/javascript" src="//secure.ultracart.com/checkout/checkout-hosted-fields-1.0.js"></script>```
2. Add the PCI3.0 block of css and javascript (cart.html) https://gist.github.com/perrytew/623fc471004bc961f7cf
3. Within payment_template.handlebars, change the input type of creditCardVerificationNumber from type="number" to type="text"
4. At the start of the app.views.Payment.render() method, add this line:
``` teardownSecureCreditCardFields(); ```
5. At the end of the app.views.Payment.render method, before the return statement, add this line:
``` setupSecureCreditCardFields(); ```

So the render() function will look like this:
```
  render: function () {

    teardownSecureCreditCardFields();

    // A WHOLE LOT OF CODE WAS CUT OUT RIGHT HERE ...

    var context = {
      'ccTypes': ccTypes,
      'ccMonths': ccMonths,
      'ccYears': ccYears,
      'cart': this.model.attributes,
      'storedCards': storedCards,
      'loggedIn': this.model.get('loggedIn')
    };

    this.$el.html(app.templates.payment(context));

    setupSecureCreditCardFields();
    return this;
  },

```

That's it.  The hosted fields themselves are gory, but installing them into an existing site is trivial.  Open an issue if you encounter any problems.


#### Version 1.3
This release is also a mandatory upgrade.  (Sorry guys)  To achieve PCI 3.0 Compliance, all credit card numbers and cvv
numbers must go through Hosted Fields.  This checkout was updated to do that.  Prior to this, the storeCard method was
used to send sensitive credit card information to the vault (token.ultracart.com).  That solution was acceptable for PCI 2.0,
but the Hosted Fields must be used for 3.0.

Full list of Changes (all deal with the cart_implementation/backbone):
* Hosted Fields support added see http://docs.ultracart.com/display/ucdoc/UltraCart+Hosted+Credit+Card+Fields
* Added localization support for all supported currencies (you'll see references to LocalizedFormatted fields everywhere,
such as subtotal -> subtotalLocalizedFormatted
* Upgrade jQuery and JSON libraries
* Removed accounting.js library.  This is no longer needed with the localized formatted variables being used.
The only gap caused by this removal was filled by the app.commonFunctions.formatMoney function, which is used to format dynamic javascript values.
* Updated handlebars to 3.0.3
* Updated grunt and bower to latest versions
* Added jshint to the Gruntfile to perform additional syntax checking.  numerous fixes recommended by jshint were performed.


#### Version 1.2
This release is considered a mandatory upgrade.  Of this release, the changes in the rest_proxy.php script are most important.
Please upgrade your rest_proxy.php scripts as soon as possible.  Doing so will prevent issues with your site.  Additionally,
we've added a proxy version header that will allow us to track which merchants might have out of date proxy scripts in the
future.  This could prove vital to rapidly addressing any compatibility issues that might arise from future server updates.

rest_proxy.php changes:
* Fixes for content-length being sent down when original response was gziped.  Would cause the client problem if the server running the proxy wasn't gziping it as well
* We have disabled gzip upstream until 4/15/2015 at which point everyone should have their proxy scripts upgraded.
* Added a flag that can be set to enable debugging to the error_log instead of having to uncomment all the statements.
* Change SSL certificate verify flag.
* Set an empty Expect header in the request to prevent curl from sending the Expect: 100-Continue header.
* Simplify the HTTP 100 Continue header trimming and allow for multiple of them
* Close out the curl handle sooner.
* Add a proxy version number to the header so we can tell from the server side if people are running out of date proxies


#### Version 1.1

An UltraCart Javascript checkout designed to render well on all displays, especially mobile devices.

This checkout using the UltraCart REST API.
The documentation for the REST API is found on docs.ultracart.com.
http://docs.ultracart.com/display/ucdoc/UltraCart+REST+Checkout+API

backbone cart implementation:
 * Updated all javascript libraries to their latest versions.
 * Moved all handlebar templates into separate files and pre-compile them.  The makes development an extra step, but solves strange errors we were seeing with the latest browsers doing aggressive javascript optimization and causing strange random errors with the handlebar templates.
 * replaced underscore.js with lodash.js
  
If you aren't using the precompiled handlebar templates, you should upgrade to avoid any issues with the latest round of browsers. See https://github.com/UltraCart/responsive_checkout/blob/master/cart_implementations/backbone/scripts/handlebars/readme_precompiling.txt for tips on setting up the precompiler using nodejs.


Architecture
____________
 * The checkout uses the following technology.
 * jQuery: http://jquery.com/
 * json3.js: https://bestiejs.github.io/json3/
 * moment.js: http://momentjs.com/
 * underscore.js: http://underscorejs.org/
 * backbone.js: http://backbonejs.org/
 * backbone-deepmodel: https://github.com/powmedia/backbone-deep-model
 * backbone-modelbinder: https://github.com/theironcook/Backbone.ModelBinder
 * handlebars: http://handlebarsjs.com/

Everything is fairly standard to a backbone.js/handlebars.js javascript application,
with the exception of the Cart model. We created a mix between the DeepModel and a Nested Model.
Had we used the standard backbone.js, we would have lost fine-grained management of 1) nested objects
such as the Cart.CustomerProfile object and 2) collection properties such as items.  We really wanted row level
event notification for the items.   So, within https://github.com/UltraCart/responsive_checkout/blob/master/scripts/backbone-uc-common-functions-1.3.js
you'll see the models defined to give us detailed control of every part of the Cart object.

With a normal backbone.js model, all properties are access via the model.get('property') method.  With our model, we
follow this convention, but we also map the items as a direct property of the cart.

So, you'll see within the code app.data.cart.get('shipToFirstName') as well as app.data.cart.items where
it lives as a backbone collection of CartItems instead of a normal array of CartItems.  This allows
for event binding, etc. 

Just a head's up.


Release Notes:
______________
11/01/2013 
We're releasing this software as version 1.0.  We've added the login/logout/register functionality, along with fields to display all customer information.
Numerous bugs were fixed with the latest commit.

