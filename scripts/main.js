/* globals window,HTMLCollection,document */
// main.js
// main source file for vanilla cart implementation

'use strict';

if (!window.uc) {
    window.uc = {};
}

uc.initialLoadDone = false;
uc.inLogin = false; // state management for login process.
uc.inRegister = false; // state management for register process.
uc.hostedFieldsSetup = false;
uc.alreadyGettingEstimates = false; // avoid duplicate shipping estimate calls when customer is rapidly entering shipping.
uc.settings = {}; // this will be populated on first call to getCart with the cart.settings object.
uc.shippingEstimates = []; // this will be populated whenever the shipping estimates are retrieved.
// each time we get shipping estimates, store the location.  this will prevent
// making useless calls whenever a change event fires on the shipping address.
uc.shippingEstimateLastLocation = {};
// UltraCart API doesn't bring down allowed countries.  Add whatever countries you allow here.  It does bring down
// provinces, but only for the US.  Strange.
uc.allowedCountries = [
    {country_code: "US", name: "United States"}
];

// this object is a Hash Map, key = country, value = array of CartSettingsProvince {code,province}
// this United States will be automatically filled by the cart settings. You must provide any additional country regions
uc.allowedStates = {"US": []};

uc.sdk = require('ultra_cart_rest_api_v2');
if (!uc.cookieName) {
    uc.cookieName = 'UltraCartShoppingCartID';
}

// ===================================================================================
// UltraCart SDK Initialization
// ===================================================================================
var defaultClient = uc.sdk.ApiClient.instance;
defaultClient.authentications['ultraCartBrowserApiKey'].apiKey = window.uc.browserKey;
defaultClient.defaultHeaders["X-UltraCart-Api-Version"] = "2017-03-01";

// ===================================================================================
// UltraCart Checkout API bootstrap
// ===================================================================================
window.uc.checkoutApi = new uc.sdk.CheckoutApi();
// the difference between the expansions is settings and/or shipping estimates.  estimating shipping involves communicating with
// shipping providers such as FedEx and UPS.  It's very slow.  So we only want to include that expansion if we have
// at least a city, state, country, and postal code.
// Additional, the settings object is static and contiains shipping/billing countries.  Those generate large json blocks.
// So we only wish to get the settings once and store them off.
window.uc.initialExpansion = "affiliate,billing,checkout,coupons,customer_profile,gift,gift_certificate,items,items.attributes,items.multimedia,items.multimedia.thumbnails,items.physical,marketing,payment,settings.billing.provinces,settings.gift,settings.shipping.deliver_on_date,settings.shipping.provinces,settings.shipping.ship_on_date,settings.terms,settings.taxes,shipping,summary,taxes,upsell_after";
window.uc.expansion = "affiliate,billing,checkout,coupons,customer_profile,gift,gift_certificate,items,items.attributes,items.multimedia,items.multimedia.thumbnails,items.physical,marketing,payment,shipping,summary,taxes,upsell_after";
// We only need the shipping estimates for the last, but we need to submit the entire cart so that everything can be factored into shipping costs (coupons, etc).
window.uc.expansionForShippingEstimates = "settings.shipping.estimates,affiliate,billing,checkout,coupons,customer_profile,gift,gift_certificate,items,items.attributes,items.multimedia,items.multimedia.thumbnails,items.physical,marketing,payment,shipping,summary,taxes,upsell_after";
window.uc.cart = null;

// ===================================================================================
// Pure javascript replacement functions for common library methods
// ===================================================================================

// shim for trim()
// https://stackoverflow.com/questions/498970/trim-string-in-javascript
if (!String.prototype.trim) {
    (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    })();
}

// IE8 shim for getElementsByClassName.  As of May 2018, IE8 had a 0.3% market share.
(function () {
    if (!document.getElementsByClassName) {
        // noinspection JSPotentiallyInvalidConstructorUsage
        window.Element.prototype.getElementsByClassName = document.constructor.prototype.getElementsByClassName = function (classNames) {
            classNames || (classNames = '*');
            classNames = classNames.split(' ').join('.');

            if (classNames !== '*') {
                classNames = '.' + classNames;
            }

            return this.querySelectorAll(classNames);
        };
    }

})();


function addEvent(el, type, handler) {
    if (typeof el === 'string') {
        return addEvent(document.getElementById(el), type, handler);
    }
    if (el.attachEvent) el.attachEvent('on' + type, handler); else el.addEventListener(type, handler);
}

function removeEvent(el, type, handler) {
    if (typeof el === 'string') {
        return removeEvent(document.getElementById(el), type, handler);
    }
    if (el.detachEvent) el.detachEvent('on' + type, handler); else el.removeEventListener(type, handler);
}

function addEventByClassName(className, type, handler) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        addEvent(elements[i], type, handler);
    }
}

function removeEventByClassName(className, type, handler) {
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        removeEvent(elements[i], type, handler);
    }
}


// pure js version of jQuery ready
function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState !== 'loading')
                fn();
        });
    }
}

function fireChangeEventsForAutofill() {
    document.addEventListener('animationstart', function (event) {
        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('input') && !event.target.matches('select')) return;

        // Fire a change event
        console.log("Fire change event on", event.target, " due to auto fill.");
        event.target.dispatchEvent(new Event('change'));
    });
}


/**
 * Get the closest matching element up the DOM tree.
 * @private
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against
 * @return {Boolean|Element}  Returns null if not match found
 */
var getClosest = function (elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {
                }
                return i > -1;
            };
    }

    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }

    return null;
};

// Create cookie
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Read cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

// // Erase cookie
// function eraseCookie(name) {
//     createCookie(name, "", -1);
// }


function showIfCartHasItems(ele) {
    if (uc.cart && uc.cart.items && uc.cart.items.length) {
        show(ele);
    } else {
        hide(ele);
    }
}


/**
 * convenience function for adding the 'hidden' class to part of the dom tree.  makes it more intuitive
 * @param ele same parameter as removeClass()
 */
function show(ele) {
    removeClass(ele, 'hidden');
}

/**
 * convenience function for adding the 'hidden' class to part of the dom tree.  makes it more intuitive
 * @param ele same parameter as addClass()
 */
function hide(ele) {
    addClass(ele, 'hidden');
}

function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

/**
 * accepts 4 kinds of elements and adds the class cls to them.
 * @param ele may be 1) document id, 2) class query selector (starting with a period), 3) element, 4) NodeList
 * @param cls the class name to add
 */
function addClass(ele, cls) {
    if (typeof ele === 'string') {
        addClass(document.getElementById(ele), cls);
        return;
    }

    // if this is a NodeList, iterate it. otherwise treat as single element.
    // note that getElementsByClassName directly above returns a HTMLCollection
    if (HTMLCollection.prototype.isPrototypeOf(ele)) {
        for (var i = 0; i < ele.length; i++) {
            if (!hasClass(ele[i], cls)) ele[i].className += " " + cls;
        }
    } else {
        if (!hasClass(ele, cls)) ele.className += " " + cls;
    }
}

/**
 * accepts 4 kinds of elements and removes the class cls from them.
 * @param ele may be 1) document id, 2) class query selector (starting with a period), 3) element, 4) NodeList
 * @param cls the class name to remove
 */
function removeClass(ele, cls) {
    if (typeof ele === 'string') {
        removeClass(document.getElementById(ele), cls);
        return;
    }

    // if this is a NodeList, iterate it. otherwise treat as single element.
    // note that getElementsByClassName directly above returns a HTMLCollection

    var reg = null;
    if (HTMLCollection.prototype.isPrototypeOf(ele)) {
        reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        for (var i = 0; i < ele.length; i++) {
            if (hasClass(ele[i], cls)) {
                ele[i].className = ele[i].className.replace(reg, ' ');
            }
        }
    } else {
        if (hasClass(ele, cls)) {
            reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }
}


function _find(anArrayOfObjects, functionForTesting) {
    for (var i = 0; i < anArrayOfObjects.length; i++) {
        if (functionForTesting(anArrayOfObjects[i])) {
            return anArrayOfObjects[i];
        }
    }
    return null;
}


var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function esc(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
        return entityMap[s];
    });
}


/**
 * helper method designed to allow for money calculations on the client side.
 * Only those currencies supported by UltraCart are implemented here.
 * @param amount amount to be formatted
 * @param currencyCode the desired currency code
 * @return {*} A string formatted in the desired currency.
 */
function formatMoney(amount, currencyCode) {
    if (isNaN(amount)) {
        return "";
    }

    // if we don't have a currency code, there's nothing to do here.
    if (!currencyCode) {
        return amount.toFixed(2);
    }

    /**
     * takes a number and adds thousandths separators
     * @param n
     * @param thouSep thousandth separator, usually a comma
     * @param decSep decimal separator, usually a period
     * @return {string}
     */
    function numberWithSeparators(n, thouSep, decSep) {
        var parts = n.toString().split(decSep);
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thouSep) + (parts[1] ? decSep + parts[1] : "");
    }

    var formats = {
        "AUD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' AUD', 'fractionDigits': 2},
        "BRL": {'prefix': 'R$', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
        "CAD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' CAD', 'fractionDigits': 2},
        "CHF": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' Sfr', 'fractionDigits': 2},
        "EUR": {'prefix': '', 'thousandth': '.', 'decimalSeparator': ',', suffix: ' ' + '\u20AC', 'fractionDigits': 2},
        "GBP": {'prefix': '\u00A3', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
        "JPY": {'prefix': '\u00A5', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 0},
        "MXN": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' MXN', 'fractionDigits': 2},
        "NOK": {'prefix': 'kr', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2},
        "NZD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' NZD', 'fractionDigits': 2},
        "RUB": {
            'prefix': '',
            'thousandth': ',',
            'decimalSeparator': '.',
            suffix: ' \u0440\u0443\u0431',
            'fractionDigits': 2
        },
        "SEK": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' Kr', 'fractionDigits': 2},
        "SGD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' SGD', 'fractionDigits': 2},
        "TRY": {'prefix': '', 'thousandth': ',', 'decimalSeparator': '.', suffix: ' YTL', 'fractionDigits': 2},
        "USD": {'prefix': '$', 'thousandth': ',', 'decimalSeparator': '.', suffix: '', 'fractionDigits': 2}
    };

    var format = null;
    if (formats.hasOwnProperty(currencyCode)) {
        format = formats[currencyCode];
    }


    if (format) {
        var fixedAmount = amount.toFixed(format.fractionDigits);
        var fixedAmountStr = fixedAmount.toString();
        var hasNegativeSign = false;

        if (fixedAmountStr.indexOf('-') === 0) {
            hasNegativeSign = true;
            fixedAmountStr = fixedAmountStr.substr(1);
        }

        return (hasNegativeSign ? "-" : "") + format.prefix + numberWithSeparators(fixedAmountStr, format.thousandth, format.decimalSeparator) + format.suffix;
    }

    return amount.toFixed(2); // nothing to do but fail gracefully.

}


// ===================================================================================
// sub routines used by the shopping cart
// below are logic blocks that are too big to fit inline with event handlers, or are
// commonly used throughout.
// ===================================================================================

