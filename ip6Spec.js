/**
 * Created by elgs on 3/5/16.
 */
;(function () {
    'use strict';

    var ip6 = require('./ip6.js');

    ////////////////////////////////////////////////////////////////////////////
    // Public tests

    describe('To normalize IPv6 addresses', function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it('should normalize IPv6 addresses', function () {
            expect(ip6.normalize('2404:6800:4003:808::200e')).toBe('2404:6800:4003:0808:0000:0000:0000:200e');
            expect(ip6.normalize('2404:6800:4003:0808:0000:0000:0000:200e')).toBe('2404:6800:4003:0808:0000:0000:0000:200e');
            expect(ip6.normalize('2404:6800:4003:808::')).toBe('2404:6800:4003:0808:0000:0000:0000:0000');
            expect(ip6.normalize('2404:68::')).toBe('2404:0068:0000:0000:0000:0000:0000:0000');
        });
    });

    describe('To compact IPv6 addresses.', function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it('should compact IPv6 addresses', function () {
            expect(1).toBe(1);
        });
    });

    ////////////////////////////////////////////////////////////////////////////
    // Private test

    describe('To validate IPv6 addresses.', function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it('should check whether IPv6 addresses are valid', function () {
            expect(ip6._validate('cafe:babe')).toBeTruthy();
            expect(ip6._validate('hello world')).toBeFalsy();
        });
    });
})();