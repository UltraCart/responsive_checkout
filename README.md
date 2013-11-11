Most people find this demo helpful:

https://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demo1.html

It gives examples of the REST API calls used in the responsive checkout.


responsive_checkout (version 1.0)
======================================

An UltraCart Javascript checkout designed to render well on all displays, especially mobile devices.

This checkout using the UltraCart REST API.
The documentation for the REST API is found on docs.ultracart.com.
http://docs.ultracart.com/display/ucdoc/UltraCart+REST+Checkout+API

Quick Start:
____________ 
 * Download the source code
 * The item.html is an item page.  It was designed to be stand-alone (except for a few graphics).  It's a very simple implementation since the item pages vary so.
 * There are going to be many reference implementations of shopping carts.  Currently, there is only one: cart_implementations/backbone.  It is built using backbone.js and handlebars.js.  To use it, you'll want to copy it forward a few directories (your choice).
 * Install it in your web server.  There are several versions of rest_proxy.php to allow the different pages to run standalone.  You'll probably want to just use one, which may require you to search a modify a few references to it.
 * Test rest_proxy.php.  
   Test #1: If you call it directly from the web browser, you should receive back this response: "UltraCart rest proxy script called incorrectly.  _url query parameter is required.
   
   Test #2:  adjust your url to call this:   
```
   rest_proxy.php?_url=/rest/cart, you should receive back this response: "Missing Merchant Id."
```
   
   Test #3:  call this: 
```   
   rest_proxy.php?_url=/rest/cart&_mid=DEMO, 
```
   you should receive back the json for an empty cart.

 * Edit cart.html
   Scroll to the bottom and look for a script tag.  Change the following:
   
   merchantId: change this to your Merchant ID.
   
   continueShoppingUrl: change this to whatever your main product catalog or intro page is.
   
   accounting.settings: If you are not using USD currency, adjust this appropriately.

Architecture
____________
 * The checkout uses the following technology.
 * jQuery: http://jquery.com/
 * json2.js: https://github.com/douglascrockford/JSON-js
 * accounting.js: http://josscrowcroft.github.com/accounting.js/
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

