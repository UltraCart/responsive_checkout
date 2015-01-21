// This line forces backbone to emulate DELETEs, which aren't working with android devices (shame on them).
// Thankfully, our web server can also handle the emulation.
// h/t to Ben at Steinway for finding this fix.   https://github.com/UltraCart/responsive_checkout/issues/28
Backbone.emulateHTTP = true;


// ---------------------------------------------------------------------
// -- app ---
// ---------------------------------------------------------------------
// keep in mind that this is javascript.  why do I have these particular methods in my app?
// because I want them there.  I name them whatever I want.  There is no 'class' blueprint in javascript, so this
// object is defined AND created right here.
var app = {
  models: {},  // The M in MVC
  collections: {},  // Also the M in MVC, just collections of them.
  views: {},  // The V in MVC
  templates: [],
  zombieHunters: {}, // extensions that clean up event binding to avoid zombie event handlers
  commonFunctions: {}, // functions that are used in numerous places
  // the router is kind-of the C in MVC, but not in the traditional sense.  It's more of a helper controller,
  // which takes a look at the url (and fragments), and does additional things based on what it is.
  // the router is created during document.ready
  router: null,
  data: {} // this will hold *instances* of collections and models.  This is actual data, not definitions
};


// ---------------------------------------------------------------------
// -- templates ---
// Steps for creating a new template:
// 1. create the template in the scripts/handlebars directory
// 2. add it to the pre-compilation routine (see scripts/handlebars/readme_precompilation.txt)
// 3. reference it below like the other templates.
// ---------------------------------------------------------------------
app.templates.items = Ultracart.templates['items_template'];
app.templates.item = Ultracart.templates['item_template'];
app.templates.subtotal = Ultracart.templates['subtotal_template'];
app.templates.shipping = Ultracart.templates['shipping_template'];
app.templates.summary = Ultracart.templates['summary_template'];
app.templates.shipto = Ultracart.templates['shipto_address_template'];
app.templates.billto = Ultracart.templates['billto_address_template'];
app.templates.payment = Ultracart.templates['payment_template'];
app.templates.paypal = Ultracart.templates['paypal_template'];
app.templates.total = Ultracart.templates['total_template'];
app.templates.coupons = Ultracart.templates['coupons_template'];
app.templates.giftCertificate = Ultracart.templates['gift_certificate_template'];
app.templates.credentials = Ultracart.templates['credentials_template'];


// ---------------------------------------------------------------------
// --- zombie hunters
// ---------------------------------------------------------------------
//app.zombieHunters.cartView = createAppView('contentPane');
//app.zombieHunters.subtotalView = createAppView('subtotalPane');
//app.zombieHunters.shippingView = createAppView('shippingPane');
//app.zombieHunters.buysafeView = createAppView('buysafePane');
//app.zombieHunters.shiptoView = createAppView('shiptoPane');
//app.zombieHunters.billtoView = createAppView('billtoPane');
//app.zombieHunters.paymentView = createAppView('paymentPane');
//app.zombieHunters.totalView = createAppView('totalPane');

// Note:  We're not using zombie hunters for this checkout.  None of the views get destroyed. Some hidden, but none destroyed.


// ---------------------------------------------------------------------
// --- common functions
// ---------------------------------------------------------------------
app.commonFunctions.enablePleaseWaitMessage = function () {
  jQuery(document).ready(function () {
    jQuery('body').append("<div class='PW_outer'><div class='PW_inner'>Communicating with Server...<br /><" + "img src='/js/jquery.smallhbar.indicator.gif' alt='please wait'/></div></div>");
    jQuery('.PW_inner').hide();
    jQuery(document).ajaxStart(
            function () {
              jQuery('.PW_inner').show();
            }).ajaxStop(function () {
              jQuery('.PW_inner').hide();
            });
  });
};


app.commonFunctions.displayCheckoutErrors = function (errors) {
  var html = '<ul>';

  if (typeof errors == 'string') {
    html += '<li>' + errors + '</li>';
  } else {
    _.each(errors, function (error) {
      html += '<li>' + error + '</li>';
    });
  }

  html += '</ul>';

  jQuery('#checkoutError').removeClass('hidden').find('.errorContent').html(html).removeClass('hidden');
  jQuery('#loginError').removeClass('hidden').find('.errorContent').html(html).removeClass('hidden');
//  var div = document.getElementById('checkoutError');
//  if (div) {
//    div.scrollIntoView();
//  }

};

app.commonFunctions.clearCheckoutErrors = function () {
  jQuery('#checkoutError').addClass('hidden').find('.errorContent').html('').addClass('hidden');
  jQuery('#loginError').addClass('hidden').find('.errorContent').html('').addClass('hidden');

};


app.commonFunctions.blockUserInput = function () {
  // quick check for a background.
  if (document.getElementById('MB_overlay') == null) {
    var bgDiv = document.createElement('div');
    bgDiv.id = 'MB_overlay';
    document.body.appendChild(bgDiv);
  }

  var bg = jQuery("#MB_overlay");
  bg.css({"opacity": "0.5"});
  bg.show(); //.fadeIn("0");
};

app.commonFunctions.endBlockUserInput = function () {
  jQuery("#MB_overlay").hide();
};


app.commonFunctions.storeCard = function () {

  // Extract the card number from the field
  var cardNumber = app.data.cart.get('creditCardNumber') || '';
  var merchantId = app.data.cart.get('merchantId');
  var cartId = app.data.cart.get('cartId');

  // If they haven't specified 15 digits yet then don't store it.
  if (cardNumber.replace(/[^0-9]/g, "").length < 15) {
    return;
  }

  if (!merchantId || !cartId) {
    return;
  }


  // Perform the JSONP request to store it (asynchronous by nature)
  jQuery.getJSON('https://token.ultracart.com/cgi-bin/UCCheckoutAPICardStore?callback=?',
          {
            merchantId: merchantId,
            shoppingCartId: cartId,
            cardNumber: cardNumber
          }
  ).done(function (data) {
            if (data.success) {
              app.data.cart.set({'creditCardNumber': data.maskedCardNumber});
            }
          });
};


app.commonFunctions.checkout = function (paymentMethod) {

  if (!app.data.bootstrap.get('processingOrder')) {
    app.data.bootstrap.set({'processingOrder': true});
    app.commonFunctions.blockUserInput();

    app.data.cart.set({'paymentMethod': paymentMethod});

    app.commonFunctions.clearCheckoutErrors();

    var button = jQuery('#btnFinalize');
    var buttonHtml = button.html();
    button.html("<" + "img src='images/loader.gif' alt='please wait' />");

    // Notice: The checkout call does not take a cart.  It takes a CheckoutRequest which contains a cart.
    // Since the checkout process hands of to UltraCart to handle upsells, etc., we must also provide the
    // return point.
    var checkoutRequest = {
      'cart': app.data.cart.attributes,
      errorParameterName: 'error', // if there are errors after the handoff, the redirect page will receive those errors using this http parameter
      errorReturnUrl: document.URL, // this same page.
      secureHostName: (window.serverName || null) // can be null.  defaults to secure.ultracart.com if null.  could also be www.mystore.com if that was your url.
      // the secureHostName is where the checkout finishes on (receipt).  many merchants have dozens of sites.  So, if this isn't secure.ultracart and
      // you have more than one, you must specify it.
    };

    jQuery.ajax({
      url: restUrl + '/checkout', // restUrl is defined in the html page.
      type: 'POST', // Notice
      headers: { "cache-control": "no-cache" },
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(checkoutRequest),
      dataType: 'json'
    }).done(function (checkoutResponse) {
              if (checkoutResponse && checkoutResponse.redirectToUrl) {
                location.href = checkoutResponse.redirectToUrl;
              } else {
                if (checkoutResponse.errors && checkoutResponse.errors.length) {
                  app.commonFunctions.displayCheckoutErrors(checkoutResponse.errors);
                }
              }
            }).always(function () {
              button.html(buttonHtml);
              app.data.bootstrap.set({'processingOrder': false});
              app.commonFunctions.endBlockUserInput();
            });
  }

};