function startPleaseWait() {
    var list = document.getElementsByClassName('PW_inner');
    for (var i = 0; i < list.length; i++) {
        list[i].style.display = 'block';
    }
}

function stopPleaseWait() {
    var list = document.getElementsByClassName('PW_inner');
    for (var i = 0; i < list.length; i++) {
        list[i].style.display = 'none';
    }
}


// this function expects a server side error.  they are supplied as Response.text.  here's an example:
// "{"error":{"developer_message":"Permission Denied.","user_message":"Permission Denied."},"metadata":{}}"
function displayServerErrors(jsonString) {
    var error_object = JSON.parse(jsonString);
    if (error_object && error_object.error && error_object.error.user_message) {
        displayCheckoutErrors(error_object.error.user_message);
    }
}

function displayCheckoutErrors(errors) {
    var html = '<ul>';

    if (typeof errors === 'string') {
        html += '<li>' + errors + '</li>';
    } else {
        for (var j = 0; j < errors.length; j++) {
            html += '<li>' + errors[j] + '</li>';
        }
    }

    html += '</ul>';

    show('checkoutError');
    show('loginError');
    var errorContents = document.getElementsByClassName('errorContent');
    show(errorContents);
    for (var i = 0; i < errorContents.length; i++) {
        errorContents[i].innerHTML = html;
    }
}


function clearCheckoutErrors() {

    hide('checkoutError');
    hide('loginError');

    var errorContents = document.getElementsByClassName('errorContent');
    hide(errorContents);
    for (var i = 0; i < errorContents.length; i++) {
        errorContents[i].innerHTML = "";
    }
}


function blockUserInput() {
    // quick check for a background.
    var bgDiv = document.getElementById('MB_overlay');
    if (document.getElementById('MB_overlay') === null) {
        bgDiv = document.createElement('div');
        bgDiv.id = 'MB_overlay';
        document.body.appendChild(bgDiv);
    }

    bgDiv.style.width = '100%';
    bgDiv.style.height = '100%';
    bgDiv.style.opacity = "0.5";
    bgDiv.style.display = "block";
}

function endBlockUserInput() {
    var bgDiv = document.getElementById('MB_overlay');
    bgDiv.style.display = "none";
}


function showHideBilling(showBilling, update) {

    // if show is not defined, then determine if the billing should be shown by comparing the carts.
    // after determining, update the check box as well.  this needs to be done on page load to sync
    // the check box with any existing cart.

    var bt = null; // shortcut to cart billing
    var st = null; // shortcut to cart shipping

    if (typeof showBilling === 'undefined') {

        var theyAreTheSame = true;  // if there is no cart, the fields should be hidden by default.
        if (uc.cart && uc.cart.billing && uc.cart.shipping) {
            bt = uc.cart.billing;
            st = uc.cart.shipping;
            theyAreTheSame =
                (st.first_name === bt.first_name) &&
                (st.last_name === bt.last_name) &&
                (st.company === bt.company) &&
                (st.address1 === bt.address1) &&
                (st.address2 === bt.address2) &&
                (st.city === bt.city) &&
                (st.postal_code === bt.postal_code) &&
                (st.state_region === bt.state_region) &&
                (st.country_code === bt.country_code);
        }

        showHideBilling(!theyAreTheSame, false);

    } else {

        var billingInfo = document.getElementById('billToAddress');
        if (showBilling) {
            show(billingInfo);
        } else {
            hide(billingInfo);
        }

        if (update) {

            bt = uc.cart.billing || new uc.sdk.CartBilling();
            st = uc.cart.shipping || new uc.sdk.CartShipping();

            bt.first_name = st.first_name;
            bt.last_name = st.last_name;
            bt.company = st.company;
            bt.address1 = st.address1;
            bt.address2 = st.address2;
            bt.city = st.city;
            bt.postal_code = st.postal_code;
            bt.state_region = st.state_region;
            bt.country_code = st.country_code;

            uc.cart.billing = bt; // just in case it's new
            uc.cart.shipping = st; // just in case it's new

            renderAddresses();
        }
    }
}


function displayHandoffErrors() {
    var errors = [];
    var searchString = window.location.search.substring(1), params = searchString.split("&");
    for (var i = 0; i < params.length; i++) {
        var val = params[i].split("=");
        if (val[0] === 'error') {
            // change out any plus signs to spaces, then decode.
            errors.push(decodeURIComponent(val[1].replace(/\+/g, ' ')));
        }
    }
    if (errors.length) {
        displayCheckoutErrors(errors);
    }
}


function isYesValue(val) {
    if (!val) {
        val = false; // take care of nulls and undefined.
    }
    if (typeof val === 'string') {
        val = val.toLowerCase();
        return "yes" === val || "true" === val || "on" === val || "Y" === val || "1" === val;
    }
    return val;
}


function parseHttpParameters() {
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
}

// this method should only be called after the cart has loaded.
// see: http://docs.ultracart.com/display/ucdoc/Parameters+that+can+be+passed+to+UCEditor
function processQueryParameters() {

    console.log("processQueryParameters()");

    // note: all params are key=string, value=array, but most always we only need the first value.
    // so you'll see [0] tacked onto every value reference, such as params[propertyName][0]. just fyi.

    var params = parseHttpParameters();
    var propertyName; // used in looping as an iterator below.


    var billingProperties = {
        billingfirstname: 'first_name',
        billinglastname: 'last_name',
        billingcompany: 'company',
        billingaddress1: 'address1',
        billingaddress2: 'address2',
        billingcity: 'city',
        billingstate: 'state',
        billingpostalcode: 'postal_code',
        billingcountry: 'country_code',
        billingdayphone: 'day_phone',
        billingeveningphone: 'evening_phone'
    };

    var shippingProperties = {
        shippingfirstname: 'first_name',
        shippinglastname: 'last_name',
        shippingcompany: 'company',
        shippingaddress1: 'address1',
        shippingaddress2: 'address2',
        shippingcity: 'city',
        shippingstate: 'state',
        shippingpostalcode: 'postal_code',
        shippingcountry: 'country',
        shippingdayphone: 'day_phone',
        shippingmethod: 'shipping_method'
    };


    var ccProperties = {
        creditcardtype: 'card_type',
        creditcardnumbertoken: 'card_number_token',
        creditcardexpmonth: 'card_expiration_month',
        creditcardexpyear: 'card_expiration_year',
        creditcardcvv2token: 'card_verification_number_token'
    };


    var checkoutProperties = {
        customfield1: 'custom_field1',
        customfield2: 'custom_field2',
        customfield3: 'custom_field3',
        customfield4: 'custom_field4',
        customfield5: 'custom_field5',
        customfield6: 'custom_field6',
        customfield7: 'custom_field7',
        themecode: 'screen_branding_theme_code'
    };


    var marketingProperties = {
        advertisingsource: 'advertising_source'
    };

    var cartChanged = false;
    // --- billing ---------------------------------------------------------------
    var billing = uc.cart.billing;
    if (!billing) {
        billing = uc.cart.billing = new uc.sdk.CartBilling();
    }
    for (propertyName in billingProperties) {
        if (billingProperties.hasOwnProperty(propertyName)) {
            if (params.hasOwnProperty(propertyName)) {
                billing[billingProperties[propertyName]] = params[propertyName][0];
                cartChanged = true;
            }
        }
    }
    if (params.hasOwnProperty("ccemail")) {
        billing.cc_emails = params['ccemail'];
        cartChanged = true;
    }


    // --- shipping ---------------------------------------------------------------
    var shipping = uc.cart.shipping;
    if (!shipping) {
        shipping = uc.cart.shipping = new uc.sdk.CartShipping();
    }
    for (propertyName in shippingProperties) {
        if (shippingProperties.hasOwnProperty(propertyName)) {
            if (params.hasOwnProperty(propertyName)) {
                shipping[shippingProperties[propertyName]] = params[propertyName][0];
                cartChanged = true;
            }
        }
    }


    // --- credit card ---------------------------------------------------------------
    var payment = uc.cart.payment;
    if (!payment) {
        payment = uc.cart.payment = new uc.sdk.CartPayment();
    }
    var hasCcProperty = false;
    var paymentCreditCard = payment.credit_card;
    if (!paymentCreditCard) {
        paymentCreditCard = new uc.sdk.CartPaymentCreditCard(); // don't assign this to the cart yet.  might not.
    }
    for (propertyName in ccProperties) {
        if (ccProperties.hasOwnProperty(propertyName)) {
            if (params.hasOwnProperty(propertyName)) {
                hasCcProperty = true;
                if (propertyName === 'creditcardexpmonth' || propertyName === 'creditcardexpyear') {
                    paymentCreditCard[ccProperties[propertyName]] = isNaN(params[propertyName][0]) ? 0 : parseInt(params[propertyName][0]);
                } else {
                    paymentCreditCard[ccProperties[propertyName]] = params[propertyName][0];
                }
                cartChanged = true;
            }
        }
    }


    // --- checkout ---------------------------------------------------------------
    var checkout = uc.cart.checkout;
    if (!checkout) {
        checkout = uc.cart.checkout = new uc.sdk.CartCheckout();
    }
    for (propertyName in checkoutProperties) {
        if (checkoutProperties.hasOwnProperty(propertyName)) {
            if (params.hasOwnProperty(propertyName)) {
                checkout[checkoutProperties[propertyName]] = params[propertyName][0];
                cartChanged = true;
            }
        }
    }


    // --- marketing ---------------------------------------------------------------
    var marketing = uc.cart.marketing;
    if (!marketing) {
        marketing = uc.cart.marketing = new uc.sdk.CartMarketing();
    }
    for (propertyName in marketingProperties) {
        if (marketingProperties.hasOwnProperty(propertyName)) {
            if (params.hasOwnProperty(propertyName)) {
                marketing[marketingProperties[propertyName]] = params[propertyName][0];
                cartChanged = true;
            }
        }
    }


    var copyS_to_B = false;
    var copyB_to_S = false;

    if (params.hasOwnProperty('billingsameasshipping') && isYesValue(params.billingsameasshipping)) {
        copyS_to_B = true;
    }

    if (params.hasOwnProperty('defaultbillingsameasshipping') && isYesValue(params.billingdifferent)) {
        copyS_to_B = true;
    }

    if (params.hasOwnProperty('defaultshippingsameasbilling') && isYesValue(params.shippingdifferent)) {
        copyB_to_S = true;
    }

    if (copyS_to_B) {
        billing.last_name = shipping.last_name;
        billing.first_name = shipping.first_name;
        billing.company = shipping.company;
        billing.address1 = shipping.address1;
        billing.address2 = shipping.address2;
        billing.city = shipping.city;
        billing.state_region = shipping.state_region;
        billing.country_code = shipping.country_code;
        cartChanged = true;
    }
    if (copyB_to_S) {
        shipping.last_name = billing.last_name;
        shipping.first_name = billing.first_name;
        shipping.company = billing.company;
        shipping.address1 = billing.address1;
        shipping.address2 = billing.address2;
        shipping.city = billing.city;
        shipping.state_region = billing.state_region;
        shipping.country_code = billing.country_code;
        cartChanged = true;
    }


    // need to populate both email and confirm, so can't treat email as simple property.
    if (params.hasOwnProperty("email")) {
        billing.email = params.email[0];
        billing.email_confirm = params.email[0];
        cartChanged = true;
    }

    if (params.hasOwnProperty("shippingresidentialaddress")) {
        shipping.ship_to_residential = isYesValue(params.shippingresidentialaddress[0]);
        cartChanged = true;
    }


    var itemsChanged = false;
    var items = uc.cart.items;
    if (!items) {
        items = uc.cart.items = [];
    }
    if (params.hasOwnProperty("clearcart")) {
        itemsChanged = true;
        items = [];
    }

    if (params.hasOwnProperty(('add'))) {
        itemsChanged = true;
        var qty = 1;
        if (params.quantity) {
            qty = parseInt(params.quantity[0]);
        }
        if (isNaN(qty)) {
            qty = 1;
        }
        var item = new uc.sdk.CartItem();
        item.item_id = params.add[0];
        item.quantity = qty;

        // check for options
        for (var i = 1; i <= 10; i++) {
            if (params.hasOwnProperty('optionname' + i) && params.hasOwnProperty('optionvalue' + i)) {
                // we have items, make sure options property is initialized.
                if (!item.hasOwnProperty('options')) {
                    item.options = [];
                }
                var itemOption = new uc.sdk.CartItemOption();
                itemOption.name = params['optionname' + i][0];
                itemOption.selected_value = params['optionvalue' + i][0];
                item.options.push(itemOption);
            }
        }

        items.push(item);
    }

    // check for multiple items.  Look for "add_" parameters.
    for (var parameterName in params) {
        if (params.hasOwnProperty(parameterName) && parameterName.indexOf('add_') === 0) {
            var quantity = parseInt(params[parameterName][0]);
            var itemId = parameterName.substring('add_'.length);
            itemsChanged = true;
            var itm = new uc.sdk.CartItem();
            itm.item_id = itemId;
            itm.quantity = quantity;
            items.push(itm);
        }
    }

    if (itemsChanged) {
        uc.cart.items = items;
        cartChanged = true;
    }

    var couponsChanged = false;
    var coupons = uc.cart.coupons;
    if (!coupons) {
        coupons = uc.cart.coupons = [];
    }
    if (params.hasOwnProperty('coupon')) {
        var couponCodes = params.coupon;
        for (var k = 0; k < couponCodes.length; k++) {
            couponsChanged = true;
            var coupon = new uc.sdk.CartCoupon();
            coupon.coupon_code = couponCodes[k];
            coupons.push(coupon);
        }
    }

    if (couponsChanged) {
        uc.cart.coupons = coupons;
        cartChanged = true;
    }


    if (cartChanged) {
        uc.saveCart();
    }

    if (params.hasOwnProperty('overridecatalogurl')) {
        window.uc.continueShoppingUrl = params.overridecatalogurl;
    }
    if (params.hasOwnProperty('overridecontinueshoppingurl')) {
        window.uc.continueShoppingUrl = params.overridecontinueshoppingurl;
    }

    console.log("processQueryParameters() finish");

}


