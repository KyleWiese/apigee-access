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
var baseUri = "http://apigee-hf-testing-test.apigee.net/apigee-access-service"

var getKeys = function (id, name, scope, api, revision, cb) {
    var uri = util.format("%s/kvms/%s/keys\?scope\=%s", baseUri, name, scope)
    request(uri, function (error, response, body) {
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
    var uri = util.format("%s/kvms/%s/values/%s\?scope\=%s", baseUri, name, key, scope)
    request(uri, function (error, response, body) {
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