/*
 * Copyright 2016 Apigee Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict'

var request = require('request')
var util = require('util')
var baseUri = process.env.APIGEE_ACCESS_KVM_SERVICE

var getKeys = function (id, name, scope, api, revision, cb) {
    var options = {
        uri: util.format("%s/kvms/%s/keys", baseUri, name),
        method: "GET",
        qs: {
            scope: scope
        }
    }
    if (process.env.APIGEE_ACCESS_KEY && process.env.APIGEE_ACCESS_SECRET) {
        options.auth = {
            user: process.env.APIGEE_ACCESS_KEY,
            pass: process.env.APIGEE_ACCESS_SECRET
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            cb(error, null)
        }
        else {
            if (response.statusCode != 200) {
                cb(body, null)
            }
            else {
                try {
                    var parsedResp = JSON.parse(body)
                } catch (e) {
                    cb(e, null)
                }
                cb(null, parsedResp.keys)
            }
        }
    })
}

var getKey = function (id, key, name, scope, api, revision, cb) {
    var options = {
        uri: util.format("%s/kvms/%s/values/%s", baseUri, name, key),
        method: "GET",
        qs: {
            scope: scope
        }
    }
    if (process.env.APIGEE_ACCESS_KEY && process.env.APIGEE_ACCESS_SECRET) {
        options.auth = {
            user: process.env.APIGEE_ACCESS_KEY,
            pass: process.env.APIGEE_ACCESS_SECRET
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            cb(error, null)
        }
        else {
            if (response.statusCode != 200) {
                cb(body, null)
            }
            else {
                try {
                    var parsedResp = JSON.parse(body)
                } catch (e) {
                    cb(e, null)
                }
                cb(null, parsedResp.value)
            }
        }
    })
}

module.exports = {
    getKeys: getKeys,
    getKey: getKey
}