function shippingMethodsChanged() {

    // need both estimates and settings to move forward.  should always have settings by the time this is called.
    if (!uc.shippingEstimates || !uc.settings) {
        return; // there's nothing that can be done without shipping estimates.
    }

    var needShipping = uc.settings.shipping.need_shipping;

    var shipping = uc.cart.shipping;
    if (!shipping) {
        shipping = uc.cart.shipping = new uc.sdk.CartShipping();
    }
    var summary = uc.cart.summary;
    if (!summary) {
        summary = uc.cart.summary = new uc.sdk.CartSummary();
    }

    if (uc.shippingEstimates.length && needShipping) {

        // if any shipping methods were received, then synchronize with the cart.
        // Rules:
        // 1. if the cart.shippingMethod matches one of the estimates, update the shipping_handling to keep costs in sync
        // 2. if the cart.shippingMethod doesn't match an estimate, wipe it out and select the first estimate. (and apply rule #3)
        // 3. if the cart.shippingMethod is not set, set it to the first estimate (always the cheapest).
        var selectedMethod = shipping.shipping_method || '';
        if (selectedMethod) {

            // make sure the costs match.  If there is a change in item count, etc, the costs could change.
            var selectedEstimate = _find(uc.shippingEstimates, function (estimate) {
                return estimate.name === selectedMethod;
            });
            if (selectedEstimate) {
                summary.shipping_handling = cloneCurrency(selectedEstimate.cost_before_discount);
                summary.shipping_handling_discount = cloneCurrency(selectedEstimate.discount);
                summary.shipping_handling_with_discount = cloneCurrency(selectedEstimate.cost);
            } else {
                summary.shipping_handling = new uc.sdk.Currency();
                summary.shipping_handling_discount = new uc.sdk.Currency();
                summary.shipping_handling_with_discount = new uc.sdk.Currency();
                shipping.shipping_method = null;
                selectedMethod = null;
            }
        }

        // this is not an if-else connected to the above logic because selectedMethod may change within the if statement,
        // so this is evaluated separately.
        if (!selectedMethod) {
            shipping.shipping_method = uc.shippingEstimates[0].name;
            summary.shipping_handling = cloneCurrency(uc.shippingEstimates[0].cost_before_discount);
            summary.shipping_handling_discount = cloneCurrency(uc.shippingEstimates[0].discount);
            summary.shipping_handling_with_discount = cloneCurrency(uc.shippingEstimates[0].cost);
        }


        recalculateTotal();
    }

    renderSummary();
    renderShipping();
}


/**
 * this method allows a shipping change to be reflected in the total without a server round trip.  It's difficult
 * because it requires adding Currency objects.
 * The formula for the total is subtotal_with_discount + shipping_handle_with_discount + tax + surcharge
 */
function recalculateTotal() {
    if (!uc || !uc.cart || !uc.cart.summary) {
        return;
    }

    var summary = uc.cart.summary;

    // check for nulls first
    if (!summary.subtotal_with_discount) summary.subtotal_with_discount = new uc.sdk.Currency();
    if (!summary.shipping_handling_with_discount) summary.shipping_handling_with_discount = new uc.sdk.Currency();
    if (!summary.surcharge) summary.surcharge = new uc.sdk.Currency();
    if (!summary.tax) summary.tax = new uc.sdk.Currency();
    if (!summary.total) summary.total = new uc.sdk.Currency();

    summary.total.value = summary.subtotal_with_discount.value
        + summary.shipping_handling_with_discount.value
        + summary.surcharge.value
        + summary.tax.value;

    summary.total.localized = summary.subtotal_with_discount.localized
        + summary.shipping_handling_with_discount.localized
        + summary.surcharge.localized
        + summary.tax.localized;

    summary.total.localized_formatted = formatMoney(summary.total.localized, uc.cart.currency_code || 'USD');
}


/**
 * look at the cart shipping and determine if new shipping estimates are needed.  There are numerous conditions for
 * refreshing shipping estimates: location changes, item changes, coupon changes
 * @param force if true, do not compare location changes.  force will be true if items or coupons change.
 */
function getShippingEstimatesIfNeeded(force) {

    console.log("getShippingEstimatesIfNeeded(" + force + ")");
    if (!uc || !uc.cart || !uc.cart.shipping) {
        return;
    }


    var shipping = uc.cart.shipping || new uc.sdk.CartShipping();
    if (!force) {
        if (
            shipping.address1 === uc.shippingEstimateLastLocation.address1
            && shipping.address2 === uc.shippingEstimateLastLocation.address2
            && shipping.city === uc.shippingEstimateLastLocation.city
            && shipping.state_region === uc.shippingEstimateLastLocation.state_region
            && shipping.country_code === uc.shippingEstimateLastLocation.country_code
            && shipping.postal_code === uc.shippingEstimateLastLocation.postal_code
            && shipping.address1 === uc.shippingEstimateLastLocation.address1
        ) {
            console.log('shipping address has not changed.  skipping fetching shipping estimates');
            return;
        }
    }

    if (
        shipping.postal_code ||
        (shipping.city && shipping.state_region && shipping.country_code)
    ) {
        console.log('minimum fields are present, proceeding to get shipping estimatese');
    } else {

        document.getElementById('no-shipping-methods').innerHTML
            = "Please enter your shipping address to see shipping costs.";
        return;
    }


    if (uc.cart && uc.cart.shipping) {
        uc.shippingEstimateLastLocation = {
            address1: uc.cart.shipping.address1,
            address2: uc.cart.shipping.address2,
            city: uc.cart.shipping.city,
            state_region: uc.cart.shipping.state_region,
            country_code: uc.cart.shipping.country_code,
            postal_code: uc.cart.shipping.postal_code
        };
    }


    if (!uc.alreadyGettingEstimates) {

        document.getElementById('no-shipping-methods').innerHTML
            = "Searching for shipping options and costs...";

        uc.alreadyGettingEstimates = true;
        uc.getShippingEstimates(function () {
            shippingMethodsChanged();
        });
    }

}


// function setCurrency(parent, fieldName, localized) {
//     if (!parent[fieldName]) {
//         parent[fieldName] = new uc.sdk.Currency();
//     }
//     parent[fieldName].localized = localized;
// }

function addCurrency(parent, fieldName, currency) {
    if (!parent[fieldName]) {
        parent[fieldName] = new uc.sdk.Currency();
    }
    parent[fieldName].localized += currency.localized;
    parent[fieldName].value += currency.value;
}

function cloneCurrency(currency) {
    var clone = new uc.sdk.Currency();
    if (currency) {
        clone.value = currency.value;
        clone.localized = currency.localized;
        clone.localized_formatted = currency.localized_formatted;
    }
    return clone;
}


function useShippingAddress(oid) {

    if (!uc.cart || !uc.cart.customerProfile) {
        return; // nothing can be done without a cart and customer profile.
    }

    var shippingAddresses = uc.cart.customer_profile.shipping_addresses;
    if (!shippingAddresses) return;

    var address = null;
    for (var i = 0; i < shippingAddresses.length; i++) {
        if (shippingAddresses[i].oid === oid) {
            address = shippingAddresses[i];
            break;
        }
    }

    if (address !== null) {

        var shipping = uc.cart.shipping;
        if (!shipping) {
            shipping = uc.cart.shipping = new uc.sdk.CartShipping();
        }

        shipping.first_name = address.first_name;
        shipping.last_name = address.last_name;
        shipping.company = address.company;
        shipping.address1 = address.address1;
        shipping.address2 = address.address2;
        shipping.city = address.city;
        shipping.state_region = address.state_region;
        shipping.country_code = address.country_code;
        shipping.postal_code = address.postal_code;
        shipping.day_phone = address.day_phone;
        shipping.evening_phone = address.evening_phone;
        shipping.title = address.title;


        var checkbox = document.getElementById('shippingIsBilling');
        if (checkbox && checkbox.checked) {

            var billing = uc.cart.billing;
            if (!billing) {
                billing = uc.cart.billing = new uc.sdk.CartBilling();
            }

            billing.first_name = address.first_name;
            billing.last_name = address.last_name;
            billing.company = address.company;
            billing.address1 = address.address1;
            billing.address2 = address.address2;
            billing.city = address.city;
            billing.state_region = address.state_region;
            billing.country_code = address.country_code;
            billing.postal_code = address.postal_code;
            billing.day_phone = address.day_phone;
            billing.evening_phone = address.evening_phone;
            billing.title = address.title;

        }

        renderAddresses();

    }


}


