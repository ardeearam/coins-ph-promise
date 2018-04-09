"use strict";

const request = require("request-promise-native")
    , crypto = require("crypto")
    , querystring = require("querystring")
    ;

module.exports = class Coins {
    /**
     * Coins
     * Creates the instance of the `Coins` class.
     *
     * @name Coins
     * @function
     * @param {Object} options An object containing:
     *
     *  - `secret` (String): The secret key (mandatory).
     *  - `key` (String): The API key (mandatory)
     *  - `host` (String): The `coins.ph` host (default: `https://coins.ph/`).
     */
    constructor (options) {
        this.options = options;
        this.apiSecret = options.secret;
        this.apiKey = options.key;
        this.host = options.host || "https://coins.ph/";
    }

    /**
     * createBuyorder
     * Create a new buyorder
     *
     * @name createBuyorder
     * @function
     * @param {Object} data The order data as documented [here](https://coins.readme.io/docs/testinput).
     * @param {Function} cb The callback function.
     */
    createBuyorder (data) {
        return this._request({
            url: "buyorder"
          , method: "POST"
          , data: data
          , responseField: "order"
          , version: "api/v2"
        });
    }

    /**
     * markBuyorderPaid
     * Mark a buy order as paid
     *
     * @name markBuyorderPaid
     * @function
     * @param {Object} data The order data as documented [here](https://coins.readme.io/docs/buyorder-1).
     * @param {Function} cb The callback function.
     */
    markBuyorderPaid (data) {
        return this._request({
            url: `buyorder/${data.id}`
          , method: "PUT"
          , params: {}
          , responseField: "order"
        });
    }

    /**
     * buyorder
     * Retrieve an existing buyorder
     *
     * @name buyorder
     * @function
     * @param {Object} data The order data as documented [here](https://coins.readme.io/docs/buyorder).
     * @param {Function} cb The callback function.
     */
    buyorder (params) {
        return this._request({
            url: "buyorder" + (params.buyorder_id ? "/" + params.buyorder_id : "")
          , method: "GET"
          , params: params
          , responseField: "order"
        });
    }

    /**
     * createSellorder
     * Create a new sellorder
     *
     * @name createSellorder
     * @function
     * @param {Object} data The sell order data (documented [here](https://coins.readme.io/docs/sellorder)).
     * @param {Function} cb The callback function.
     */
    createSellorder (data) {
        return this._request({
            url: "sellorder"
          , method: "POST"
          , data: data
          , responseField: "order"
          , version: "api/v2"
        });
    }

    /**
     * validateField
     * Validate field values
     *
     * @name validateField
     * @function
     * @param {Object} data The post data (documented [here](https://coins.readme.io/docs/validate-field)).
     * @param {Function} cb The callback function.
     */
    validateField (data) {
        return this._request({
            url: "validate-field"
          , method: "POST"
          , params: {}
          , data: data
          , version: "api/v3"
          , responseField: "is_valid"
        });
    }

    /**
     * sellorder
     * Retrieve an existing sellorder
     *
     * @name sellorder
     * @function
     * @param {Object} params The sell order params (documented [here](https://coins.readme.io/docs/sellorder-1)).
     * @param {Function} cb The callback function.
     */
    sellorder (params) {
        return this._request({
            url: "sellorder" + (params.sellorder_id ? "/" + params.sellorder_id : "")
          , params: params
          , data: "order"
          , version: "api/v2"
        });
    }

    /**
     * transactionHistory
     * Gets the transaction history (buyorders).
     *
     * @name transactionHistory
     * @function
     * @param {Function} cb The callback function.
     */
    transactionHistory () {
        return this._request({
            url: "buyorder"
          , params: {}
          , data: "orders"
          , version: "api/v2"
        });
    }

    /**
     * payinOutlets
     * Retrieve supported payin-outlets
     *
     * @name payinOutlets
     * @function
     * @param {Object} params The request params (documented [here](https://coins.readme.io/docs/payin-outlets)).
     * @param {Function} cb The callback function.
     */
    payinOutlets(params) {
        return this._request({
            url: "payin-outlets"
          , method: "GET"
          , params: params
        });
    }

    /**
     * payinOutletFees
     * Retrieve current payin-outlet-fees
     *
     * @name payinOutletFees
     * @function
     * @param {Object} params The request params (documented [here](https://coins.readme.io/docs/payin-outlet-fees)).
     * @param {Function} cb The callback function.
     */
    payinOutletFees(params) {
        return this._request({
            url: "payin-outlet-fees"
          , method: "GET"
          , params: params
        });
    }

    /**
     * payinOutletCategories
     * Retrieve supported payin-outlet-categories
     *
     * @name payinOutletCategories
     * @function
     * @param {Object} params The request params (documented [here](https://coins.readme.io/docs/payin-outlet-categories)).
     * @param {Function} cb The callback function.
     */
    payinOutletCategories(params) {
        return this._request({
            url: "payin-outlet-categories"
          , method: "GET"
          , params: params
          , data: undefined
        });
    }

    /**
     * createPaymentRequest
     * Create a new payment request
     *
     * @name createPaymentRequest
     * @function
     * @param {Object} data The request data (documented [here](https://coins.readme.io/docs/payment-requests)).
     * @param {Function} cb The callback function.
     */
    createPaymentRequest(data) {
        return this._request({
            url: "payment-requests"
          , method: "POST"
          , data: data
          , version: "api/v3"
          , responseField: "payment-request"
        });
    }

    /**
     * paymentRequests
     * Retrieve an existing or a list of existing payment requests
     *
     * @name paymentRequests
     * @function
     * @param {Object} params The request params (documented [here](https://coins.readme.io/docs/payment-requests-1)).
     * @param {Function} cb The callback function.
     */
    paymentRequests(params) {
        return this._request({
            url: "getpayment-requests" + (params.id ? "/" + params.id : "")
          , params: params
          , version: "api/v3"
          , responseField: "payment-request"
        });
    }

    /**
     * createTransferRequest
     * Transfer funds between two accounts
     *
     * @name createTransferRequest
     * @function
     * @param {Object} data The request data (documented [here](https://coins.readme.io/docs/transfers)).
     * @param {Function} cb The callback function.
     */
    createTransferRequest(data) {
        return this._request({
            url: "transfers"
          , method: "POST"
          , data: data
          , version: "api/v3"
          , responseField: "transfer"
        });
    }

    /**
     * transfers
     * Get the list of transfers or a specific one.
     *
     * @name transfers
     * @function
     * @param {Object} params The params object (documented [here](https://coins.readme.io/docs/transfers-1)).
     * @param {Function} cb The callback function.
     */
    transfers (params) {
        return this._request({
            url: "transfers" + (params.id ? "/" + params.id : "")
          , params: params
          , version: "api/v3"
          , responseField: "transfer"
        });
    }

    /**
     * cryptoAccounts
     * Retrieve existing crypto-accounts
     *
     * @name cryptoAccounts
     * @function
     * @param {Object} params The params object (documented [here](https://coins.readme.io/docs/crypto-accounts)).
     * @param {Function} cb The callback function.
     */
    cryptoAccounts(params) {
        return this._request({
            url: "crypto-accounts"
          , params: params
          , version: "api/v3"
        });
    }

    /**
     * convertFunds
     * Convert funds between a user's accounts
     *
     * @name convertFunds
     * @function
     * @param {Object} data The data object (documented [here](https://coins.readme.io/docs/crypto-exchanges)).
     * @param {Function} cb The callback function.
     */
    convertFunds (data) {
        return this._request({
            url: "crypto-exchanges"
          , method: "POST"
          , data: data
          , version: "api/v3"
          , responseField: "crypto-exchanges"
        });
    }

    /**
     * cryptoExchanges
     * Retrieve current crypto-exchanges
     *
     * @name cryptoExchanges
     * @function
     * @param {Object} params The request params (documented [here](https://coins.readme.io/docs/crypto-exchanges)).
     * @param {Function} cb The callback function.
     */
    cryptoExchanges(params) {
        return this._request({
            url: "crypto-exchanges" + (params.id ? "/" + params.id : "")
          , params: params
          , version: "api/v3"
          , responseField: "crypto-exchanges"
        });
    }

    /**
     * cryptoRoutes
     * Retrieve existing crypto-routes
     *
     * @name cryptoRoutes
     * @function
     * @param {Function} cb The callback function.
     */
    cryptoRoutes() {
        return this._request({
            url: "crypto-routes"
          , version: "api/v3"
          , responseField: " "
        });
    }

    /**
     * cryptoPayments
     * Get the crypto payments or a specific one.
     *
     * @name cryptoPayments
     * @function
     * @param {Object} params The request params (documented [here](https://coins.readme.io/docs/crypto-payments)).
     * @param {Function} cb The callback function.
     */
    cryptoPayments(params) {
        return this._request({
            url: "crypto-payments" + (params.id ? "/" + params.id : "")
          , params: params
          , version: "api/v3"
          , responseField: "crypto-payments"
        });
    }

    /**
     * createUser
     * Create a new user
     *
     * @name createUser
     * @function
     * @param {Object} data The request data (documented [here](https://coins.readme.io/docs/user)).
     * @param {Function} cb The callback function.
     */
    createUser(data) {
        return this._request({
            url: "buyorder"
          , method: "POST"
          , data: data
          , responseField: "order"
          , version: "api/v2"
        });
    }

    /**
     * _getNonce
     * This is called internally.
     *
     * @name _getNonce
     * @function
     * @returns {Number} The `nonce` value.
     */
    _getNonce() {
        return new Date().getTime() * 1e13;
    }

    /**
     * _signRequest
     * Signs a request.
     *
     * @name _signRequest
     * @function
     * @param {String} url The request url.
     * @param {Object} body The request data.
     * @returns {Object} An object containing:
     *
     *  - `signature` (String): The HMAC signature.
     *  - `nonce` (String): The stringified nonce value.
     */
    _signRequest (url, body) {
        let nonce = this._getNonce().toString()
          , message = null
          ;

        // GET requests don't have a body, so we'll skip that for signing
        if (body === undefined) {
            message = nonce + url;
        } else {
            //body = json.dumps(body, separators=(',', ':'))
            message = nonce + url + JSON.stringify(body)
        }


        return {
            signature: crypto.createHmac("sha256", this.apiSecret).update(message).digest("hex")
          , nonce: nonce
        };
    }

    /**
     * _request
     * Low level function for making requests to the API endpoints.
     *
     * @name _request
     * @function
     * @param {Object} options An object containing the following fields:
     *
     *  - `url` (String): The api endpoint.
     *  - `method` (String): The request method (default: `get`).
     *  - `params` (Object): The params object.
     *  - `data` (Object): The POST data object.
     *  - `responseField` (String): The response field to take.
     *  - `version` (String): The version endpoint (default: `d/api`). It
     *     could be `api/v2` or `api/v3` too, depending on the endpoint.
     *
     * @param {Function} cb The callback function.
     */
    _request (options) {

        let _url = options.url
          , method = options.method || "get"
          , params = options.params || {}
          , data = options.data
          , responseField = options.responseField || _url
          , version = options.version || "d/api"
          , qs = querystring.stringify(params)
          , url = this.host + version + "/" + _url + "/" + (qs ? "?" + qs : "")
          , signed = this._signRequest(url, data)
          ;
        
        /*
        , (err, res) => {
            if (res.body && res.body.errors) {
                err = new Error(res.body.errors[0]);
            }
            if (err) { return cb(err, null, res); }
            cb(null, res.body && res.body[responseField] || res.body);
        }
        */

        return request({
            url: url
          , method: method
          , headers: {
              ACCESS_SIGNATURE: signed.signature
            , ACCESS_KEY: this.apiKey
            , ACCESS_NONCE: signed.nonce
            }
          , json: data ? data : true
        }).then((jsonResponse) => {
          
          return Promise.resolve(jsonResponse);
      
        }).catch((err) => {

          return Promise.reject(err);

        });
    }
};