app.commonFunctions.showHideBilling = function (show, update) {
  // if show is not defined, then determine if the billing should be shown by comparing the carts.
  // after determining, update the check box as well.  this needs to be done on page load to sync
  // the check box with any existing cart.

  var attr = null;

  if (typeof show === 'undefined') {

    var theyAreTheSame = true;  // if there is no cart, the fields should be hidden by default.
    if (app.data.cart) {
      attr = app.data.cart.attributes; // quicker to hit attributes than multiple cart.get() calls.
      theyAreTheSame =
              (attr.shipToFirstName == attr.billToFirstName) &&
                      (attr.shipToFirstName == attr.billToFirstName) &&
                      (attr.shipToLastName == attr.billToLastName) &&
                      (attr.shipToFirstName == attr.billToFirstName) &&
                      (attr.shipToCompany == attr.billToCompany) &&
                      (attr.shipToAddress1 == attr.billToAddress1) &&
                      (attr.shipToAddress2 == attr.billToAddress2) &&
                      (attr.shipToCity == attr.billToCity) &&
                      (attr.shipToState == attr.billToState) &&
                      (attr.shipToCountry == attr.billToCountry);
    }

    app.commonFunctions.showHideBilling(!theyAreTheSame, false);

  } else {
    var billingInfo = jQuery('#billToAddress');
    if (show) {
      billingInfo.removeClass('hidden');
    } else {
      billingInfo.addClass('hidden');
    }

    if (update) {
      attr = app.data.cart.attributes;
      app.data.cart.set({
        'billToLastName': attr.shipToLastName,
        'billToFirstName': attr.shipToFirstName,
        'billToCompany': attr.shipToCompany,
        'billToAddress1': attr.shipToAddress1,
        'billToAddress2': attr.shipToAddress2,
        'billToCity': attr.shipToCity,
        'billToState': attr.shipToState,
        'billToCountry': attr.shipToCountry
      }, {silent: true});
      app.data.cart.trigger('addressCopy');
    }
  }
};


app.commonFunctions.displayServerErrors = function () {
  var errors = [];
  var searchString = window.location.search.substring(1), params = searchString.split("&");
  for (var i = 0; i < params.length; i++) {
    var val = params[i].split("=");
    if (val[0] == 'error') {
      // change out any plus signs to spaces, then decode.
      errors.push(decodeURIComponent(val[1].replace(/\+/g, ' ')));
    }
  }
  if (errors.length) {
    app.commonFunctions.displayCheckoutErrors(errors);
  }
};


app.commonFunctions.isYesValue = function (val) {
  if (!val) {
    val = false; // take care of nulls and undefined.
  }
  if (typeof val == 'string') {
    val = val.toLowerCase();
    return "yes" == val || "true" == val || "on" == val || "Y" == val || "1" == val;
  }
  return val;
};


app.commonFunctions.parseHttpParameters = function () {
  var result = {};
  var searchString = window.location.search.substring(1), params = searchString.split("&");
  for (var i = 0; i < params.length; i++) {
    var kv = params[i].split("=");
    var name = kv[0].toLowerCase(), value = decodeURIComponent(kv[1]);

    if (!result.hasOwnProperty(name)) {
      result[name] = [];
    }
    result[name].push(value);

  }
  return result;
};


/* this method should only be called after the cart has loaded. */
/* see: http://docs.ultracart.com/display/ucdoc/Parameters+that+can+be+passed+to+UCEditor */
app.commonFunctions.pretendToBeUCEditor = function () {

  // note: all params are key=string, value=array, but most always we only need the first value.
  // so you'll see [0] tacked onto every value reference, such as params[propertyName][0]. just fyi.

  var params = app.commonFunctions.parseHttpParameters();
  var simpleProperties = {
    advertisingsource: 'advertisingSource',
    billingfirstname: 'billToFirstName',
    billinglastname: 'billToLastName',
    billingcompany: 'billToCompany',
    billingaddress1: 'billToAddress1',
    billingaddress2: 'billToAddress2',
    billingcity: 'billToCity',
    billingstate: 'billToState',
    billingpostalcode: 'billToPostalCode',
    billingcountry: 'billToCountry',
    billingdayphone: 'billToDayPhone',
    billingeveningphone: 'billToEveningPhone',
    ccemail: 'ccEmail',
    shippingfirstname: 'shipToFirstName',
    shippinglastname: 'shipToLastName',
    shippingcompany: 'shipToCompany',
    shippingaddress1: 'shipToAddress1',
    shippingaddress2: 'shipToAddress2',
    shippingcity: 'shipToCity',
    shippingstate: 'shipToState',
    shippingpostalcode: 'shipToPostalCode',
    shippingcountry: 'shipToCountry',
    shippingdayphone: 'shipToPhone',
    customfield1: 'customField1',
    customfield2: 'customField2',
    customfield3: 'customField3',
    customfield4: 'customField4',
    customfield5: 'customField5',
    customfield6: 'customField6',
    customfield7: 'customField7',
    creditcardtype: 'creditCardType',
    creditcardnumber: 'creditCardNumber',
    creditcardexpmonth: 'creditCardExpirationMonth',
    creditcardexpyear: 'creditCardExpirationYear',
    creditcardcvv2: 'creditCardToken',
    shippingmethod: 'shippingMethod',
    themecode: 'screenBrandingThemeCode'
  };

  var attr = {};
  for (var propertyName in simpleProperties) {
    if (simpleProperties.hasOwnProperty(propertyName)) {
      if (params.hasOwnProperty(propertyName)) {
        attr[simpleProperties[propertyName]] = params[propertyName][0];
      }
    }
  }


  var copyS_to_B = false;
  var copyB_to_S = false;

  if (params.hasOwnProperty('billingsameasshipping') && app.commonFunctions.isYesValue(params['billingsameasshipping'])) {
    copyS_to_B = true;
  }

  if (params.hasOwnProperty('defaultbillingsameasshipping') && app.commonFunctions.isYesValue(params['billingdifferent'])) {
    copyS_to_B = true;
  }

  if (params.hasOwnProperty('defaultshippingsameasbilling') && app.commonFunctions.isYesValue(params['shippingdifferent'])) {
    copyB_to_S = true;
  }

  if (copyS_to_B) {
    attr.billToLastName = attr.shipToLastName;
    attr.billToFirstName = attr.shipToFirstName;
    attr.billToCompany = attr.shipToCompany;
    attr.billToAddress1 = attr.shipToAddress1;
    attr.billToAddress2 = attr.shipToAddress2;
    attr.billToCity = attr.shipToCity;
    attr.billToState = attr.shipToState;
    attr.billToCountry = attr.shipToCountry;
  }
  if (copyB_to_S) {
    attr.shipToLastName = attr.billToLastName;
    attr.shipToFirstName = attr.billToFirstName;
    attr.shipToCompany = attr.billToCompany;
    attr.shipToAddress1 = attr.billToAddress1;
    attr.shipToAddress2 = attr.billToAddress2;
    attr.shipToCity = attr.billToCity;
    attr.shipToState = attr.billToState;
    attr.shipToCountry = attr.billToCountry;
  }


  // need to populate both email and confirm, so can't treat email as simple property.
  if (params.hasOwnProperty("email")) {
    attr['email'] = params['email'][0];
    attr['emailConfirm'] = params['email'][0];
  }

  if (params.hasOwnProperty("shippingresidentialaddress")) {
    attr['shipToResidential'] = app.commonFunctions.isYesValue(params['shippingresidentialaddress'][0]);
  }


  var itemsChanged = false;
  var items = app.data.cart.attributes.items || [];
  if (params.hasOwnProperty("clearcart")) {
    itemsChanged = true;
    items = [];
  }

  if (params.hasOwnProperty(('add'))) {
    itemsChanged = true;
    var qty = 1;
    if (params.quantity) {
      qty = parseInt(params['quantity'][0]);
    }
    if (isNaN(qty)) {
      qty = 1;
    }
    var item = {itemId: params['add'][0], quantity: qty};
    // check for options
    for (var i = 1; i <= 10; i++) {
      if (params.hasOwnProperty('optionname' + i) && params.hasOwnProperty('optionvalue' + i)) {
        // we have items, make sure options property is initialized.
        if (!item.hasOwnProperty('options')) {
          item['options'] = [];
        }
        item.options.push({name: params['optionname' + i][0], selectedValue: params['optionvalue' + i][0]});
      }
    }

    items.push(item);
  }

  // check for multiple items.  Look for "add_" parameters.
  for (var parameterName in params) {
    if (params.hasOwnProperty(parameterName) && parameterName.indexOf('add_') == 0) {
      var quantity = parseInt(params[parameterName][0]);
      var itemId = parameterName.substring('add_'.length);
      itemsChanged = true;
      items.push({itemId: itemId, quantity: quantity});
    }
  }

  if (itemsChanged) {
    attr['items'] = items;
  }

  var couponsChanged = false;
  var coupons = app.data.cart.attributes.coupons || [];
  if (params.hasOwnProperty('coupon')) {
    var couponCodes = params['coupon'];
    _.each(couponCodes, function (code) {
      if (!_.contains(_.pluck(coupons, 'couponCode'), code)) {
        coupons.push({'couponCode': code});
        couponsChanged = true;
      }
    });
  }

  if (couponsChanged) {
    attr['coupons'] = coupons;
  }


  if (_.keys(attr).length) {
    app.data.cart.save(attr, {wait: true});
  }


  if (params.hasOwnProperty('overridecatalogurl')) {
    window.continueShoppingUrl = params['overridecatalogurl'];
  }
  if (params.hasOwnProperty('overridecontinueshoppingurl')) {
    window.continueShoppingUrl = params['overridecontinueshoppingurl'];
  }

};