function useBillingAddress(oid) {

    if (!uc.cart || !uc.cart.customer_profile) {
        return; // nothing can be done without a cart and customer profile.
    }

    var billingAddresses = uc.cart.customer_profile.billing_addresses;
    if (!billingAddresses) return;

    var address = null;
    for (var i = 0; i < billingAddresses.length; i++) {
        if (billingAddresses[i].oid === oid) {
            address = billingAddresses[i];
            break;
        }
    }

    if (address !== null) {

        var billing = uc.cart.billing;
        if (!billing) {
            billing = uc.cart.billing = new uc.sdk.CartBilling();
        }

        billing.first_name = address.first_name;
        billing.last_name = address.last_name;
        billing.company = address.company;
        billing.address1 = address.address1;
        billing.address2 = address.address2;
        billing.city = address.city;
        billing.state_region = address.state_region;
        billing.country_code = address.country_code;
        billing.postal_code = address.postal_code;
        billing.day_phone = address.day_phone;
        billing.evening_phone = address.evening_phone;
        billing.title = address.title;

        renderAddresses();
    }

}

/**
 * returns back the proper expansion to use.
 * Here are the rules:
 * 1) first time the cart is called, get all the settings EXCEPT for shipping estimates.  This will include the
 * shipping and billing countries.  That is usually a large block of static json. So we wish to grab it once and then
 * store it somewhere for re-use.  We will grab all the settings (minus shipping estimates) and store them locally
 * 2) if the shipping fields are filled in, and/or when they change, use an expansion to get the shipping estimates.
 * Shipping estimates are slow to gather so we only wish to do that when needed.
 * 3) for normal cart routines, grab most fields except settings.
 * @returns {*}
 */
function getOpts(shippingEstimates) {
    var exp = uc.expansion;
    if (shippingEstimates) {
        exp = uc.expansionForShippingEstimates;
    } else if (!uc.initialLoadDone) {
        exp = uc.initialExpansion;
    }
    return {'expand': exp};
}


// ===================================================================================
// Cart Functions - Note again, this isn't the optimal way of implementing a javascript
// checkout.  But this is a pure vanilla implementation.
// ===================================================================================

window.uc.saveCart = function (silent) {
    clearCheckoutErrors();
    console.log("saveCart()");
    // write cart id to cookie
    // call update cart

    var callback = function (error, data, response) {
        if (!silent) {
            stopPleaseWait();
        }
        console.log("updateCart() callback", "error", error, "data", data, "response", response);

        if (error) {
            if (!silent) {
                if (response && response.text) {
                    displayServerErrors(response.text);
                } else {
                    console.error(error);
                }
            }
        } else {
            if (data.errors) {
                displayCheckoutErrors(data.errors);
            }
            window.uc.cart = data.cart;
            if (uc.cart.cart_id) {
                console.log("updating cookie for cart id", uc.cart.cart_id);
                createCookie(uc.cookieName, uc.cart.cart_id, 14);
            }
            if (!silent) {
                uc.renderCart();
            }
        }

    };

    if (!silent) {
        startPleaseWait();
    }
    uc.checkoutApi.updateCart(uc.cart, getOpts(), callback);
};


window.uc.getShippingEstimates = function (successCallback) {
    console.log("getShippingEstimates ()");
    var finalButton = document.getElementById('btnFinalize');

    var callback = function (error, data, response) {
        finalButton.disabled = false;
        finalButton.innerHTML = "Finalize Order";

        uc.alreadyGettingEstimates = false;
        console.log("getShippingEstimates() callback", "error", error, "data", data, "response", response);

        if (error) {
            // shipping estimates are done quietly.  only log errors to console.
            console.error(error);
        } else {
            if (data.cart && data.cart.settings && data.cart.settings.shipping && data.cart.settings.shipping.estimates) {
                // notice that we're storing shipping estimates directly beneath the namespace level.
                uc.shippingEstimates = data.cart.settings.shipping.estimates;
            }
            if (successCallback) {
                successCallback();
            }
        }
    };

    // without cart, there's nothing to be done.
    if (uc.cart) {

        finalButton.disabled = true;
        finalButton.innerHTML = "Please wait...";
        uc.checkoutApi.updateCart(uc.cart, getOpts('shipping'), callback);
    }
};


window.uc.loadCart = function (successCallback) {
    console.log("loadCart()");

    var callback = function (error, data, response) {
        endBlockUserInput();
        stopPleaseWait();
        console.log("getCart() callback", "error", error, "data", data, "response", response);

        if (error) {
            if (response && response.text) {
                displayServerErrors(response.text);
            } else {
                console.error(error);
            }
        } else {
            uc.cart = data.cart;
            if (uc.cart.cart_id) {
                console.log("creating cookie for cart id", uc.cart.cart_id);
                createCookie(uc.cookieName, uc.cart.cart_id, 14);
            }

            if (uc.cart.settings) {
                uc.settings = uc.cart.settings;
            }

            // see if there are provinces to collect.
            if (uc.cart && uc.cart.settings && uc.cart.settings.shipping && uc.cart.settings.shipping.provinces) {
                uc.allowedStates["US"] = uc.settings.shipping.provinces;
            } else if(uc.cart && uc.cart.settings && uc.cart.settings.billing && uc.cart.settings.billing.provinces){
                uc.allowedStates["US"] = uc.settings.billing.provinces;
            }

            if (successCallback) {
                successCallback();
            }
        }

        uc.initialLoadDone = true;
        uc.renderCart();
    };

    blockUserInput();
    startPleaseWait();
    var cart_id = readCookie(uc.cookieName);
    if (cart_id) {
        console.log("found existing cart id, using", cart_id);
        uc.checkoutApi.getCartByCartId(cart_id, getOpts(), callback);
    } else {
        uc.checkoutApi.getCart(getOpts(), callback);
    }

};


window.uc.validateCart = function () {
    console.log("validateCart()");

    var callback = function (error, data, response) {
        stopPleaseWait();
        endBlockUserInput();
        console.log("validateCart() callback", "error", error, "data", data, "response", response);

        if (error) {
            if (response && response.text) {
                displayServerErrors(response.text);
            } else {
                console.error(error);
            }
        } else {

            var validationResponse = data;
            if (validationResponse.errors) {
                displayCheckoutErrors(validationResponse.errors);
            }

            if (validationResponse.cart) {
                window.uc.cart = validationResponse.cart;
            }
        }

        uc.renderCart();
    };

    var validationRequest = new uc.sdk.CartValidationRequest();
    validationRequest.cart = uc.cart;
    validationRequest.checks = ["All"];

    clearCheckoutErrors();
    blockUserInput();
    startPleaseWait();
    uc.checkoutApi.validateCart(validationRequest, getOpts(), callback);

};


/**
 * gathers the email and password from the register fields at the top of the screen and attempts to create a customer
 * profile for the customer.  The customer profile is a permanent account that will allow them to access a portal
 * to review order history, save credit cards, etc.
 */
window.uc.register = function () {

    var email = document.getElementById('registerEmail').value.trim();
    var password = document.getElementById('registerPassword').value.trim();

    if (!email || !password) {
        window.alert('Please enter your email and password.');
        return;
    }

    var billing = uc.cart.billing || new uc.sdk.CartBilling();
    billing.email = email;
    uc.cart.billing = billing; // needed if new object

    var registerRequest = new uc.sdk.CartProfileRegisterRequest();
    registerRequest.cart = uc.cart;
    registerRequest.password = password;

    var callback = function (error, data, response) {
        stopPleaseWait();
        endBlockUserInput();

        if (error) {
            if (response && response.text) {
                displayServerErrors(response.text);
            } else {
                console.error(error);
            }
        } else {
            if (data.errors) {
                displayCheckoutErrors(data.errors);
            }
            window.uc.cart = data.cart;
            if (uc.cart.cart_id) {
                console.log("updating cookie for cart id", uc.cart.cart_id);
                createCookie(uc.cookieName, uc.cart.cart_id, 14);
            }
            uc.renderCart();
        }
    };

    clearCheckoutErrors();
    blockUserInput();
    startPleaseWait();
    uc.checkoutApi.register(registerRequest, getOpts(), callback);

};


/**
 * gathers the email and password from the login fields at the top of the screen and attempts to create a customer
 * profile for the customer.  The customer profile is a permanent account that will allow them to access a portal
 * to review order history, save credit cards, etc.
 */
window.uc.login = function () {

    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        window.alert('Please enter your email and password.');
        return;
    }

    var billing = uc.cart.billing || new uc.sdk.CartBilling();
    billing.email = email;
    uc.cart.billing = billing; // needed if new object

    var loginRequest = new uc.sdk.CartProfileLoginRequest();
    loginRequest.cart = uc.cart;
    loginRequest.password = password;

    var callback = function (error, data, response) {
        stopPleaseWait();
        endBlockUserInput();

        if (error) {
            if (response && response.text) {
                displayServerErrors(response.text);
            } else {
                console.error(error);
            }
        } else {
            if (data.errors) {
                displayCheckoutErrors(data.errors);
            }
            window.uc.cart = data.cart;
            if (uc.cart.cart_id) {
                console.log("updating cookie for cart id", uc.cart.cart_id);
                createCookie(uc.cookieName, uc.cart.cart_id, 14);
            }
            uc.renderCart();
        }
    };

    clearCheckoutErrors();
    blockUserInput();
    startPleaseWait();
    uc.checkoutApi.login(loginRequest, getOpts(), callback);

};


/**
 * logs a customer out of the system.  They may still complete the order, but it will be completed as a guest.
 */
window.uc.logout = function () {

    var callback = function (error, data, response) {
        stopPleaseWait();
        endBlockUserInput();

        if (error) {
            if (response && response.text) {
                displayServerErrors(response.text);
            } else {
                console.error(error);
            }
        } else {
            if (data.errors) {
                displayCheckoutErrors(data.errors);
            }
            window.uc.cart = data.cart;
            if (uc.cart.cart_id) {
                console.log("updating cookie for cart id", uc.cart.cart_id);
                createCookie(uc.cookieName, uc.cart.cart_id, 14);
            }
            uc.renderCart();
        }
    };

    clearCheckoutErrors();
    blockUserInput();
    startPleaseWait();
    uc.checkoutApi.logout(uc.cart, getOpts(), callback);

};


