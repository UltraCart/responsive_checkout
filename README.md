### Introduction
This shopping cart is a vanilla javascript shopping cart using the latest UltraCart API.

### Requirements
For development, you will need:
* Node.js installed on your computer
* Gulp.js installed
* UltraCart SDK - see https://github.com/UltraCart/rest_api_v2_sdk_javascript

### Getting Started
To Use:

1. Download or clone this project.
2. From the base directory, run 'npm install'.
3. Edit index.html and provide your own browser key.  The one provided will not work.  You'll find the key around line 536 of index.html.
```uc.browserKey = "d7f38666b17e60016306f071d41e3700";```
4. Right below the browser key, set your storefront server name.  This is needed to provide proper branding for receipts.
`uc.storeFront = "demo.ultracartstore.com"`
5. From the base directory, run 'gulp'.  The default action will build the .js and .css file.
5. Deploy or test your checkout!
6. An easy way to add an item to your checkout is by adding `?ADD=YourItemId` to the end of the checkout url. 

### Changes

###### Version 2.0
**Complete overhaul.** 
* Switched to latest API (www.ultracart.com/api/)
* Removed all external libraries.  The hosted fields still uses jQuery, but the entire shopping cart is now vanilla javascript.
This makes it much easier to trace action and extend as needed.  If you wish to use a library such as backbone.js, angular, or reactjs,
it should be easy to incorporate.
* Removed the backbone/handlebars implementation.  The learning curve was too high, so we chose not to upgrade that to the new API.

###### Version 1.4
* Removed rest_proxy.php
* Added CORS support
* This version will run on any web server.

###### Version 1.3
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


###### Version 1.2
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


###### Version 1.1

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