app.commonFunctions.estimateShipping = function () {

  if (!app.data.bootstrap.get('fetchingShipping')) {
    app.data.bootstrap.set({'fetchingShipping': true});

    jQuery.ajax({
      url: restUrl + '/estimateShipping', // restUrl is defined in the html page.
      type: 'POST',
      async: true,
      'contentType': 'application/json; charset=UTF-8',
      data: JSON.stringify(app.data.cart.toJSON()),
      dataType: 'json'
    }).done(
            function (shippingEstimates) {
              if (shippingEstimates) {
                if (shippingEstimates.length) {

                  // if any shipping methods were received, then synchronize with the cart.
                  // Rules:
                  // 1. if the cart.shippingMethod matches one of the estimates, update the shippingHandling to keep costs in sync
                  // 2. if the cart.shippingMethod doesn't match an estimate, wipe it out and select the first estimate. (and apply rule #3)
                  // 3. if the cart.shippingMethod is not set, set it to the first estimate (always the cheapest).
                  var selectedMethod = app.data.cart.get('shippingMethod') || '';
                  if (selectedMethod) {
                    // make sure the costs match.  If there is a change in item count, etc, the costs could change.
                    var selectedEstimate = _.find(shippingEstimates, function (estimate) {
                      return estimate.name == selectedMethod;
                    });
                    if (selectedEstimate) {
                      app.data.cart.set({
                        'shippingHandling': selectedEstimate.cost,
                        'total': app.data.cart.get('total') + selectedEstimate.cost
                      });
                    } else {
                      // the current shipping method wasn't found.  I need to remove the cart.shippingMethod
                      app.data.cart.set({
                        'shippingMethod': null, 'shippingHandling': 0
                      });
                      selectedMethod = null;
                    }
                  }

                  // this is not an if-else connected to the above logic because selectedMethod may change within the if statement,
                  // so this is evaluated separately.
                  if (!selectedMethod) {
                    // also, update the total to increment with the shipping cost.
                    app.data.cart.set({
                      'shippingMethod': shippingEstimates[0].name,
                      'shippingHandling': shippingEstimates[0].cost,
                      'total': app.data.cart.get('total') + shippingEstimates[0].cost
                    });

                  }
                }

                app.data.shippingEstimates.reset(shippingEstimates);
                app.data.shippingEstimates.trigger('change');
              }
            }).always(function () {
              app.data.bootstrap.set({'fetchingShipping': false});
            });

  }
};

app.commonFunctions.threatMetrix = function (thm_params) {
  var html = '';
  html += '<p style="background:url(https://h.online-metrix.net/fp/clear.png?' + thm_params + '&m=1)"></p>';
  html += '<img src="https://h.online-metrix.net/fp/clear.png?' + thm_params + '&m=2" alt="">';
  html += '<script src="https://h.online-metrix.net/fp/check.js?' + thm_params + '"  type="text/javascript"></script>';
  html += '<object type="application/x-shockwave-flash" data="https://h.onlinemetrix.net/fp/fp.swf?<?= $thm_params ?>" width="1" height="1" id="obj_id"><param name="movie" value="https://h.onlinemetrix.net/fp/fp.swf?' + thm_params + '"/><div></div></object>';
  jQuery('body').append(html);
};


app.commonFunctions.useShippingAddress = function (oid) {

  if (!app.data.cart || !app.data.cart.attributes || !app.data.cart.attributes.customerProfile) {
    return; // nothing can be done without a cart and customer profile.
  }

  var shippingAddresses = app.data.cart.attributes.customerProfile.shippingAddresses;
  if (!shippingAddresses) return;

  var address = null;
  for (var i = 0; i < shippingAddresses.length; i++) {
    if (shippingAddresses[i].oid == oid) {
      address = shippingAddresses[i];
      break;
    }
  }

  if (address != null) {
    app.data.cart.set({
      'shipToAddress1': address.address1,
      'shipToAddress2': address.address2,
      'shipToCity': address.city,
      'shipToCompany': address.company,
      'shipToCountry': address.country,
      'shipToFirstName': address.firstName,
      'shipToLastName': address.lastName,
      'shipToPhone': address.dayPhone,
      'shipToPostalCode': address.postalCode,
      'shipToState': address.state
      //    jQuery("#shipToTitle").val(address.title);
    }, {silent: true});


    var shippingIsBillingChecked = jQuery('#shippingIsBilling').is(':checked');
    if (shippingIsBillingChecked) {
      app.data.cart.set({
        'billToAddress1': address.address1,
        'billToAddress2': address.address2,
        'billToCity': address.city,
        'billToCompany': address.company,
        'billToCountry': address.country,
        'billToFirstName': address.firstName,
        'billToLastName': address.lastName,
        'billToPhone': address.dayPhone,
        'billToPostalCode': address.postalCode,
        'billToState': address.state
      }, {silent: true});
    }

    app.data.cart.trigger('sync');


  }


};


app.commonFunctions.useBillingAddress = function (oid) {

  if (!app.data.cart || !app.data.cart.attributes || !app.data.cart.attributes.customerProfile) {
    return; // nothing can be done without a cart and customer profile.
  }

  var billingAddresses = app.data.cart.attributes.customerProfile.billingAddresses;
  if (!billingAddresses) return;

  var address = null;
  for (var i = 0; i < billingAddresses.length; i++) {
    if (billingAddresses[i].oid == oid) {
      address = billingAddresses[i];
      break;
    }
  }

  if (address != null) {
    app.data.cart.set({
      'billToAddress1': address.address1,
      'billToAddress2': address.address2,
      'billToCity': address.city,
      'billToCompany': address.company,
      'billToCountry': address.country,
      'billToFirstName': address.firstName,
      'billToLastName': address.lastName,
      'billToPhone': address.dayPhone,
      'billToPostalCode': address.postalCode,
      'billToState': address.state
    }, {silent: true});
    app.data.cart.trigger('sync');

  }

};