window.uc.checkout = function (operation) {

    uc.collectFormData();

    if (!uc.processingOrder) {
        uc.processingOrder = true;

        if (!uc.cart.payment) {
            uc.cart.payment = new uc.sdk.CartPayment();
        }

        if (operation === 'payPal') {
            uc.cart.payment.payment_method = "PayPal";
        } else if (operation === 'checkout') {
            uc.cart.payment.payment_method = "Credit Card";
        }


        clearCheckoutErrors();

        var button = document.getElementById('btnFinalize');
        button.innerHTML = "<" + "img src='images/loader.gif' alt='please wait' />";

        var handoffRequest = new uc.sdk.CheckoutHandoffRequest();
        handoffRequest.cart = uc.cart;
        handoffRequest.error_parameter_name = "error"; // any errors will be returned to this page as this http parameter
        handoffRequest.error_return_url = document.URL; // any errors should return to this same page.
        handoffRequest.secure_host_name = uc.storeFront; // needed to show the correct branding on the receipt and manage upsells
        handoffRequest.operation = operation;


        var callback = function (error, data, response) {
            endBlockUserInput();
            stopPleaseWait();
            button.innerHTML = "Finalize Order";
            uc.processingOrder = false;

            console.log("handoffCart() callback", "error", error, "data", data, "response", response);

            // check for http errors (communication, authorization)
            if (error) {
                if (response && response.text) {
                    displayServerErrors(response.text);
                } else {
                    console.error(error);
                }

            } else if (data && data.redirect_to_url) {
                // This is our success condition.  A redirect url means that everything validated properly
                // and the handoff has taken place.
                location.href = data.redirect_to_url;

            } else if (data.errors) {
                displayCheckoutErrors(data.errors);
            }
        };

        blockUserInput();
        startPleaseWait();
        uc.checkoutApi.handoffCart(handoffRequest, getOpts(), callback);
    }

};

window.uc.collectFormData = function () {
    console.log("collectFormData()");

    saveField('shipping', 'first_name', document.getElementById('shipToFirstName'));
    saveField('shipping', 'last_name', document.getElementById('shipToLastName'));
    saveField('shipping', 'company', document.getElementById('shipToCompany'));
    saveField('shipping', 'address1', document.getElementById('shipToAddress1'));
    saveField('shipping', 'address2', document.getElementById('shipToAddress2'));
    saveField('shipping', 'city', document.getElementById('shipToCity'));
    saveField('shipping', 'state_region', document.getElementById('shipToState'));
    saveField('shipping', 'postal_code', document.getElementById('shipToPostalCode'));
    saveField('shipping', 'country_code', document.getElementById('shipToCountry'));
    saveField('shipping', 'day_phone', document.getElementById('shipToPhone'));
    saveField('shipping', 'ship_to_residential', document.getElementById('shipToResidential'));

    if (document.getElementById('shippingIsBilling').checked) {

        saveField('billing', 'first_name', document.getElementById('shipToFirstName'));
        saveField('billing', 'last_name', document.getElementById('shipToLastName'));
        saveField('billing', 'company', document.getElementById('shipToCompany'));
        saveField('billing', 'address1', document.getElementById('shipToAddress1'));
        saveField('billing', 'address2', document.getElementById('shipToAddress2'));
        saveField('billing', 'city', document.getElementById('shipToCity'));
        saveField('billing', 'state_region', document.getElementById('shipToState'));
        saveField('billing', 'postal_code', document.getElementById('shipToPostalCode'));
        saveField('billing', 'country_code', document.getElementById('shipToCountry'));

    } else {
        saveField('billing', 'first_name', document.getElementById('billToFirstName'));
        saveField('billing', 'last_name', document.getElementById('billToLastName'));
        saveField('billing', 'company', document.getElementById('billToCompany'));
        saveField('billing', 'address1', document.getElementById('billToAddress1'));
        saveField('billing', 'address2', document.getElementById('billToAddress2'));
        saveField('billing', 'city', document.getElementById('billToCity'));
        saveField('billing', 'state_region', document.getElementById('billToState'));
        saveField('billing', 'postal_code', document.getElementById('billToPostalCode'));
        saveField('billing', 'country_code', document.getElementById('billToCountry'));
    }

    saveField('billing', 'email', document.getElementById('email'));
    saveField('billing', 'email_confirm', document.getElementById('email'));


    saveField('shipping', 'shipping_method', document.getElementById('shipping-preference'));


    saveCreditCardField('credit_card_number', document.getElementById('creditCardNumber').value.trim());
    saveCreditCardField('card_verification_number_token', document.getElementById('creditCardVerificationNumber').value.trim());
    saveCreditCardField('store_credit_card', document.getElementById('storeCreditCard').checked);

    var select = document.getElementById('creditCardExpirationMonth');
    var month = 0;
    if (select && select.selectedIndex > -1) {
        month = parseInt(select.options[select.selectedIndex].value);
    }
    if (isNaN(month)) {
        month = 0;
    }
    saveCreditCardField('card_expiration_month', month);

    select = document.getElementById('creditCardExpirationYear');
    var year = 0;
    if (select && select.selectedIndex > -1) {
        year = parseInt(select.options[select.selectedIndex].value);
    }
    if (isNaN(year)) {
        year = 0;
    }
    saveCreditCardField('card_expiration_year', year);
};


// Notice: Only the main renderCart function is visible externally.  Not even sure that needs to be.
function renderAddresses() {
    console.log("renderAddresses()");

    var billingAddresses = [];
    if (uc.cart && uc.cart.customer_profile && uc.cart.customer_profile.billing_addresses) {
        billingAddresses = uc.cart.customer_profile.billing_addresses;
    }

    var addressesElement = document.getElementById('customer-profile-billing-addresses');
    var baSelect = document.getElementById('storedBillingAddress');
    while (baSelect.options.length) {
        baSelect.remove(0);
    }
    baSelect.add(new Option("Select a stored address...", "0"));
    if (uc.cart && uc.cart.logged_in) {
        for (var i = 0; i < billingAddresses.length; i++) {
            baSelect.add(new Option(billingAddresses[i].address1 + ", " + billingAddresses[i].city + " "
                + billingAddresses[i].state_region, billingAddresses[i].oid));
        }
        show(addressesElement);
    } else {
        hide(addressesElement);
    }


    var billing = uc.cart.billing || new uc.cart.CartBilling();
    document.getElementById('billToFirstName').value = billing.first_name || '';
    document.getElementById('billToLastName').value = billing.last_name || '';
    document.getElementById('billToCompany').value = billing.company || '';
    document.getElementById('billToAddress1').value = billing.address1 || '';
    document.getElementById('billToAddress2').value = billing.address2 || '';
    document.getElementById('billToCity').value = billing.city || '';
    // document.getElementById('billToState').value = billing.state_region || '';
    document.getElementById('billToPostalCode').value = billing.postal_code || '';

    var btCountry = document.getElementById('billToCountry');
    while (btCountry.options.length) {
        btCountry.remove(0);
    }

    var country_code = billing.country_code || '';
    var option = null;
    btCountry.add(new Option("", "&nbsp;"));
    for (var z = 0; z < uc.allowedCountries.length; z++) {
        option = new Option(uc.allowedCountries[z].name, uc.allowedCountries[z].country_code);
        option.selected = uc.allowedCountries[z].country_code === country_code;
        btCountry.add(option);
    }

    populateShippingStates('billing', country_code);


    // this is done at the end of shipping and based upon the shippingIsBilling checkbox
    // show('billToAddress');


    // --------------------------------------------------------------

    var shippingAddresses = [];
    if (uc.cart && uc.cart.customer_profile && uc.cart.customer_profile.shipping_addresses) {
        shippingAddresses = uc.cart.customer_profile.shipping_addresses;
    }

    addressesElement = document.getElementById('customer-profile-shipping-addresses');
    var ssSelect = document.getElementById('storedShippingAddress');
    while (ssSelect.options.length) {
        ssSelect.remove(0);
    }
    ssSelect.add(new Option("Select a stored address...", "0"));
    if (uc.cart && uc.cart.logged_in) {
        for (var y = 0; y < shippingAddresses.length; y++) {
            ssSelect.add(new Option(shippingAddresses[y].address1 + ", " + shippingAddresses[y].city + " "
                + shippingAddresses[y].state_region, shippingAddresses[y].oid));
        }
        show(addressesElement);
    } else {
        hide(addressesElement);
    }


    var shipping = uc.cart.shipping || new uc.cart.CartShipping();
    document.getElementById('shipToFirstName').value = shipping.first_name || '';
    document.getElementById('shipToLastName').value = shipping.last_name || '';
    document.getElementById('shipToCompany').value = shipping.company || '';
    document.getElementById('shipToAddress1').value = shipping.address1 || '';
    document.getElementById('shipToAddress2').value = shipping.address2 || '';
    document.getElementById('shipToCity').value = shipping.city || '';
    // document.getElementById('shipToState').value = shipping.state_region || '';
    document.getElementById('shipToPostalCode').value = shipping.postal_code || '';

    var stCountry = document.getElementById('shipToCountry');
    while (stCountry.options.length) {
        stCountry.remove(0);
    }

    country_code = shipping.country_code || '';
    stCountry.add(new Option("", "&nbsp;"));
    for (var r = 0; r < uc.allowedCountries.length; r++) {
        option = new Option(uc.allowedCountries[r].name, uc.allowedCountries[r].country_code);
        option.selected = uc.allowedCountries[r].country_code === country_code;
        stCountry.add(option);
    }

    populateShippingStates('shipping', country_code);

    document.getElementById('email').value = billing.email || '';
    document.getElementById('shipToPhone').value = shipping.day_phone || '';
    document.getElementById('shipToResidential').checked = shipping.ship_to_residential || false;

    var s_is_b = document.getElementById('shippingIsBilling');
    s_is_b.checked = (
        shipping.first_name === billing.first_name &&
        shipping.last_name === billing.last_name &&
        shipping.company === billing.company &&
        shipping.country === billing.country &&
        shipping.city === billing.city &&
        shipping.state === billing.state &&
        shipping.postal_code === billing.postal_code &&
        shipping.address1 === billing.address1 &&
        shipping.address2 === billing.address2
    );

    show('shipToAddress');

    if (s_is_b.checked) {
        hide('billToAddress');
    } else {
        show('billToAddress');
    }

}


function populateShippingStates(addressType, country_code) {

    var id = addressType === 'billing' ? 'billToState' : 'shipToState';
    var addressObject = addressType === 'billing' ? uc.cart.billing : uc.cart.shipping;
    var state_region = addressObject.state_region || '';

    var stState = document.getElementById(id);
    while (stState.options.length) {
        stState.remove(0);
    }

    var states = [];
    if (uc.allowedStates.hasOwnProperty(country_code)) {
        states = uc.allowedStates[country_code];
    }
    var option;
    for (var q = 0; q < states.length; q++) {
        option = new Option(states[q].province, states[q].code);
        option.selected = states[q].code === state_region;
        stState.add(option);
    }

}


