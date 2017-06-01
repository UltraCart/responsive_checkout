// requires jQuery 1.7.2+
// requires JSON (json2.js is a nice one...)

// This file is listed at v0.1 because it contains only a few of the cart rest calls.
// It will be gradually expanded as needed.  Feel free to contribute if you need something.


// create the ultracart namespace if needed
if (typeof ultracart === 'undefined') {
    ultracart = {};
}

ultracart.Cart = function (merchantId) {
    this.merchantId = merchantId;

    /**
     * registers a customer into the system using the password and email properties of the cart.
     * If successful, returns an updated cart object.
     * If unsuccessful, you may OR may not receive back a cart.  It all depends on the error
     * and whether the server can construct a return cart.  Check the cart.errors property for errors.  If the call
     * fails outright, the request headers will contain a header 'UC-REST-ERROR' that should
     * be consulted (or displayed).
     * If the email and password match an existing customer, the customer is logged in.  If the password does not match,
     * the customer will receive a "profile already exists" error.
     * @param cart the current shopping cart
     * @param [options] success and failure callbacks
     * @return if no callbacks specified, this returns back a cart object (check cart.errors for any issues!), else null
     */
    this.register = function (cart, options) {

        options = options || {};

        var updatedCart = null;

        jQuery.ajax({
            url: 'https://api.ultracart.com/rest/cart/register',
            data: JSON.stringify(cart),
            type: 'post',
            async: !!(options.success || options.failure),
            headers: {"cache-control": "no-cache"},
            contentType: 'application/json; charset=UTF-8',
            cache: false,
            dataType: 'json'
        }).done(function (result) {
            updatedCart = result;
            if (options.success) {
                options.success(updatedCart);
            }
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (options.failure) {
                    options.failure(jqXHR, textStatus, errorThrown);
                }
            });

        return updatedCart;
    };


    /**
     * logs a customer into the system using the password and email properties of the cart.  If successful, returns
     * an updated cart object.  If unsuccessful, you may OR may not receive back a cart.  It all depends on the error
     * and whether the server can construct a return cart.  Check the cart.errors property for errors.  If the call
     * fails outright, the request headers will contain a header 'UC-REST-ERROR' that should
     * be consulted (or displayed).
     * @param cart the current shopping cart
     * @param [options] success and failure callbacks
     * @return if no callbacks specified, this returns back a cart object (check cart.errors for any issues!), else null
     */
    this.login = function (cart, options) {

        options = options || {};

        var updatedCart = null;

        jQuery.ajax({
            url: 'https://api.ultracart.com/rest/cart/login',
            data: JSON.stringify(cart),
            type: 'post',
            async: !!(options.success || options.failure),
            headers: {"cache-control": "no-cache"},
            contentType: 'application/json; charset=UTF-8',
            cache: false,
            dataType: 'json'
        }).done(function (result) {
            updatedCart = result;
            if (options.success) {
                options.success(updatedCart);
            }
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (options.failure) {
                    options.failure(jqXHR, textStatus, errorThrown);
                }
            });

        return updatedCart;
    };


    /**
     * logs a customer OUT of the system.  If successful, returns
     * an updated cart object.  If unsuccessful, the request headers will contain a header 'UC-REST-ERROR' that should
     * be consulted (or displayed).
     * @param cart the current shopping cart
     * @param [options] success and failure callbacks
     * @return if no callbacks specified, this returns back a cart object, else null
     */
    this.logout = function (cart, options) {

        options = options || {};

        var updatedCart = null;

        jQuery.ajax({
            url: 'https://api.ultracart.com/rest/cart/logout',
            data: JSON.stringify(cart),
            type: 'post',
            async: !!(options.success || options.failure),
            headers: {"cache-control": "no-cache"},
            contentType: 'application/json; charset=UTF-8',
            cache: false,
            dataType: 'json'
        }).done(function (result) {
            updatedCart = result;
            if (options.success) {
                options.success(updatedCart);
            }
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (options.failure) {
                    options.failure(jqXHR, textStatus, errorThrown);
                }
            });

        return updatedCart;
    };


};