// ---------------------------------------------------------------------
// --- models and collections ---
// ---------------------------------------------------------------------
// Note: models are not 'defined'  They are created here by extending so
// that they have various helper functions, but as for the data dictionary,
// it is defined when the object is created.  So, every time one of these models
// is used, it will receive its data attributes.  The big advantage to having these
// models declared is so backbone will know what urls to use when syncing with the server.
// The urls are usually declared in the collections, and cascade to the individual models
// using a REST structure.
// Example:
//app.models.StoreFront = Backbone.Model.extend({idAttribute: "storeFrontOid"});


// a dummy model to track bootstrap data and handle events.
app.models.Bootstrap = Backbone.Model.extend();
app.models.Item = uc.models.NestedModel.extend({idAttribute: "position"});

app.collections.Items = uc.collections.NestedCollection.extend({
  model: app.models.Item,
  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.comparator = function (model) {
      return [model.get("position")]
    };
  }
});

app.models.Cart = uc.models.DeepAndNestedModel.extend({
  'nested': [
    {'attributeName': 'items', 'collection': (new app.collections.Items())}
  ],
  idAttribute: "cartId",
  url: restUrl // restUrl is defined in the html page.
});

app.models.ShippingEstimate = Backbone.Model.extend({
  'idAttribute': 'name'
});

// this collection has NO url property since it's meant to be updated via a method that requires a cart.
app.collections.ShippingEstimates = Backbone.Collection.extend({
  model: app.models.ShippingEstimate
});

// ---------------------------------------------------------------------
// --- views ---
// ---------------------------------------------------------------------


// ---------------------------------------------------------------------
// --- Credentials ---
// ---------------------------------------------------------------------
app.views.Credentials = Backbone.View.extend({
  el: '#credentials',
  events: {
    "click #btnLoginShow": "showLogin",
    "click #btnRegisterShow": "showRegister",
    "click #btnLoginSubmit": "submitLogin",
    "click #btnRegisterSubmit": "submitRegister",
    "click #btnLogoutSubmit": "submitLogout",
    "click .btnCancel": "cancelCredentials"
  },

  'onClose': function () {
    this.model.off("change:loggedIn sync reset", this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }
    this.model.on("change:loggedIn sync reset", this.render, this);
    _.bindAll(this);

    this.inLogin = false;
    this.inRegister = false;

  },

  render: function () {
    var context = {
      'showLogin': false,
      'showRegister': false,
      'showButtons': true,
      'showLogout': false
    };

    if (this.model.get('loggedIn')) {
      context['showButtons'] = false;
      context['showRegister'] = false;
      context['showLogin'] = false;
      context['showLogout'] = true;
    } else {
      context['showLogin'] = this.inLogin;
      context['showRegister'] = this.inRegister;
      context['showButtons'] = !(this.inLogin || this.inRegister);
    }

    this.$el.html(app.templates.credentials(context));
    return this;
  },

  'showLogin': function () {
    this.inLogin = true;
    this.render();
  },

  'showRegister': function () {
    this.inRegister = true;
    this.render();
  },

  'submitLogout': function () {
    app.commonFunctions.clearCheckoutErrors();

    var restWrapper = new ultracart.Cart(window.merchantId, window.restUrl); // both variables are defined in cart.html
    //noinspection JSUnusedLocalSymbols
    restWrapper.logout(app.data.cart.attributes, {
      success: function (updatedCart) {
        if (updatedCart && updatedCart.errors) {
          app.commonFunctions.displayCheckoutErrors(updatedCart.errors);
        } else {
          app.data.cart.set(updatedCart, {silent: true});
          app.data.cart.trigger('sync');
        }
        this.inLogin = false;
        this.inRegister = false;
        app.commonFunctions.estimateShipping();
      },
      failure: function (jqXHR, textStatus, errorThrown) {
        var message = jqXHR.getResponseHeader('UC-REST-ERROR');
        if (!message) {
          message = textStatus;
        }
        app.commonFunctions.displayCheckoutErrors("Logout failed:" + message);
      }
    });

  },

  'submitLogin': function () {

    app.commonFunctions.clearCheckoutErrors();

    var email = jQuery.trim(jQuery('#loginEmail').val());
    var password = jQuery.trim(jQuery('#loginPassword').val());

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    app.data.cart.set({email: email, password: password}, {silent: true});


    // grab the email and password.  attempt to login
    var restWrapper = new ultracart.Cart(window.merchantId, window.restUrl); // both variables are defined in cart.html
    //noinspection JSUnusedLocalSymbols
    restWrapper.login(app.data.cart.attributes, {
      success: function (updatedCart) {
        if (updatedCart && updatedCart.errors) {
          app.commonFunctions.displayCheckoutErrors(updatedCart.errors);
        } else {
          app.data.cart.set(updatedCart, {silent: true});
          app.data.cart.trigger('sync');
          app.commonFunctions.estimateShipping();
        }
      },
      failure: function (jqXHR, textStatus, errorThrown) {
        var message = jqXHR.getResponseHeader('UC-REST-ERROR');
        if (!message) {
          message = textStatus;
        }
        app.commonFunctions.displayCheckoutErrors("Login failed:" + message);
      }
    });


  },

  'submitRegister': function () {
    app.commonFunctions.clearCheckoutErrors();

    var email = jQuery.trim(jQuery('#registerEmail').val());
    var password = jQuery.trim(jQuery('#registerPassword').val());

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }

    app.data.cart.set({email: email, password: password}, {silent: true});


    // grab the email and password.  attempt to login
    var restWrapper = new ultracart.Cart(window.merchantId, window.restUrl); // both variables are defined in cart.html
    //noinspection JSUnusedLocalSymbols
    restWrapper.register(app.data.cart.attributes, {
      success: function (updatedCart) {
        if (updatedCart && updatedCart.errors) {
          app.commonFunctions.displayCheckoutErrors(updatedCart.errors);
        } else {
          app.data.cart.set(updatedCart, {silent: true});
          app.data.cart.trigger('sync');
          app.commonFunctions.estimateShipping();
        }
      },
      failure: function (jqXHR, textStatus, errorThrown) {
        var message = jqXHR.getResponseHeader('UC-REST-ERROR');
        if (!message) {
          message = textStatus;
        }
        app.commonFunctions.displayCheckoutErrors("Registration failed:" + message);
      }
    });


  },

  'cancelCredentials': function () {
    app.commonFunctions.clearCheckoutErrors();
    this.inLogin = false;
    this.inRegister = false;
    this.render();

  }


});


