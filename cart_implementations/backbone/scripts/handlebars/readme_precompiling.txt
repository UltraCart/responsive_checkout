# Install node
# run "npm install handlebars@1.3.0 -g"

# I run the following command to pre-compile all handlebar templates into one .js file.  You'll need to adjust the path to the handlebars library appropriately.
# If you add a template, be sure to add it here.
# note that I run this from the handlebars directory.
node C:\Users\perry\AppData\Roaming\npm\node_modules\handlebars\bin\handlebars -f ..\master_template.js billto_address_template.handlebars coupons_template.handlebars credentials_template.handlebars gift_certificate_template.handlebars item_template.handlebars items_template.handlebars payment_template.handlebars paypal_template.handlebars shipping_template.handlebars shipto_address_template.handlebars subtotal_template.handlebars summary_template.handlebars total_template.handlebars
