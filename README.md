responsive_checkout
===================

An UltraCart Javascript checkout designed to render well on all displays, especially mobile devices.

This checkout using the UltraCart REST API.
The documentation for the REST API is found on docs.ultracart.com.
https://github.com/UltraCart/responsive_checkout

Quick Start:
____________
 * Download the source code
 * Install it in your web server
 * Test rest_proxy.php.  
   Test #1: If you call it directly from the web browser, you should receive back this response: "UltraCart rest proxy script called incorrectly.  _url query parameter is required.
   
   Test #2:  adjust your url to call this:   rest_proxy.php?_url=/rest/cart, you should receive back this response: "Missing Merchant Id."
   
   Test #3:  call this: rest_proxy.php?_url=/rest/cart&_mid=DEMO, you should receive back the json for an empty cart.

 * Edit cart.html
   Scroll to the bottom and look for a <script> tag.  Change the following:
   
   merchantId: change this to your Merchant ID.
   
   continueShoppingUrl: change this to whatever your main product catalog or intro page is.
   
   accounting.settings: If you are not using USD currency, adjust this appropriately.