// ---------------------------------------------------------------------
// --- Billing Address Fields ---
// ---------------------------------------------------------------------
app.views.BillingAddress = Backbone.View.extend({
  el: '#billToAddress',
  events: {
    "focus input[type=text]": 'selectText',
    'change input[type=text],input[type=number],input[type=email],select': 'copyFieldToCart',
    'change #storedBillingAddress': 'useStoredAddress'
  },

  'onClose': function () {
    this.model.off('sync reset addressCopy', this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('sync reset addressCopy', this.render, this);
    _.bindAll(this);
  },

  render: function () {

    var countries = [];
    var cartCountry = this.model.get('billToCountry') || '';
    var masterList = app.data.bootstrap.get('countries');
    if (masterList) {
      _.each(masterList, function (country) {
        countries.push({country: country, selected: country == cartCountry })
      });
    }

    var context = {
      'countries': countries,
      'cart': this.model.attributes
    };

    this.$el.html(app.templates.billto(context));
    return this;

  },

  selectText: function (event) {
    jQuery(event.target).select();
  },

  'copyFieldToCart': function (event) {
    var fieldName = event.target.id;

    if (fieldName != 'storedBillingAddress') {
      var value = jQuery.trim(jQuery(event.target).val());
      var changes = {};
      changes[fieldName] = value;
      this.model.set(changes);
    }
  },

  'useStoredAddress': function (event) {
    var oid = event.target.value;
    app.commonFunctions.useBillingAddress(parseInt(oid));
  }


});


// ---------------------------------------------------------------------
// --- Shipping Address Fields ---
// ---------------------------------------------------------------------
app.views.ShippingAddress = Backbone.View.extend({
  el: '#shipToAddress',
  events: {
    'click #shippingIsBilling': 'showHideBilling',
    'focus input[type=text]': 'selectText',
    'change input[type=text],input[type=number],input[type=email],select': 'copyFieldToCart',
    'change #storedShippingAddress': 'useStoredAddress'
  },

  'onClose': function () {
    this.model.off('sync reset', this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('sync reset', this.render, this);
    _.bindAll(this);
  },

  render: function () {

    var countries = [];
    var cartCountry = this.model.get('shipToCountry') || '';
    var masterList = app.data.bootstrap.get('countries');
    if (masterList) {
      _.each(masterList, function (country) {
        countries.push({country: country, selected: country == cartCountry })
      });
    }

    //are billing and shipping the same?
    var cart = this.model.attributes;
    var shippingIsBilling = (cart.shipToFirstName == cart.billToFirstName &&
            cart.shipToLastName == cart.billToLastName &&
            cart.shipToCompany == cart.billToCompany &&
            cart.shipToCountry == cart.billToCountry &&
            cart.shipToCity == cart.billToCity &&
            cart.shipToState == cart.billToState &&
            cart.shipToPostalCode == cart.billToPostalCode &&
            cart.shipToAddress1 == cart.billToAddress1 &&
            cart.shipToAddress2 == cart.billToAddress2
            );

    var context = {
      'countries': countries,
      'cart': cart,
      'shipToResidential': this.model.get('shipToResidential') || false, // the custom handlebars helper I wrote doesn't work with nested properties (yet).
      'shippingIsBilling': shippingIsBilling
    };

    this.$el.html(app.templates.shipto(context));
    return this;

  },

  selectText: function (event) {
    jQuery(event.target).select();
  },

  'showHideBilling': function (event) {
    var checked = jQuery(event.target).is(':checked');
    app.commonFunctions.showHideBilling(!checked, checked);
  },

  'copyFieldToCart': function (event) {
    var fieldName = event.target.id;

    if (fieldName != 'storedShippingAddress') {

      var value = jQuery.trim(jQuery(event.target).val());
      var changes = {};

      // see if the billto should be updated too.
      var checked = jQuery('#shippingIsBilling').is(':checked');
      changes[fieldName] = value;

      if (checked && fieldName.substring(0, "shipTo".length) === "shipTo") {
        fieldName = "billTo" + fieldName.substring("shipTo".length);
        changes[fieldName] = value;
      }

      this.model.set(changes);
    }
  },

  'useStoredAddress': function (event) {
    var oid = event.target.value;
    app.commonFunctions.useShippingAddress(parseInt(oid));
  }


});


// ---------------------------------------------------------------------
// --- Payment Fields ---
// ---------------------------------------------------------------------
app.views.Payment = Backbone.View.extend({
  el: '#payment',
  events: {
    'focus input[type=text]': 'selectText',
    'change input[type=text],input[type=number],input[type=email],select': 'copyFieldToCart',
    'change input[type=checkbox]': 'copyCheckboxToCart',
    'click .ccv-help-link': 'toggleCvv'
  },

  'onClose': function () {
    this.model.off('sync reset', this.render, this);
    this.model.off('change:customerProfileCreditCardId', this.toggleEntryFields, this);
    this.model.off('change:creditCardNumber', this.updateCardNumber, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('sync reset', this.render, this);
    this.model.on('change:customerProfileCreditCardId', this.toggleEntryFields, this);

    // if store card is being used, this will update the field with the mask without re-render
    // if we re-render, the focus will be lost, causing a bad customer experience.
    this.model.on('change:creditCardNumber', this.updateCardNumber, this);
    _.bindAll(this);
  },

  render: function () {

    var ccType = this.model.get('creditCardType') || '';
    var ccExpMonth = this.model.get('creditCardExpirationMonth') || 0;
    var ccExpYear = this.model.get('creditCardExpirationYear') || 0;
    var sourceTypes = this.model.get('creditCardTypes') || ['AMEX', 'Discover', 'MasterCard', 'Visa' ];

    var ccTypes = [];
    _.each(sourceTypes, function (card) {
      ccTypes.push({card: card, selected: card == ccType });
    });
    var ccMonths = [
      {month: 1, name: 'January', selected: 1 == ccExpMonth},
      {month: 2, name: 'February', selected: 2 == ccExpMonth},
      {month: 3, name: 'March', selected: 3 == ccExpMonth},
      {month: 4, name: 'April', selected: 4 == ccExpMonth},
      {month: 5, name: 'May', selected: 5 == ccExpMonth},
      {month: 6, name: 'June', selected: 6 == ccExpMonth},
      {month: 7, name: 'July', selected: 7 == ccExpMonth},
      {month: 8, name: 'August', selected: 8 == ccExpMonth},
      {month: 9, name: 'September', selected: 9 == ccExpMonth},
      {month: 10, name: 'October', selected: 10 == ccExpMonth},
      {month: 11, name: 'November', selected: 11 == ccExpMonth},
      {month: 12, name: 'December', selected: 12 == ccExpMonth}
    ];

    var ccYears = [];
    for (var year = 2013; year < 2031; year++) {
      ccYears.push({year: year, selected: year == ccExpYear});
    }


    // loop through the cards, cloning them and adding a 'selected' flag to them.  this will make them handlebars friendly.
    var storedCards = [];
    var selectedCard = this.model.get('customerProfileCreditCardId') || 0;
    var currentTime = new Date();
    var currentYear = currentTime.getFullYear();
    var currentMonth = currentTime.getMonth() + 1;

    if (this.model.attributes.customerProfile && this.model.attributes.customerProfile.creditCards) {
      _.each(this.model.attributes.customerProfile.creditCards, function (card) {
        var clonedCard = _.clone(card);
        clonedCard['selected'] = (clonedCard.id == selectedCard);

        if (clonedCard.cardExpYear < currentYear || ( clonedCard.cardExpYear == currentYear && clonedCard.cardExpMonth < currentMonth )) {
          clonedCard['status'] = '[expired]';
        } else {
          clonedCard['status'] = '';
        }

        storedCards.push(clonedCard);
      });
    }


    var context = {
      'ccTypes': ccTypes,
      'ccMonths': ccMonths,
      'ccYears': ccYears,
      'cart': this.model.attributes,
      'storedCards': storedCards,
      'loggedIn': this.model.get('loggedIn')
    };

    this.$el.html(app.templates.payment(context));
    return this;

  },


  'toggleEntryFields': function () {
    var id = this.model.get('customerProfileCreditCardId') || 0;
    var disabled = id != 0 && id != "0";

    jQuery("#creditCardType, #creditCardNumber, #creditCardExpirationMonth, #creditCardExpirationYear, #creditCardVerificationNumber, #storeCreditCard").attr('disabled', disabled);
  },

  selectText: function (event) {
    jQuery(event.target).select();
  },

  'updateCardNumber': function () {
    jQuery('#creditCardNumber').val(app.data.cart.get('creditCardNumber') || '');
  },

  'copyFieldToCart': function (event) {
    var fieldName = event.target.id;
    var value = jQuery.trim(jQuery(event.target).val());
    var changes = {};
    changes[fieldName] = value;
    this.model.set(changes);

    if (fieldName == 'creditCardNumber') {
      app.commonFunctions.storeCard();
    }

  },

  'copyCheckboxToCart': function (event) {
    var fieldName = event.target.id;
    var value = jQuery(event.target).is(':checked');
    var changes = {};
    changes[fieldName] = value;
    this.model.set(changes);
  },


  'toggleCvv': function () {
    jQuery('.ccv_message').toggle('fast', function () {
      // Animation complete.
    });
  }

});


// ---------------------------------------------------------------------
// --- Items: Line Item ---
// ---------------------------------------------------------------------
app.views.Item = Backbone.View.extend({
  tagName: 'div',
  events: {
    "click .btnRemove": "itemRemove",
    "change .itemQty": "changeQuantity",
    "change .singleQualifier": "changeSingleQualifier",
    "change .multiQualifier": "changeMultiQualifier",
    "change .selectQualifier": "changeSelectQualifier",
    "click .radioQualifier": "changeRadioQualifier",
    "focus input[type=text]": "selectText"
  },

  'onClose': function () {
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    _.bindAll(this);
  },

  render: function () {

    // this is going to seem like double-killing, but it's necessary.  I need to loop through the qualifiers
    // and set the selected value for drop downs to either the default or first value if it's empty.  then, i'll
    // clone the qualifiers and set a property to make a drop down box work.
    if (this.model.get('options')) {
      _.each(this.model.get('options'), function (optionValue) {

        // if the item has options, and the options is displays as a dropdown, and there is a list of dropdown values present, but nothing is selected yet
        // find either the default or first value and set it as the selected value.  This is necessary because the dropdowns do not have
        // blanks in them, so there's no way to trigger a 'change' event on the dropdown if the first value (or default) is desired.  so I have
        // to manually set it here.
        if (optionValue.type == 'dropdown' && !optionValue.selectedValue && optionValue.values && optionValue.values.length) {
          var defaultValue = _.find(optionValue.values, function (value) {
            return value.defaultValue; // boolean on each option value indicating if value is the default
          });
          if (defaultValue) {
            optionValue.selectedValue = defaultValue.value;
          } else {
            optionValue.selectedValue = optionValue.values[0].value;
          }
        }
      });

      var itemOptions = [];
      jQuery.extend(itemOptions, this.model.get('options') || []); // clone the qualifiers into a separate object

      // loop through and set a flag on a qualifier if it's currently selected.  makes the handlebars code workable.
      _.each(itemOptions, function (itemOption) {
        var selectedValue = itemOption.selectedValue || '';
        if (itemOption.values) {
          _.each(itemOption.values, function (value) {
            // first, see if there are any defaults that need to be set.  If there is a default, and no selected, set the selected to the default.
            if (!selectedValue && value.defaultValue) {
              value.selected = true;
            } else if (value.value == selectedValue) {
              value.selected = true;
            } else {
              value.selected = false;
            }
          });
        }
      });
    }


    var context = {
      'position': this.options.position,
      'itemId': this.model.get('itemId'),
      'description': this.model.get('description'),
      'quantity': this.model.get('quantity'),
      'unitCost': this.formatUnitCost(),
      'options': itemOptions,
      'imageUrl': this.model.get('defaultThumbnailUrl')
    };

    this.$el.html(app.templates.item(context));
    this.$el.addClass('item');
    if (this.options.position == 1) {
      this.$el.addClass('item-first');
    }
    if (this.options.position == this.options.totalItems) {
      this.$el.addClass('item-last');
    }
    this.$el.addClass(this.options.position % 2 == 0 ? "item-even" : "item-odd");

    return this;
  },

  selectText: function (event) {
    jQuery(event.target).select();
  },

  "itemRemove": function () {
    // normally, we'd call model.destroy, but this is a nested model, so we simply wish to call remove on the items collection
    // which will update the underlying items array on the cart object.
    app.data.cart.items.remove(this.model);
    // save the cart object, which will persist the removal of the item.
    app.data.cart.save();
  },

  'formatUnitCost': function () {

    var result = "";
    var unitCost = this.model.get('unitCost');
    if (unitCost) {
      result = parseFloat(unitCost);
      if (isNaN(result)) {
        result = 0;
      }
    } else {
      result = 0;
    }
    return result == 0 ? "Free" : accounting.formatMoney(result);
  },
  'changeQuantity': function (event) {
    var val = jQuery.trim(jQuery(event.target).val());
    var qty = parseInt(val);
    if (isNaN(qty)) {
      qty = 1;
    }

    this.model.set({'quantity': qty}, {'silent': true});
    app.data.cart.save();
  },
  'changeSingleQualifier': function (event) {
    this.changeQualifier(event, 'single');
  },
  'changeFixedQualifier': function (event) {
    this.changeQualifier(event, 'fixed');
  },
  'changeMultiQualifier': function (event) {
    this.changeQualifier(event, 'multi');
  },
  'changeSelectQualifier': function (event) {
    this.changeQualifier(event, 'select');
  },

  'changeQualifier': function (event, type) {
    // get the id, get the value
    // find the qualGroup, update it's selectedQualifier property
    // save the cart.
    var prefix = 'singleQualifier_';
    if (type == 'multi') {
      prefix = 'multiQualifier_';
    } else if (type == 'select') {
      prefix = 'selectQualifier_';
    } else if (type == 'fixed') {
      prefix = 'fixedQualifier_';
    }

    var id = uc.commonFunctions.parseOidFromId(event.target.id, prefix);
    var val = jQuery.trim(jQuery(event.target).val());

    var found = false;
    _.each((this.model.get('options') || []), function (itemOption) {
      if (itemOption.optionOid == id) {
        itemOption.selectedValue = val;
        found = true;
      }
    });
    if (found) {
      app.data.cart.save();
    }

  },
  'changeRadioQualifier': function (event) {
    // get the id, get the value
    // find the qualGroup, update it's selectedQualifier property
    // save the cart.
    var prefix = 'radioQualifier_';

    // notice I'm using the target.name and not target.id.  there are multiple radio buttons in a group. can't use id.
    var id = uc.commonFunctions.parseOidFromId(event.target.name, prefix);
    var val = jQuery.trim(jQuery(event.target).val());

    var found = false;
    _.each((this.model.get('options') || []), function (itemOption) {
      if (itemOption.optionOid == id) {
        itemOption.selectedValue = val;
        found = true;
      }
    });
    if (found) {
      app.data.cart.save();
    }
  }

});


// ---------------------------------------------------------------------
// --- Items ---
// ---------------------------------------------------------------------
app.views.Items = Backbone.View.extend({
  el: '#cart',
  childViews: [],
  events: {
  },

  'onClose': function () {
    this.collection.off('add sync remove reset change', this.render, this);
    app.data.bootstrap.off('change:initialLoadDone', this.render, this);
    this.closeChildren();
    // dispose of the children
    _.each(this.childViews, function (view) {
      view.close();
    });
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.collection.on('add sync remove reset change', this.render, this);
    app.data.bootstrap.on('change:initialLoadDone', this.render, this);
    _.bindAll(this);
  },

  render: function () {

    var noItems = this.collection.length <= 0;
    if (noItems) {
      jQuery('#checkoutFields').addClass('hidden');
    } else {
      jQuery('#checkoutFields').removeClass('hidden');
    }

    var stillLoading = !app.data.bootstrap.get('initialLoadDone');

    var context = {'noItems': noItems, 'stillLoading': stillLoading};
    this.$el.html(app.templates.items(context));

    var that = this;

    // the first time, we don't need to do any clean up.  but subsequent render() calls need to close down any
    // existing views to avoid zombie event handlers.
    this.closeChildren();
    this.childViews = []; // re-init on each render so we capture any and all changed.

    var position = 1;
    this.collection.each(function (model) {
      // add the position to the context so we can number the items in the template.
      that.childViews.push(new app.views.Item({model: model, position: position, totalItems: that.collection.length}));
      position++;
    });

    var footer = jQuery('footer', this.$el);
    _.each(this.childViews, function (view) {
      view.render();
      footer.before(view.el).before("<br class='clear'>"); // I don't like this. not elegant.  don't know of a better way.
    });

    return this;
  },


  'closeChildren': function () {
    _.each(this.childViews, function (view) {
      view.close();
    });
  }

});


// ---------------------------------------------------------------------
// --- Subtotal ---
// ---------------------------------------------------------------------
app.views.Subtotal = Backbone.View.extend({
  el: '#subtotal',
  events: {
    "click .btnContinueShopping": "continueShopping"
  },

  'onClose': function () {
    this.model.off('sync reset change:subtotal', this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('sync reset change:subtotal', this.render, this);
    _.bindAll(this);
  },

  render: function () {

    var context = {'subtotal': accounting.formatMoney(this.model.get('subtotal'))};
    this.$el.html(app.templates.subtotal(context));
    return this;
  },

  'continueShopping': function () {
    location.href = continueShoppingUrl;
  }

});


// ---------------------------------------------------------------------
// --- Shipping ---
// ---------------------------------------------------------------------
app.views.Shipping = Backbone.View.extend({
  el: '#shipping',
  events: {
    "click .inputShippingPreference": "selectShippingMethod",
    "change .selectShippingPreference": "selectShippingMethod"

  },
  priorItems: {}, // this is used to keep track of item changes.  since the cart items fire reset for each save, i need to know if the items actually changed
  // or infinite recursion could result.
  'onClose': function () {
    this.collection.off("change reset", this.render, this);
    app.data.cart.off("change:shipToPostalCode change:shipToCity change:shipToState change:shipToCountry", this.recalculateForDemographics, this);
    app.data.cart.off("change:shippingMethod", this.render, this);
    app.data.cart.items.off("change reset add remove", this.recalculateForItems, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.collection.on("change reset", this.render, this);
    app.data.cart.on("change:shipToPostalCode change:shipToCity change:shipToState change:shipToCountry", this.recalculateForDemographics, this);
    app.data.cart.on("change:shippingMethod", this.render, this);
    app.data.cart.items.on("change reset add remove", this.recalculateForItems, this);
    _.bindAll(this);

  },

  'showDropdown': false, // keep track of whether we showed a dropdown for shipping at any time to avoid switching on the customer.

  render: function () {
    var cart = app.data.cart.attributes;

    // create a copy of each model's attributes, and format the cost appropriately.
    var methods = [];
    _.each(app.data.shippingEstimates.models, function (model) {
      var cost = model.get('cost') == 0 ? "Free" : (accounting.formatMoney(model.get('cost') || 0));
      var method = _.clone(model.attributes);
      method['cost'] = cost; // overwrite the number with a formatted string.
      methods.push(method);
    });

    if (methods.length > 3 || this.showDropdown) {
      this.showDropdown = true;
    }

    var context = {
      'methods': methods,
      'noShippingMethods': this.collection.length == 0,
      'showDropdown': this.showDropdown,
      'selectedMethod': cart.shippingMethod
    };

    this.$el.html(app.templates.shipping(context));


    return this;
  },

  'selectShippingMethod': function (event) {
    var field = jQuery(event.target);
    var shippingMethodName = field.val();
    var model = this.collection.get(shippingMethodName);
    if (model) {

      var changes = {'shippingMethod': shippingMethodName, 'shippingHandling': model.get('cost')};
      // wipe out any previous settings for lift gate and third party if *this* method doesn't support them.

      // do a save instead of a set because this affects the totals.
      app.data.cart.save(changes);
    }
  },

  'recalculateForDemographics': function () {
    // do a recalc regardless of items, but store the current items.
    // try not to wait the first time this is called (page load).  after that, wait to give user time to finish entering fields.
    var firstTime = _.keys(this.priorItems).length > 0;
    this.priorItems = this.getCurrentItems();
    if (firstTime || app.data.cart && app.data.cart.get('shipToPostalCode') && app.data.cart.get('shipToCountry') && app.data.cart.get('shipToState')) {
      setTimeout(app.commonFunctions.estimateShipping, 1);
    }
  },

  'recalculateForItems': function () {
    var currentItems = this.getCurrentItems();
    if (!_.isEqual(this.priorItems, currentItems)) {
      this.priorItems = currentItems;
      setTimeout(app.commonFunctions.estimateShipping, 1);
    }
  },

  'getCurrentItems': function () {
    var currentItems = {};
    var items = app.data.cart.get('items');
    if (items) {
      _.each(app.data.cart.get('items'), function (item) {
        if (!currentItems.hasOwnProperty(item.itemId)) {
          currentItems[item.itemId] = 0;
        }
        currentItems[item.itemId] += item.quantity;
      });
    }
    return currentItems;
  }


});


// ---------------------------------------------------------------------
// --- Coupons ---
// ---------------------------------------------------------------------
app.views.Coupons = Backbone.View.extend({
  el: '#coupons',
  events: {
    "click #addCouponButton": "addCoupon",
    "click .removeCouponButton": "removeCoupon"
  },

  'onClose': function () {
    this.model.off("change:coupons sync reset", this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on("change:coupons sync reset", this.render, this);
    _.bindAll(this);

  },

  render: function () {
    var context = {
      'coupons': this.model.get('coupons') || []
    };

    this.$el.html(app.templates.coupons(context));
    return this;
  },

  'addCoupon': function (event) {
    app.commonFunctions.clearCheckoutErrors();
    event.stopPropagation();
    var couponCode = jQuery.trim(jQuery('#couponField').val());
    if (couponCode) {
      var coupons = app.data.cart.get('coupons') || [];
      coupons.push({'couponCode': couponCode});
      app.data.cart.save({'coupons': coupons});
    }
  },

  'removeCoupon': function (event) {
    app.commonFunctions.clearCheckoutErrors();
    var idx = uc.commonFunctions.parseOidFromId(event.target.id, 'couponRemove_');
    var coupons = app.data.cart.get('coupons') || [];
    if (coupons && coupons.length) {
      coupons.splice(idx, 1);
      app.data.cart.save({'coupons': coupons});
    }
  }

});


// ---------------------------------------------------------------------
// --- Gift Certificate ---
// ---------------------------------------------------------------------
app.views.GiftCertificate = Backbone.View.extend({
  el: '#giftCertificates',
  events: {
    "click #updateGiftCertificateButton": "updateGiftCertificate"
  },

  'onClose': function () {
    this.model.off("change:giftCertificate change:giftCertificateAmount change:giftCertificateRemainingBalanceAfterOrder sync reset", this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on("change:giftCertificate change:giftCertificateAmount change:giftCertificateRemainingBalanceAfterOrder sync reset", this.render, this);
    _.bindAll(this);

  },

  render: function () {

    var amount = this.model.get('giftCertificateAmount') || '';
    if (amount) {
      amount = amount.toFixed(2);
    }

    var remaining = this.model.get('giftCertificateRemainingBalanceAfterOrder') || '';
    if (remaining) {
      remaining = remaining.toFixed(2);
    }

    var context = {
      'giftCertificate': this.model.get('giftCertificate') || '',
      'giftCertificateAmount': amount,
      'giftCertificateRemainingBalanceAfterOrder': remaining
    };

    this.$el.html(app.templates.giftCertificate(context));
    return this;
  },

  'updateGiftCertificate': function (event) {
    event.stopPropagation();
    var button = jQuery(event.target);
    var text = button.text();
    var giftCertificate = jQuery.trim(jQuery('#giftCertificateField').val());
    app.commonFunctions.clearCheckoutErrors();
    if (text == 'Apply') {
      this.model.save({'giftCertificate': giftCertificate});
    } else {
      // if there is a gift cert, remove it.
      if (this.model.get('giftCertificate')) {
        this.model.save({'giftCertificate': ''});
      }
    }
  }

});


// ---------------------------------------------------------------------
// --- Summary Fields ---
// ---------------------------------------------------------------------
app.views.Summary = Backbone.View.extend({
  el: '#summary',
  events: {
    "click .buySafe_button": "showBuysafeInfo",
    "click .buySafe_bonded_option": "toggleBuysafe"
  },

  'onClose': function () {
    this.model.off('sync reset change:subtotal change:buysafeBondCost change:buysafeBondAvailable change:tax change:shippingHandling change:total', this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('sync reset change:subtotal change:buysafeBondCost change:buysafeBondAvailable change:tax change:shippingHandling change:total', this.render, this);
    _.bindAll(this);
  },

  render: function () {


    var buysafeBondCost = this.model.get('buysafeBondCost') || 0;
    // cart bond cost is different from the actual bond cost, since it will be zero if the bond is not wanted.
    // this variable makes the assumption that a bond is available.  If it's not, the template will hide it from displaying any way.
    var cartBondCost = null;
    if (buysafeBondCost == 0) {
      cartBondCost = "Free!";
    } else if (this.model.get('buysafeBondWanted')) {
      cartBondCost = accounting.formatMoney(this.model.get('buysafeBondCost'))
    } else {
      cartBondCost = accounting.formatMoney(0);
    }

    var context = {
      'beginScript': "<script type='text/javascript'>",
      'endScript': "</script>",
      'buysafeBondCost': accounting.formatMoney(buysafeBondCost),
      'cartBondCost': cartBondCost,
      'buysafeBondAvailable': this.model.get('buysafeBondAvailable') || false,
      'buysafeBondWanted': this.model.get('buysafeBondWanted') || false,
      'buysafeBondFree': buysafeBondCost == 0,
      'subtotal': accounting.formatMoney(this.model.get('subtotal')),
      'tax': accounting.formatMoney(this.model.get('tax')),
      'shippingHandling': accounting.formatMoney(this.model.get('shippingHandling')),
      'total': accounting.formatMoney(this.model.get('total'))
    };

    this.$el.html(app.templates.summary(context));
    return this;

  },

  'showBuysafeInfo': function () {
    jQuery('.buySafe_message').toggle('fast', function () {
      /* Animation complete. */
    });
  },

  'toggleBuysafe': function () {
    this.model.save({'buysafeBondWanted': !this.model.get('buysafeBondWanted')});
  }


});


// ---------------------------------------------------------------------
// --- Total Fields ---
// ---------------------------------------------------------------------
app.views.Paypal = Backbone.View.extend({
  el: '#paypal',
  events: {
    'click .paypal_link': 'placeOrder'
  },

  'onClose': function () {
    this.model.off('add sync remove reset change', this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('add sync remove reset change', this.render, this);
    _.bindAll(this);
  },

  render: function () {

    var showPaypal = this.model.get('hasPayPal') && this.model.get('payPalCompatible');
    var button = this.model.get('payPalButtonUrl') || 'images/paypal_checkout.gif';
    var alt = this.model.get('payPalButtonAltText') || "PayPal";

    this.$el.html(app.templates.paypal({'paypal': showPaypal, button: button, alt: alt}));
    return this;

  },

  placeOrder: function () {
    app.commonFunctions.checkout('PayPal');
  }

});

// ---------------------------------------------------------------------
// --- Total Fields ---
// ---------------------------------------------------------------------
app.views.Total = Backbone.View.extend({
  el: '#total',
  events: {
    'click #btnFinalize': 'placeOrder'
  },

  'onClose': function () {
    this.model.off('add sync remove reset change', this.render, this);
  },

  initialize: function () {
    // initialize is called using apply and passed the argument variable, of which the first argument should be the options.
    if(arguments && arguments.length){
      this.options = arguments[0];
    }

    this.model.on('add sync remove reset change', this.render, this);
    _.bindAll(this);
  },

  render: function () {

    this.$el.html(app.templates.total({}));
    return this;

  },

  placeOrder: function (event) {
    event.preventDefault();
    app.commonFunctions.checkout('Credit Card');
  }

});

// ---------------------------------------------------------------------
// --- operational code ---
// ---------------------------------------------------------------------


jQuery(document).ready(function () {

// bootstrap look up data so I can trigger events, especially for the asynchronously downloaded data.  The only
// downside to this is the backup copy backbone keeps.  Large data sets will now be 2x the size.
// most of the data is in fact, 'boot strapped' during the page load.  However, this is also a state control, and
// there are numerous fields not initialized below that are used throughout the program.  It's a great place to
// track state variables and trigger off them.
  app.data.bootstrap = new app.models.Bootstrap({
    'merchantId': window.merchantId,
    'countries': ['United States'],
    'advertisingSources': [],
    'advertisingSourcesFreeForm': true,
    'taxCounties': [],
    'defaultCountry': 'United States',
    'initialLoadDone': false
  });


  app.data.shippingEstimates = new app.collections.ShippingEstimates(); // initially empty;

  app.data.cart = new app.models.Cart({
    'merchantId': window.merchantId,
    'country': app.data.bootstrap.get('defaultCountry'),
    'shipToCountry': app.data.bootstrap.get('defaultCountry')
  });  // initially empty, except default countries.


  // app.commonFunctions.enablePleaseWaitMessage();

  (new app.views.Credentials({model: app.data.cart})).render();
  (new app.views.Items({collection: app.data.cart.items})).render();
  (new app.views.ShippingAddress({model: app.data.cart})).render();
  (new app.views.BillingAddress({model: app.data.cart})).render();
  (new app.views.Payment({model: app.data.cart})).render();
  (new app.views.Subtotal({model: app.data.cart})).render();
  (new app.views.Shipping({collection: app.data.shippingEstimates})).render();
  (new app.views.Coupons({model: app.data.cart})).render();
  (new app.views.GiftCertificate({model: app.data.cart})).render();
  (new app.views.Summary({model: app.data.cart})).render();
  (new app.views.Paypal({model: app.data.cart})).render();
  (new app.views.Total({model: app.data.cart})).render();


  app.data.cart.fetch({
    headers: {
      'X-UC-Merchant-Id': window.merchantId,  // could also pass merchant id as query parameter named '_mid' or cookie named 'UltraCartMerchantID'
      // the cart id is not passed here as a header. to keep things simple, we'll rely on the cookie to pass in the cart id.
      "cache-control": "no-cache"
    },
    success: function (model) {
      app.data.bootstrap.set({'initialLoadDone': true});
      var cartId = model.get('cartId') || false;
      if (cartId) {
        var cookieName = window.cartCookieName || 'UltraCartShoppingCartID';
        jQuery.cookie(cookieName, model.get('cartId'), { expires: 7, path: '/' });
        app.commonFunctions.pretendToBeUCEditor(); // check http query parameters for UCEditor parameters
        app.data.cart.trigger('sync');

        var thm_params = app.data.cart.get('threatMetrixParams');
        if (thm_params) {
          app.commonFunctions.threatMetrix(thm_params);
        }

      }

      app.commonFunctions.showHideBilling(/* no arguments */);
    }
  });

  // this will show any errors that are query parameters to the page.
  app.commonFunctions.displayServerErrors();

});
