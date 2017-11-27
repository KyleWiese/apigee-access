/*
 * Copyright 2014 Apigee Corporation.
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
var baseUri = "http://54.237.164.240:9001/apigee-access-service"

function createCache(id, config) {
  return new Cache(id, config)
}

function Cache(id, config) {
  this.name = config.name
  this.scope = config.scope
  this.id = id
}


Cache.prototype.get = function (key, cb) {
  var options = {
    uri: util.format("%s/caches/%s/entries/%s", baseUri, this.name, key),
    method: "GET"
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
        var cacheVal = parsedResp.value
        try {
          var parsedValue = JSON.parse(parsedResp.value)
          if (parsedValue.type && parsedValue.data) {
            cacheVal = parsedValue.type === "Buffer" ? new Buffer(parsedValue.data) : cacheVal
          }
        } catch (e){}
        cb(null, cacheVal)
      }
    }
  })
}

Cache.prototype.put = function (key, buf, ttl, cb) {
  var content = {
    value: buf,
    ttl: ttl
  }
  var body = JSON.stringify(content)
  var options = {
    uri: util.format("%s/caches/%s/entries/%s", baseUri, this.name, key),
    method: "PUT",
    headers: {
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(body)
    },
    body: body
  }
  request(options, function (error, response, body) {
    if (cb) {
      if (error) {
        cb(error)
      }
      else {
        if (response.statusCode != 200) {
          var errMsg = util.format("Server responded with response code: %d and body: %s", response.statusCode, body)
          cb(errMsg)
        }
        else {
          cb(null)
        }
      }
    }
  })
}


Cache.prototype.remove = function (key, cb) {
  var options = {
    uri: util.format("%s/caches/%s/entries/%s", baseUri, this.name, key),
    method: "DELETE"
  }
  request(options, function (error, response, body) {
    if (cb) {
      if (error) {
        cb(error)
      } else {
        if (response.statusCode != 204) {
          var errMsg = util.format("Server responded with response code: %d and body: %s", response.statusCode, body)
          cb(errMsg)
        } else {
          cb(null)
        }
      }
    }
  })
}

module.exports.createCache = createCache;