function renderCoupons() {
    console.log("renderCoupons()");

    var couponsContainer = document.getElementById('coupons');


    removeEventByClassName('js-remove-coupon', 'click', removeCoupon);

    // clear out old coupons.
    var partsOfCoupons = couponsContainer.getElementsByClassName('part-of-coupon');
    for (var i = 0; i < partsOfCoupons.length; i++) {
        partsOfCoupons[i].parentNode.removeChild(partsOfCoupons[i]);
    }


    // add new coupons
    if (uc.cart && uc.cart.coupons && uc.cart.coupons.length) {

        var coupons = uc.cart.coupons;
        for (var k = 0; k < coupons.length; k++) {
            var div = document.createElement("div");
            div.setAttribute('class', "part-of-coupon couponRemove one column omega");
            div.innerHTML = "<button type='button' class='btnRemove js-remove-coupon' data-coupon-pos='" + k
                + "' id='couponRemove_" + k + "'>x</button>";

            var label = document.createElement("label");
            label.setAttribute('class', "part-of-coupon name four columns alpha");
            label.innerHTML = "<span class='bold'>" + coupons[k].coupon_code + "</span>";

            var br = document.createElement("br");
            br.setAttribute('class', "part-of-coupon clear");

            couponsContainer.appendChild(div);
            couponsContainer.appendChild(label);
            couponsContainer.appendChild(br);
        }
    }

    addEventByClassName('js-remove-coupon', 'click', removeCoupon);

}

function renderGiftCertificates() {
    console.log("renderGiftCertificates()");

    // use a blank one unless there's one in the cart.  saves checking for nulls along the long path to the gift certificate
    var gc = new uc.sdk.CartGiftCertificate();
    if (uc.cart && uc.cart.gift_certificate && uc.cart.gift_certificate) {
        gc = uc.cart.gift_certificate
    }

    document.getElementById('updateGiftCertificateButton').innerHTML = gc.gift_certificate_code ? "Remove" : "Apply";
    if (gc.gift_certificate_amount && gc.gift_certificate_amount.value > 0) {
        document.getElementById('gc-amount').innerHTML = gc.gift_certificate_amount.localized_formatted;
        show('has-gc');
    } else {
        document.getElementById('gc-amount').innerHTML = '';
        hide('has-gc');
    }

    if (gc.gift_certificate_remaining_balance_after_order && gc.gift_certificate_remaining_balance_after_order.value > 0) {
        show('has-gc-balance');
        document.getElementById('gc-remaining').innerHTML
            = gc.gift_certificate_remaining_balance_after_order.localized_formatted;
    } else {
        hide('has-gc-balance');
        document.getElementById('gc-remaining').innerHTML = '';
    }
}

function renderItems() {
    console.log("renderItems()");

    var hasItems = uc.cart && uc.cart.items && uc.cart.items.length;

    if (hasItems) {
        hide('loading-cart');
        hide('empty-cart');
        show('items-header');
        show('items-footer');

        // remove any event handlers on existing dynamic content
        removeEventByClassName('js-item-remove', 'click', removeItem);
        removeEventByClassName('js-item-schedule', 'change', itemScheduleChange);
        removeEventByClassName('js-item-quantity', 'change', updateItemQty);
        removeEventByClassName('js-option', 'change', itemOptionChange);

        var itemsContainer = document.getElementById("cart-items");
        var html = '';
        for (var i = 0; i < uc.cart.items.length; i++) {
            // race conditions can result in a render processing a new item added from the query parameters.
            // avoid rendering any items without an oid.  Those are still unprocessed by the server and may be invalid.
            if (uc.cart.items[i].item_oid) {
                html += createCartItemHtml(i, uc.cart.items[i]);
            } else {
                console.log(uc.cart.items[i].item_id, " appears to be a new item, skipping rendering for now.");
            }

        }
        itemsContainer.innerHTML = html;

        // remove any event handlers on existing dynamic content
        addEventByClassName('js-item-remove', 'click', removeItem);
        addEventByClassName('js-item-schedule', 'change', itemScheduleChange);
        addEventByClassName('js-item-quantity', 'change', updateItemQty);
        addEventByClassName('js-option', 'change', itemOptionChange);


    } else {
        if (window.uc.initialLoadDone) {
            hide('loading-cart');
            show('empty-cart');
            hide('items-header');
            hide('items-footer');
        } else {
            show('loading-cart');
            hide('empty-cart');
            hide('items-header');
            hide('items-footer');
        }
    }
}

function createCartItemHtml(position, item) {
    if (!item) {
        return "";
    }

    var html =
        '<div class="cart-item-row">' +
        '   <div class="itemRemove one column omega"><button type="button" data-pos="' +
        position + '" class="btnRemove js-item-remove">x</button></div>' +
        '   <div class="itemInfo nine columns alpha">' +
        (item.default_thumbnail_url ? '<img src="' + item.default_thumbnail_url + '" class="thumb" alt="thumb"/>' : "") +
        '  <span class="itemName">' + esc(item.item_id) + '</span><br>' +
        '  <div class="itemAmount">' + item.unit_cost.localized_formatted + '</div>' +
        '  <br>' +
        '  <div class="itemDescription"><p>' + esc(item.description) + '</p></div>';


    if (item.options) {
        for (var i = 0; i < item.options.length; i++) {
            html += createCartItemOptionHtml(position, i, item.options[i]);
        }
    }

    if (item.schedules && item.schedules.length) {
        html += '  <br class="clear">'
            + '  <div class="itemOption">'
            + '    <span>Schedule</span><select class="selectSchedule js-item-schedule" data-pos="' + position + '">';

        for (var k = 0; k < item.schedules.length; k++) {
            html += '<option '
                + (item.schedules[k] === item.auto_order_schedule ? 'selected' : '')
                + '>' + esc(item.schedules[k]) + '</option>';
        }
        html += '</select></div>';
    }

    html += '</div><div class="itemQuantity two columns omega">'
        + '<input type="number" class="itemQty js-item-quantity" name="items[' + item.position + '].quantity" value="'
        + item.quantity + '" data-pos="' + position + '" maxlength="5"/></div><br class="clear"></div>';


    return html;
}

/**
 * takes a CartItemOption and generates html for representing it in a cart page.
 * @param itemPosition the position of the item within the cart items array.
 * @param optionPosition the position of the option within the item options array.
 * @param option @see https://github.com/UltraCart/rest_api_v2_sdk_javascript/blob/master/docs/CartItemOption.md
 * @returns {string} html for rendering in cart
 */
function createCartItemOptionHtml(itemPosition, optionPosition, option) {
    if (!option) {
        return "";
    }

    var html =
        '<br class="clear">' +
        '<div class="itemOption">' +
        '    <span>' + esc(option.label) + '</span>';

    if (option.type === 'single') {
        html += '<input type="text" size="20" data-pos="' + itemPosition + '" value="'
            + esc(option.selected_value)
            + '" class="singleQualifier js-option" data-option-pos="' + optionPosition + '"/>';
    }

    if (option.type === 'fixed') {
        html += '<input type="text" size="20" data-pos="' + itemPosition + '" value="'
            + esc(option.selected_value)
            + '" class="fixedQualifier js-option" data-option-pos="' + optionPosition + '"/>';
    }

    if (option.type === 'multiline') {
        html += '<textarea rows="3" cols="45" data-pos="' + itemPosition + '" class="multiQualifier js-option" data-option-pos="'
            + optionPosition + '">' + esc(option.selected_value) + '< /textarea>';
    }

    if (option.type === 'dropdown') {
        html += '<select class="selectQualifier js-option" data-pos="' + itemPosition + '" data-option-pos="' + optionPosition + '">';
        if (option.values) {
            for (var i = 0; i < option.values.length; i++) {
                var val_1 = esc(option.values[i].value);
                html += '<option value="' + val_1 + '"'
                    + (option.values[i].value === option.selected_value ? " selected" : "") + '>'
                    + val_1 + '</option>';
            }
        }
        html += '</select>';
    }

    if (option.type === 'radio') {
        html += '<span class="radioQualifierContainer">';
        if (option.values) {
          for (var i = 0; i < option.values.length; i++) {
            var val_2 = esc(option.values[i].value);
            html += '<input type="radio" class="radioQualifier js-option" data-pos="' + itemPosition
                + '" data-option-pos="' + optionPosition + '"  value="' + val_2
                + '" name="radioQualifier_' + option.option_oid + '"'
                + (option.values[i].value === option.selected_value ? ' checked="checked"' : '') + '/>' + val_2 + '<br/>';
          }
        }
        html += '</span>';
    }

    if (option.type === 'hidden') {
        html += '<em>unsupported option type</em><input type="hidden" value="'
            + esc(option.selected_value)
            + '" class="hiddenQualifier" id="hiddenQualifier_' + option.option_oid + '"/>';
    }

    if (option.type === 'file attachment') {
        html += "<em>unsupported option type</em>";
    }

    html += ' </div>';

    return html;
}

function renderSubtotal() {
    console.log("renderSubtotal()");

    var subtotal = '';
    if (uc.cart && uc.cart.summary && uc.cart.summary.subtotal) {
        subtotal = uc.cart.summary.subtotal.localized_formatted;
    }
    document.getElementById('cartSubtotal').innerHTML = subtotal;

    showIfCartHasItems('subtotal'); // subtotal is outside of cart fields block so must handle its own visibility
}

function renderSummary() {
    console.log("renderSummary()");

    var summary = new uc.sdk.CartSummary();
    if (uc.cart && uc.cart.summary) {
        summary = uc.cart.summary;
    }

    document.getElementById('summary-subtotal').innerHTML = summary.subtotal_with_discount.localized_formatted;
    document.getElementById('summary-tax').innerHTML = summary.tax.localized_formatted;
    document.getElementById('summary-shipping').innerHTML = summary.shipping_handling_with_discount.localized_formatted;
    document.getElementById('summary-total').innerHTML = summary.total.localized_formatted;

}

function renderPayment() {
    console.log("renderPayment()");

    var payment = new uc.sdk.CartPaymentCreditCard();
    if (uc.cart && uc.cart.payment && uc.cart.payment.credit_card) {
        payment = uc.cart.payment.credit_card;
    }

    // --- Stored Credit Cards ---
    // --- This is a lot of logic for one drop down box...
    var storedCards = [];
    if (uc.cart && uc.cart.customer_profile && uc.cart.customer_profile.credit_cards) {
        storedCards = uc.cart.customer_profile.credit_cards;
    }

    if (storedCards && storedCards.length && uc.cart && uc.cart.logged_in) {
        show('stored-cards-container');
    } else {
        hide('stored-cards-container');
    }

    var currentTime = new Date();
    var currentYear = currentTime.getFullYear();
    var currentMonth = currentTime.getMonth() + 1;
    var selectedStoredCard = payment.customer_profile_credit_card_id || 0;
    var storedSelect = document.getElementById('customerProfileCreditCardId');
    // clear out the options
    while (storedSelect.options.length) {
        storedSelect.remove(0);
    }
    // add the options
    storedSelect.add(new Option("", "0"));
    for (var i = 0; i < storedCards.length; i++) {

        // inform the customer if any cards are expired.
        var status = '';
        if (storedCards[i].card_expiration_year < currentYear
            || (storedCards[i].card_expiration_year === currentYear && storedCards[i].card_expiration_month < currentMonth)) {
            status = '[expired]';
        }

        var text = storedCards[i].card_type + " " + storedCards[i].card_number + " " + status;
        var option = new Option(text, storedCards[i].customer_profile_credit_card_id);
        if (storedCards[i].customer_profile_credit_card_id === selectedStoredCard) {
            option.selected = true;
        }
        storedCards.add(option);
    }

    document.getElementById('storeCreditCard').checked = payment.store_credit_card;
    if (uc.cart && uc.cart.logged_in) {
        show('store-credit-card-container');
        show('stored-cards-trailer');
    } else {
        hide('store-credit-card-container');
        hide('stored-cards-trailer');
    }

    document.getElementById('creditCardNumber').value = payment.card_number || '';
    document.getElementById('creditCardVerificationNumber').value = payment.card_verification_number || '';
    var months = document.getElementById('creditCardExpirationMonth').options;
    for (var k = 0; k < months.length; k++) {
        months[k].selected = parseInt(months[k].value) === payment.card_expiration_month;
    }
    var years = document.getElementById('creditCardExpirationYear').options;
    for (var m = 0; m < years.length; m++) {
        years[m].selected = parseInt(years[m].value) === payment.card_expiration_year;
    }
}

