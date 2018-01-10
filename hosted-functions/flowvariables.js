'use strict'
var request = require('request');
var util = require('util');

var baseUri = process.env.APIGEE_ACCESS_FLOW_VARIABLE_SERVICE;

function reqOpts(req, method, resource) {
  var options = {
    uri: util.format('%s/request/%s/flowvariables/%s', baseUri, req.headers['x-apigee-messageid'], resource),
    method: method
  };

  return options;
}

module.exports.getVariable = function(req, v, cb) {
  var opts = reqOpts(req, 'GET', v);
  request(opts, function (error, response, body) {
    if (error) {
      cb(error);
      return;
    } else if (response.statusCode !== 200) {
      cb(new Error('non 200 status code'));
      return;
    }

    let value = null;
    try {
      value = JSON.parse(body);
    } catch(err) {
      cb(err);
      return;
    }

    cb(null, value);
  });
};

module.exports.setVariable = function(req, v, value, cb) {
  var opts = reqOpts(req, 'PUT', v);
  opts.json = value;
  request(opts, function (error, response, body) {
    return cb(error);
  });
};

module.exports.deleteVariable = function(req, v, cb) {
  var opts = reqOpts(req, 'DELETE', v);
  request(opts, function (error, response, body) {
    return cb(error);
  });
};
