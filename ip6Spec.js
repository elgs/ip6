/**
 * Created by elgs on 3/5/16.
 */
;(function () {
    'use strict';

    let ip6 = require('./ip6.js');

    ////////////////////////////////////////////////////////////////////////////

    describe('To normalize IPv6 addresses', function () {
        it('should normalize IPv6 addresses', function () {
            expect(ip6.normalize('2404:6800:4003:808::200e')).toBe('2404:6800:4003:0808:0000:0000:0000:200e');
            expect(ip6.normalize('2404:6800:4003:0808:0000:0000:0000:200e')).toBe('2404:6800:4003:0808:0000:0000:0000:200e');
            expect(ip6.normalize('2404:6800:4003:808::')).toBe('2404:6800:4003:0808:0000:0000:0000:0000');
            expect(ip6.normalize('2404:68::')).toBe('2404:0068:0000:0000:0000:0000:0000:0000');
            expect(ip6.normalize('2404:6800:4003:0808:0:0:0:200e')).toBe('2404:6800:4003:0808:0000:0000:0000:200e');
            expect(ip6.normalize('::1')).toBe('0000:0000:0000:0000:0000:0000:0000:0001');
            expect(ip6.normalize('::')).toBe('0000:0000:0000:0000:0000:0000:0000:0000');
            expect(ip6.normalize('2607:5300:60:465c:0000:0000:0000::')).toBe('2607:5300:0060:465c:0000:0000:0000:0000');
        });
    });

    describe('To abbreviate IPv6 addresses.', function () {
        it('should abbreviate IPv6 addresses', function () {
            expect(ip6.abbreviate('2001:0000:0111:0000:0011:0000:0001:0000')).toBe('2001:0:111:0:11:0:1:0');
            expect(ip6.abbreviate('2001:0001:0000:0001:0000:0000:0000:0001')).toBe('2001:1:0:1::1');
            expect(ip6.abbreviate('2001:0001:0000:0001:0000:0000:0000:0000')).toBe('2001:1:0:1::');
            expect(ip6.abbreviate('0000:0000:0000:0000:0000:0000:0000:0000')).toBe('::');
            expect(ip6.abbreviate('0000:0000:0000:0000:0000:0000:0000:0001')).toBe('::1');
            expect(ip6.abbreviate('2041:0000:140F:0000:0000:0000:875B:131B')).toBe('2041:0:140F::875B:131B');
            expect(ip6.abbreviate('2001:0001:0002:0003:0004:0005:0006:0007')).toBe('2001:1:2:3:4:5:6:7');
            expect(ip6.abbreviate('2001:0000:0000:0000:1111:0000:0000:0000')).toBe('2001::1111:0:0:0');
            expect(ip6.abbreviate('2001:db8:0:0:0:0:2:1')).toBe('2001:db8::2:1');
        });
    });

    describe('To divide IPv6 subnet.', function () {
        it('should divide a /64 into 4 /66 subnets.', function () {
            let n66 = ip6.divideSubnet("2607:5300:60:1234::", 64, 66);
            expect(n66.length).toBe(4);
            expect(n66[0]).toBe('2607:5300:0060:1234:0000:0000:0000:0000');
            expect(n66[1]).toBe('2607:5300:0060:1234:4000:0000:0000:0000');
            expect(n66[2]).toBe('2607:5300:0060:1234:8000:0000:0000:0000');
            expect(n66[3]).toBe('2607:5300:0060:1234:c000:0000:0000:0000');
        });

        it('should divide a /64 into 4 /66 subnets, but limit to 2 subnets.', function () {
            let n128 = ip6.divideSubnet("2607:5300:60:1234::", 64, 128, 2);
            expect(n128.length).toBe(2);
            expect(n128[0]).toBe('2607:5300:0060:1234:0000:0000:0000:0000');
            expect(n128[1]).toBe('2607:5300:0060:1234:0000:0000:0000:0001');
        });

        it('should divide a /64 into 4 abbreviated /66 subnets.', function () {
            let n66 = ip6.divideSubnet("2607:5300:60:1234::", 64, 66, null, true);
            expect(n66.length).toBe(4);
            expect(n66[0]).toBe('2607:5300:60:1234::');
            expect(n66[1]).toBe('2607:5300:60:1234:4000::');
            expect(n66[2]).toBe('2607:5300:60:1234:8000::');
            expect(n66[3]).toBe('2607:5300:60:1234:c000::');
        });
    });

    describe('To calculate the range of an IPv6 subnet.', function () {
        it('should calculate the first and the last address of an IPv6 subnet.', function () {
            let n65 = ip6.range("2607:5300:60:1234::", 64, 65, true);
            expect(n65.start).toBe('2607:5300:60:1234::');
            expect(n65.end).toBe('2607:5300:60:1234:8000::');
            expect(n65.size).toBe(9223372036854776000);
        });

        it('should calculate the first and the last address of an IPv6 subnet.', function () {
            let n120 = ip6.range("2607:5300:60:1234::", 64, 120);
            expect(n120.start).toBe('2607:5300:0060:1234:0000:0000:0000:0000');
            expect(n120.end).toBe('2607:5300:0060:1234:ffff:ffff:ffff:ff00');
            expect(n120.size).toBe(256);
        });
    });
})();