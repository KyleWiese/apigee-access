'use strict';

 var apigee = require('..');
 var assert = require('assert');
 var fs = require('fs');
 var util = require('util');

 describe('Hosted Functions', function() {
     it('KVM getKeys correct map should return list of keys', function(done) {
        var kvm = apigee.getKeyValueMap('test_kvm', 'environment')
        var expected = ["var1","var2","var3"]
        kvm.getKeys(function(err, keys_array) {
            assert.deepEqual(keys_array, expected)
            done()
        })
     })
     it('KVM getKeys incorrect map should return null with error', function(done) {
        var kvm = apigee.getKeyValueMap('not_test_kvm', 'environment')
        var expected = null
        kvm.getKeys(function(err, keys_array) {
            assert.notEqual(err, null)
            assert.deepEqual(keys_array, expected)
            done()
        })
     })
     it('KVM get correct request should return value', function(done) {
        var kvm = apigee.getKeyValueMap('test_kvm', 'environment')
        var expected = 'val1'
        kvm.get('var1', function(err, key_value) {
            assert.deepEqual(key_value, expected)
            done()
        })
     })
     it('KVM get incorrect request should return null with error', function(done) {
        var kvm = apigee.getKeyValueMap('test_kvm', 'environment')
        var expected = null
        kvm.get('not_var1', function(err, key_value) {
            assert.notEqual(err, null)
            assert.deepEqual(key_value, expected)
            done()
        })
     })
})