function renderPayPal() {
    console.log("renderPayPal()");

    var paymentSettings = new uc.sdk.CartSettingsPayment();
    if (uc.settings && uc.settings.payment) {
        paymentSettings = uc.settings.payment;
    }

    if (!paymentSettings.supports_paypal) {
        hide('paypal');
        return;
    }

    if (paymentSettings.paypal) {
        var img = document.getElementById('paypal-button');
        img.src = paymentSettings.paypal.paypal_button_url;
        img.alt = paymentSettings.paypal.paypal_button_alt_text;
    }

}


function renderShipping() {
    console.log("renderShipping()");

    if (uc.shippingEstimates && uc.shippingEstimates.length) {

        var select = document.getElementById('shipping-preference');
        while (select.options.length) {
            select.remove(0);
        }

        var shipping = uc.cart.shipping;
        if (!shipping) {
            shipping = uc.cart.shipping = new uc.sdk.CartShipping();
        }
        var selectedMethod = shipping.shipping_method || '';

        var estimates = uc.shippingEstimates;
        for (var i = 0; i < estimates.length; i++) {
            var option = new Option(estimates[i].cost.localized_formatted + " - " + estimates[i].display_name, estimates[i].name);
            if (estimates[i].name === selectedMethod) {
                option.selected = true;
            }
            select.add(option);
        }

        hide('no-shipping-methods');
        show('shipping-methods-container');

    } else {

        hide('shipping-methods-container');
        show('no-shipping-methods');
    }

}

function renderCredentials() {

    var showLogin = false;
    var showRegister = false;
    var showButtons = true;
    var showLogout = false;


    if (uc.cart && uc.cart.logged_in) {
        showButtons = false;
        showRegister = false;
        showLogin = false;
        showLogout = true;
    } else {
        showLogin = uc.inLogin;
        showRegister = uc.inRegister;
        showButtons = !(uc.inLogin || uc.inRegister);
    }

    if (showButtons) {
        show('credential-buttons');
    } else {
        hide('credential-buttons');
    }

    if (showLogout) {
        show('logout-container');
    } else {
        hide('logout-container');
    }

    var loginFields = document.getElementsByClassName('login-field');
    if (showLogin) {
        show(loginFields);
    } else {
        hide(loginFields);
    }

    var registerFields = document.getElementsByClassName('register-field');
    if (showRegister) {
        show(registerFields);
    } else {
        hide(registerFields);
    }
}

function renderTotal() {
    showIfCartHasItems('total');
}


window.uc.renderCart = function () {
    console.log("renderCart()");

    renderAddresses();
    renderShipping();
    renderCoupons();
    renderGiftCertificates();
    renderItems();
    renderSubtotal();
    renderCredentials();
    renderSummary();
    renderPayPal();
    renderPayment();
    renderTotal();

    // this will manage the visibility of most sections (hide them if no items are in cart).
    // the sections outside of div.checkoutFields must manage their own visibility.
    showIfCartHasItems('checkoutFields');

    // if the cart has items, once and only once, setup the hosted fields.
    if (uc.cart && uc.cart.items && uc.cart.items.length) {
        if (!uc.hostedFieldsSetup) {
            // we setup credit cards here, but do not tear them down anywhere.  the reason we do not is because the
            // credit card fields are only hidden when needed.  They are never destroyed and recreated as they are
            // with the backbone implementation of the checkout (this is the pure javascript version)
            var hostedFieldOptions = {
                callback: hostedFieldsCallback,
                overlayZIndex: 999998
            };
            setupSecureCreditCardFields(hostedFieldOptions);
            uc.hostedFieldsSetup = true;
        }
    }
};


// ===================================================================================
// Event Handlers for elements that remain on page and are only hidden at times
// Note: There are cleaner and more concise ways to handling events.  This example
// below is meant to be explicit, easy to follow, and 0 percent clever.
// There are also dynamic event handlers for dynamic content.  Those are:
//    item rows
//    coupon rows
// see the renderItems() and renderCoupons() method for those event handlers.
// Another easy way to find dyanamic handlers is to search for 'removeEventByClassName'
// ===================================================================================

function hostedFieldsCallback(card) {
    console.log("hostedFieldsCallback", card);
    var payment = null;
    var credit_card = null;

    if (uc.cart && uc.cart.payment) {
        payment = uc.cart.payment;
    } else {
        payment = uc.cart.payment = new uc.sdk.CartPayment();
    }

    if (payment.credit_card) {
        credit_card = payment.credit_card;
    } else {
        credit_card = payment.credit_card = new uc.sdk.CartPaymentCreditCard();
    }

    if (card && card.cardType) {
        credit_card.card_type = card.cardType;
    }

    if (card && card.maskedCreditCardNumber) {
        credit_card.card_number = card.maskedCreditCardNumber;
    }

    // if(card && card.token){
    //     credit_card.card_number_token = card.token;
    // }

}

function saveField(area, fieldName, element) {
    var value = '';

    // text field
    if (element.type === 'text' || element.type === 'email') {
        value = element.value.trim();

        // drop down (select)
    } else if (element.type.indexOf('select') > -1) {
        if (element.selectedIndex === -1) {
            value = '';
        } else {
            value = element.options[element.selectedIndex].value || element.options[element.selectedIndex].text;
        }

        // checkbox
    } else if (element.type === 'checkbox') {
        value = element.checked;
    }

    if (uc.cart && uc.cart[area]) {
        uc.cart[area][fieldName] = value;
    }
}

/**
 * save a credit card field.  This method is separate because some of the fields
 * are integers and because the fields are nested so deep.  Most of the code
 * focuses on traversing down to the fields and saving them, creating the path
 * along the way if needed.
 * @param fieldName
 * @param value
 */
function saveCreditCardField(fieldName, value) {
    var payment = new uc.sdk.CartPaymentCreditCard();
    if (uc.cart && uc.cart.payment && uc.cart.payment.credit_card) {
        payment = uc.cart.payment.credit_card;
    }
    payment[fieldName] = value;

    if (!uc.cart.payment) {
        uc.cart.payment = new uc.sdk.CartPayment();
    }
    uc.cart.payment.credit_card = payment;
}


/**
 * button click event signaling that an item should be removed from the shopping cart.
 * The button should have a data-pos attribute providing the item position in the cart items array.
 * @param event
 */
function removeItem(event) {
    var button = event.target;
    var position = parseInt(button.getAttribute('data-pos'));

    if (uc.cart && uc.cart.items && uc.cart.items.length > position) {

        // delete the item row from the cart before updating the server so the ui experience is pleasing to customer.
        var itemRow = getClosest(button, '.cart-item-row');
        if (itemRow) {
            itemRow.parentNode.removeChild(itemRow);
        }

        uc.cart.items.splice(position, 1);
        uc.saveCart();
    }
}


/**
 * updates an item quantity.  if the quantity isn't an integer, it is defaulted to one
 * @param event text field change event
 */
function updateItemQty(event) {
    var text = event.target;
    var qty = text.value.trim();
    var position = parseInt(text.getAttribute('data-pos'));

    if (isNaN(qty)) {
        qty = 1;
    }

    if (uc.cart && uc.cart.items && uc.cart.items.length > position) {
        uc.cart.items[position].quantity = qty;
        uc.saveCart();
    }
}


/**
 * updates an item's auto order schedule.
 * @param event select box change event
 */
function itemScheduleChange(event) {
    var select = event.target;
    var schedule = '';
    if (select && select.selectedIndex > -1) {
        schedule = select.options[select.selectedIndex].text; // these options don't have values.  only text
    }

    var position = parseInt(select.getAttribute('data-pos'));

    if (uc.cart && uc.cart.items && uc.cart.items.length > position) {
        uc.cart.items[position].auto_order_schedule = schedule;
        // uc.saveCart(); // TODO could this change cost?
    }
}


/**
 * updates an item's option.
 * @param event change event - this will be bound to numerous types of elements
 */
function itemOptionChange(event) {
    var element = event.target;
    var value = '';

    if (hasClass(element, 'singleQualifier')) {
        value = element.value.trim();
    } else if (hasClass(element, 'fixedQualifier')) {
        value = element.value.trim();
    } else if (hasClass(element, 'multiQualifier')) {
        value = element.value.trim();
    } else if (hasClass(element, 'selectQualifier')) {
        if (element.selectedIndex > -1) {
            value = element.options[element.selectedIndex].text;
        }
    } else if (hasClass(element, 'radioQualifier')) {
        var name = element.name;
        value = document.querySelector('input[name="' + name + '"]:checked').value;
    }

    var itemPosition = parseInt(element.getAttribute('data-pos'));
    var optionPosition = parseInt(element.getAttribute('data-option-pos'));

    if (uc.cart && uc.cart.items && uc.cart.items.length > itemPosition) {
        var item = uc.cart.items[itemPosition];
        if (item && item.options && item.options.length > optionPosition) {
            item.options[optionPosition].selected_value = value;
        }
        uc.saveCart();
    }
}


/**
 * button click event signaling that a coupon should be removed from the shopping cart.
 * The button should have a data-pos attribute providing the coupon position in the cart coupons array.
 * @param event
 */
function removeCoupon(event) {
    var button = event.target;
    var position = parseInt(button.getAttribute('data-pos'));

    if (uc.cart && uc.cart.coupons && uc.cart.coupons.length > position) {
        uc.cart.coupons.splice(position, 1);
        uc.saveCart();
    }
}


// --- Credentials ---
addEvent('btnLoginShow', 'click', function () {
    uc.inLogin = true;
    renderCredentials();
});
addEvent('btnRegisterShow', 'click', function () {
    uc.inRegister = true;
    renderCredentials();
});
addEvent('btnLogoutSubmit', 'click', function () {
    uc.logout();
});
addEvent('btnLoginSubmit', 'click', function () {
    uc.login();
});
addEvent('btnLoginCancel', 'click', function () {
    clearCheckoutErrors();
    uc.inLogin = false;
    uc.inRegister = false;
    renderCredentials();
});
addEvent('btnRegisterSubmit', 'click', function () {
    window.uc.register();
});
addEvent('btnRegisterCancel', 'click', function () {
    clearCheckoutErrors();
    uc.inLogin = false;
    uc.inRegister = false;
    renderCredentials();
});


