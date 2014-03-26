'use strict';

/*global describe:true, it:true, before:true, after:true */

var
    demand      = require('must'),
    MockMessage = require('./mocks/message'),
    BART        = require('../plugins/bartly.js')
    ;

describe('BART', function()
{
    var fakeopts = { apikey: 'hamchunx', tzOffset: 420 };

    describe('plugin', function()
    {
        it('requires an options object', function()
        {
            function shouldThrow() { return new BART(); }
            shouldThrow.must.throw(/options object/);
        });

        it('requires an apikey option', function()
        {
            function shouldThrow() { return new BART({}); }
            shouldThrow.must.throw(/apikey/);
        });

        it('requires a tzOffset option', function()
        {
            function shouldThrow() { return new BART({ apikey: 'hamchunx' }); }
            shouldThrow.must.throw(/tzOffset/);
        });

        it('might not require a log?');

        it('defaults to Oakland 12th St station', function()
        {
            var plugin = new BART(fakeopts);
            plugin.defaultStation.must.equal('12th');
        });

        it('can be constructed', function()
        {
            var plugin = new BART(fakeopts);
            plugin.must.be.truthy();
            plugin.must.have.property('help');
            plugin.help.must.be.a.function();
            plugin.must.have.property('matches');
            plugin.matches.must.be.a.function();
            plugin.must.have.property('respond');
            plugin.respond.must.be.a.function();
        });

        it('implements help() correctly', function()
        {
            var plugin = new BART(fakeopts);
            var help = plugin.help();
            help.must.be.a.string();
            help.length.must.be.above(0);
        });

        it('implements matches() correctly', function()
        {
            var plugin = new BART(fakeopts);
            plugin.matches('NOT VALID').must.be.false();
            plugin.matches('bart next').must.be.true();
            plugin.matches('bart 19th').must.be.true();
            plugin.matches('bart 12th embr').must.be.true();
        });

        it('implements respond() correctly', function(done)
        {
            var plugin = new BART(fakeopts);
            var msg = new MockMessage({text: 'bart milb'});
            msg.on('done', function() { done(); });
            plugin.respond(msg);
        });
    });
});
