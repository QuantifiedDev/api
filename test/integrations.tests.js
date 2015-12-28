'use strict';

var assert = require('assert');
var integrations = require('../integrations.js');
var logger = require('./testlogger.js').logger;
var q = require('q');

describe('integrations', function() {
    it('empty cache hits the database and caches the results', function() {

        var cacheHit = false;
        var cacheUpdated = false;
        var redis = {
            get: function(key, callback){
                cacheHit = true;
                callback(null, null); // no error but the cached object isn't there either
            },
            set: function(){
                cacheUpdated = true;
            }   
        };

        var mongoCalled = false;
        var mongo = {
            find: function(){
                mongoCalled = true;
                return q();
            }
        };
        
        return integrations.getIntegrations(redis, mongo, logger)
        .then(function(){
            assert(mongoCalled, 'mongo called');
            assert(cacheHit, 'cache hit');
            assert(cacheUpdated, 'cache updated');    
        });
    });

    it('hot cache avoids the database', function() {

        var cacheHit = false;
        var cacheUpdated = false;
        var redis = {};

        redis.get = function(key, callback){
                cacheHit = true;
                callback(null, '{}'); // no error but the cached object isn't there either
            };

        redis.set = function(){
                cacheUpdated = true;
            };

        var mongoCalled = false;
        var mongo = {
            find: function(){
                mongoCalled = true;
                return q();
            }
        };
        
        return integrations.getIntegrations(redis, mongo, logger)
        .then(function(integrations){
            assert.deepEqual(integrations, {});
            assert(mongoCalled === false, 'mongo not called');
            assert(cacheHit, 'cache hit');
            assert(cacheUpdated === false, 'cache not updated');    
        });
    });
});