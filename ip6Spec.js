/**
 * Created by elgs on 3/5/16.
 */
;(function () {
    'use strict';

    var ip6 = require('./ip6.js');

    describe('To normalize IPv6 addresses', function () {
        beforeEach(function () {
        });
        afterEach(function () {
        });

        it('should normalize IPv6 addresses', function () {
            expect(1).toBe(1);
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

    describe('To compact IPv6 addresses.', function () {
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