// --- Shipping Address Fields ---
addEvent('storedShippingAddress', 'change', function () {
    var select = document.getElementById('storedShippingAddress');
    if (select && select.selectedIndex > -1) {
        useShippingAddress(select.options[select.selectedIndex].value);
    }
});
addEvent('shipToFirstName', 'blur', function () {
    saveField('shipping', 'first_name', this);
});
addEvent('shipToFirstName', 'change', function () {
    saveField('shipping', 'first_name', this);
});
addEvent('shipToLastName', 'blur', function () {
    saveField('shipping', 'last_name', this);
});
addEvent('shipToLastName', 'change', function () {
    saveField('shipping', 'last_name', this);
});
addEvent('shipToCompany', 'blur', function () {
    saveField('shipping', 'company', this);
});
addEvent('shipToCompany', 'change', function () {
    saveField('shipping', 'company', this);
});
addEvent('shipToAddress1', 'blur', function () {
    saveField('shipping', 'address1', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToAddress1', 'change', function () {
    saveField('shipping', 'address1', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToAddress2', 'blur', function () {
    saveField('shipping', 'address2', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToAddress2', 'change', function () {
    saveField('shipping', 'address2', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToCity', 'blur', function () {
    saveField('shipping', 'city', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToCity', 'change', function () {
    saveField('shipping', 'city', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToState', 'blur', function () {
    saveField('shipping', 'state_region', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToState', 'change', function () {
    saveField('shipping', 'state_region', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToPostalCode', 'blur', function () {
    saveField('shipping', 'postal_code', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToPostalCode', 'change', function () {
    saveField('shipping', 'postal_code', this);
    getShippingEstimatesIfNeeded();
});
addEvent('shipToCountry', 'change', function () {

    var oldCountryCode = '';
    if (uc.cart && uc.cart.shipping && uc.cart.shipping.country_code) {
        oldCountryCode = '';
    }

    saveField('shipping', 'country_code', this);
    var newCountryCode = uc.cart.shipping.country_code;
    if (oldCountryCode !== newCountryCode) {
        populateShippingStates('shipping', uc.cart.shipping.country_code);
    }

    getShippingEstimatesIfNeeded();
});
addEvent('email', 'change', function () {
    saveField('billing', 'email', this);
    saveField('billing', 'email_confirm', this);
});
addEvent('shipToPhone', 'change', function () {
    saveField('shipping', 'day_phone', this);
});
addEvent('shipToResidential', 'click', function () {
    saveField('shipping', 'ship_to_residential', this);
});
addEvent('shippingIsBilling', 'click', function () {
    var checked = this.checked;
    showHideBilling(!checked, checked);
});


// --- Billing Address Fields ---
addEvent('storedBillingAddress', 'change', function () {
    var select = document.getElementById('storedBillingAddress');
    if (select && select.selectedIndex > -1) {
        useBillingAddress(select.options[select.selectedIndex].value);
    }
});
addEvent('billToFirstName', 'blur', function () {
    saveField('billing', 'first_name', this)
});
addEvent('billToFirstName', 'change', function () {
    saveField('billing', 'first_name', this)
});
addEvent('billToLastName', 'blur', function () {
    saveField('billing', 'last_name', this)
});
addEvent('billToLastName', 'change', function () {
    saveField('billing', 'last_name', this)
});
addEvent('billToCompany', 'blur', function () {
    saveField('billing', 'company', this)
});
addEvent('billToCompany', 'change', function () {
    saveField('billing', 'company', this)
});
addEvent('billToAddress1', 'blur', function () {
    saveField('billing', 'address1', this)
});
addEvent('billToAddress1', 'change', function () {
    saveField('billing', 'address1', this)
});
addEvent('billToAddress2', 'blur', function () {
    saveField('billing', 'address2', this)
});
addEvent('billToAddress2', 'change', function () {
    saveField('billing', 'address2', this)
});
addEvent('billToCity', 'blur', function () {
    saveField('billing', 'city', this)
});
addEvent('billToCity', 'change', function () {
    saveField('billing', 'city', this)
});
addEvent('billToState', 'blur', function () {
    saveField('billing', 'state_region', this)
});
addEvent('billToState', 'change', function () {
    saveField('billing', 'state_region', this)
});
addEvent('billToPostalCode', 'blur', function () {
    saveField('billing', 'postal_code', this)
});
addEvent('billToPostalCode', 'change', function () {
    saveField('billing', 'postal_code', this)
});
addEvent('billToCountry', 'blur', function () {
    var oldCountryCode = '';
    if (uc.cart && uc.cart.billing && uc.cart.billing.country_code) {
        oldCountryCode = '';
    }

    saveField('billing', 'country_code', this);
    var newCountryCode = uc.cart.billing.country_code;
    if (oldCountryCode !== newCountryCode) {
        populateShippingStates('billing', uc.cart.billing.country_code);
    }
});
addEvent('billToCountry', 'change', function () {
    var oldCountryCode = '';
    if (uc.cart && uc.cart.billing && uc.cart.billing.country_code) {
        oldCountryCode = '';
    }

    saveField('billing', 'country_code', this);
    var newCountryCode = uc.cart.billing.country_code;
    if (oldCountryCode !== newCountryCode) {
        populateShippingStates('billing', uc.cart.billing.country_code);
    }
});


// --- Shipping Method ---
addEvent('shipping-preference', 'change', function () {

    var select = document.getElementById('shipping-preference');
    var selectedMethod = '';
    if (select.selectedIndex > 0) {
        selectedMethod = select.options[select.selectedIndex].value;
    }

    var cost = new uc.sdk.Currency();
    cost.value = 0;
    if (selectedMethod && uc.shippingEstimates && uc.shippingEstimates.length) {
        for (var i = 0; i < uc.shippingEstimates.length; i++) {
            if (uc.shippingEstimates[i].name === selectedMethod) {
                cost = uc.shippingEstimates[i].cost;
            }
        }
    }

    var shipping = new uc.cart.CartShipping();
    if (uc.cart && uc.cart.shipping) {
        shipping = uc.cart.shipping;
    }
    shipping.shipping_method = selectedMethod;
    uc.cart.shipping = shipping; // re-assign in case new variable


    var summary = new uc.cart.CartSummary();
    if (uc.cart && uc.cart.summary) {
        summary = uc.cart.summary;
    }
    summary.shipping_handling = cost;
    uc.cart.summary = summary;

    uc.saveCart();

});


// --- Coupons ---
addEvent('addCouponButton', 'click', function () {
    clearCheckoutErrors();
    var couponCode = document.getElementById('couponField').value.trim();
    if (couponCode) {

        var coupons = [];
        if (uc.cart && uc.cart.coupons) {
            coupons = uc.cart.coupons;
        }

        var coupon = new uc.sdk.CartCoupon();
        coupon.coupon_code = couponCode;
        coupons.push(coupon);

        uc.cart.coupons = coupons; // re-assign in case this was a new array
        uc.saveCart();
    }
});


// --- Gift Certificates ---
addEvent('updateGiftCertificateButton', 'click', function () {

    var button = document.getElementById('updateGiftCertificateButton');
    var text = button.innerHTML;

    var giftCertificate = document.getElementById('giftCertificateField').value.trim();
    clearCheckoutErrors();
    if (text === 'Apply') {

        var gc = new uc.sdk.CartGiftCertificate();
        if (uc.cart && uc.cart.gift_certificate) {
            gc = uc.cart.gift_certificate;
        }

        gc.gift_certificate_code = giftCertificate;
        uc.saveCart();

    } else {
        // if there is a gift cert, remove it.
        if (uc.cart && uc.cart.gift_certificate && uc.cart.gift_certificate.gift_certificate_code) {
            uc.cart.gift_certificate.gift_certificate_code = '';
            uc.saveCart();
        }
    }

});


// --- PayPal ---
addEvent('paypal_link', 'click', function () {
    // Note: This is an anchor, not a button.  Doesn't really matter.
    uc.checkout('payPal');
});


// --- Payment ---
// two fields here are text, but trigger on change because they're hosted fields.
addEvent('customerProfileCreditCardId', 'change', function () {

    var select = document.getElementById('customerProfileCreditCardId');
    var id = 0;
    if (select && select.selectedIndex > -1) {
        id = parseInt(select.options[select.selectedIndex].value);
    }
    if (isNaN(id)) {
        id = 0;
    }

    saveCreditCardField('customer_profile_credit_card_id', id);

    var disabled = id !== 0;

    document.getElementById('creditCardType').disabled = disabled;
    document.getElementById('creditCardNumber').disabled = disabled;
    document.getElementById('creditCardExpirationMonth').disabled = disabled;
    document.getElementById('creditCardExpirationYear').disabled = disabled;
    document.getElementById('creditCardVerificationNumber').disabled = disabled;
    document.getElementById('storeCreditCard').disabled = disabled;
});
addEvent('creditCardNumber', 'change', function () {
    // this should be a masked value returned by the hosted fields
    var cc = document.getElementById('creditCardNumber');
    saveCreditCardField('credit_card_number', cc.value.trim());
});
addEvent('creditCardExpirationMonth', 'blur', function () {
    var select = document.getElementById('creditCardExpirationMonth');
    var month = 0;
    if (select && select.selectedIndex > -1) {
        month = parseInt(select.options[select.selectedIndex].value);
    }
    if (isNaN(month)) {
        month = 0;
    }
    saveCreditCardField('card_expiration_month', month);
});
addEvent('creditCardExpirationYear', 'blur', function () {
    var select = document.getElementById('creditCardExpirationYear');
    var year = 0;
    if (select && select.selectedIndex > -1) {
        year = parseInt(select.options[select.selectedIndex].value);
    }
    if (isNaN(year)) {
        year = 0;
    }
    saveCreditCardField('card_expiration_year', year);
});
addEvent('creditCardVerificationNumber', 'change', function () {
    // this should be a masked value returned by the hosted fields
    var cvv = document.getElementById('creditCardVerificationNumber');
    saveCreditCardField('card_verification_number_token', cvv.value.trim());
});
addEvent('cvv-help-link', 'click', function () {
    var helpDiv = document.getElementById('cvv_message');
    if (hasClass(helpDiv, 'hidden')) {
        show(helpDiv);
    } else {
        hide(helpDiv);
    }
});
addEvent('storeCreditCard', 'click', function () {
    saveCreditCardField('store_credit_card', this.checked);
});


// --- Total ---
addEvent('btnFinalize', 'click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    uc.checkout('checkout');
});


// ===================================================================================
// Onload
// ===================================================================================
ready(function () {
    displayHandoffErrors();
    fireChangeEventsForAutofill();
    console.log("ready() called");

    // things to do after cart loads for the first time.
    var runAfterCartLoads = function () {
        processQueryParameters(); // check for any http parameters and apply them to the cart.
        showHideBilling(/* no arguments */);
        getShippingEstimatesIfNeeded();
    };

    uc.loadCart(runAfterCartLoads);
});
