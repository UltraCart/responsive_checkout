Most people find this demo helpful:

https://secure.ultracart.com/merchant/integrationcenter/checkoutapi_v3/demo1.html

It gives examples of the REST API calls used in the responsive checkout.


responsive_checkout (version 1.2)
======================================
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


responsive_checkout (version 1.1)
======================================

An UltraCart Javascript checkout designed to render well on all displays, especially mobile devices.

This checkout using the UltraCart REST API.
The documentation for the REST API is found on docs.ultracart.com.
http://docs.ultracart.com/display/ucdoc/UltraCart+REST+Checkout+API


Change Log:
__________

Version 1.1 (8/1/2014)
backbone cart implementation:

 * Updated all javascript libraries to their latest versions.
 * Moved all handlebar templates into separate files and pre-compile them.  The makes development an extra step, but solves strange errors we were seeing with the latest browsers doing aggressive javascript optimization and causing strange random errors with the handlebar templates.
 * replaced underscore.js with lodash.js
  
If you aren't using the precompiled handlebar templates, you should upgrade to avoid any issues with the latest round of browsers. See https://github.com/UltraCart/responsive_checkout/blob/master/cart_implementations/backbone/scripts/handlebars/readme_precompiling.txt for tips on setting up the precompiler using nodejs.




Quick Start:
____________ 
 * Download the source code
 * The item.html is an item page.  It was designed to be stand-alone (except for a few graphics).  It's a very simple implementation since the item pages vary so.
 * There are going to be many reference implementations of shopping carts.  Currently, there is only one: cart_implementations/backbone.  It is built using backbone.js and handlebars.js.  To use it, you'll want to copy it forward a few directories (your choice). Also see the [README.md](cart_implementations/backbone/README.md) file in that directory for instructions on compiling handlebars.
 * Install it in your web server.  There are several versions of rest_proxy.php to allow the different pages to run standalone.  You'll probably want to just use one, which may require you to search a modify a few references to it.
 * Test rest_proxy.php.   
   Test #1: If you call it directly from the web browser, you should receive back this response: "UltraCart rest proxy script called incorrectly.  _url query parameter is required.
   Test #2:  adjust your url to call this:   
```
   rest_proxy.php?_url=/rest/cart
```
   you should receive back this response: "Missing Merchant Id."
   Test #3:  call this: 
```   
   rest_proxy.php?_url=/rest/cart&_mid=DEMO 
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

