/**
 * Created by elgs on 3/5/16.
 */
import ip6 from './ip6.js';

////////////////////////////////////////////////////////////////////////////

describe('To validate IPv6 addresses', function () {
   it('should validate IPv6 addresses', function () {
      expect(function () { ip6.validate('1111::11111') }).toThrow();
      expect(function () { ip6.validate('1111:::11111') }).toThrow();
      expect(function () { ip6.validate('1111::1111:') }).toThrow();
      expect(function () { ip6.validate(':1111::1111') }).toThrow();
      expect(function () { ip6.validate(':1111::1111:') }).toThrow();
      expect(function () { ip6.validate('1:1:1:1:1:1:1:1:1') }).toThrow();
      expect(function () { ip6.validate('1:1:1:1:1:1:1:') }).toThrow();

      expect(function () { ip6.validate('1111::1111') }).not.toThrow();
      expect(function () { ip6.validate('1111::') }).not.toThrow();
      expect(function () { ip6.validate('1111:1111::') }).not.toThrow();
   });
});

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
      expect(ip6.normalize('AB:00AB::E')).toBe('00ab:00ab:0000:0000:0000:0000:0000:000e');
   });
});

describe('To abbreviate IPv6 addresses.', function () {
   it('should abbreviate IPv6 addresses', function () {
      expect(ip6.abbreviate('2001:0000:0111:0000:0011:0000:0001:0000')).toBe('2001:0:111:0:11:0:1:0');
      expect(ip6.abbreviate('2001:0001:0000:0001:0000:0000:0000:0001')).toBe('2001:1:0:1::1');
      expect(ip6.abbreviate('2001:0001:0000:0001:0000:0000:0000:0000')).toBe('2001:1:0:1::');
      expect(ip6.abbreviate('0000:0000:0000:0000:0000:0000:0000:0000')).toBe('::');
      expect(ip6.abbreviate('0000:0000:0000:0000:0000:0000:0000:0001')).toBe('::1');
      expect(ip6.abbreviate('2041:0000:140F:0000:0000:0000:875B:131B')).toBe('2041:0:140f::875b:131b');
      expect(ip6.abbreviate('2001:0001:0002:0003:0004:0005:0006:0007')).toBe('2001:1:2:3:4:5:6:7');
      expect(ip6.abbreviate('2001:0000:0000:0000:1111:0000:0000:0000')).toBe('2001::1111:0:0:0');
      expect(ip6.abbreviate('2001:db8:0:0:0:0:2:1')).toBe('2001:db8::2:1');

      expect(ip6.abbreviate('::0000:1')).toBe('::1');
      expect(ip6.abbreviate('000::0000:1')).toBe('::1');
      expect(ip6.abbreviate('0000::0000:1')).toBe('::1');
      expect(ip6.abbreviate('1:0000::0000:1')).toBe('1::1');
      expect(ip6.abbreviate('01:0000::0000:1')).toBe('1::1');
      expect(ip6.abbreviate('12:0000::0000:1')).toBe('12::1');
      expect(ip6.abbreviate('123:0000::0000:1')).toBe('123::1');

      // first group is 0000 but not part of longest zero run
      expect(ip6.abbreviate('0000:1234:0000:0000:0000:0000:0000:0000')).toBe('0:1234::');
      expect(ip6.abbreviate('0000:0001:0000:0000:0000:0000:0000:0000')).toBe('0:1::');
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
   it('should calculate the first and the last address of an IPv6 subnet 0.', function () {
      let n65 = ip6.range("2607:5300:60:1234::", 64, 65, true);
      expect(n65.start).toBe('2607:5300:60:1234::');
      expect(n65.end).toBe('2607:5300:60:1234:8000::');
      expect(n65.size).toBe(2);
   });

   it('should calculate the first and the last address of an IPv6 subnet 1.', function () {
      let n65 = ip6.rangeBigInt("2607:5300:60:1234::", 64, 65, true);
      expect(n65.start).toBe('2607:5300:60:1234::');
      expect(n65.end).toBe('2607:5300:60:1234:8000::');
      expect(n65.size).toBe('2');
   });

   it('should calculate the first and the last address of an IPv6 subnet 2.', function () {
      let n128 = ip6.rangeBigInt("::", 0, 128, false);
      expect(n128.start).toBe('0000:0000:0000:0000:0000:0000:0000:0000');
      expect(n128.end).toBe('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');
      expect(n128.size).toBe('340282366920938463463374607431768211456');
   });

   it('should calculate the first and the last address of an IPv6 subnet 3.', function () {
      let n56 = ip6.range("2607:5300:60::", 48, 56);
      expect(n56.start).toBe('2607:5300:0060:0000:0000:0000:0000:0000');
      expect(n56.end).toBe('2607:5300:0060:ff00:0000:0000:0000:0000');
      expect(n56.size).toBe(256);

      let r128 = ip6.randomSubnet("2607:5300:60::", 48, 128, 5, true);
      console.log(r128);
   });
});

////////////////////////////////////////////////////////////////////////////
// IPv4 tests

describe('To divide IPv4 subnet.', function () {
   it('should divide a /24 into 4 /26 subnets.', function () {
      let n26 = ip6.divideSubnet4("192.168.1.0", 24, 26);
      expect(n26.length).toBe(4);
      expect(n26[0]).toBe('192.168.1.0');
      expect(n26[1]).toBe('192.168.1.64');
      expect(n26[2]).toBe('192.168.1.128');
      expect(n26[3]).toBe('192.168.1.192');
   });

   it('should divide a /24 into /32 subnets with limit 3.', function () {
      let n32 = ip6.divideSubnet4("10.0.0.0", 24, 32, 3);
      expect(n32.length).toBe(3);
      expect(n32[0]).toBe('10.0.0.0');
      expect(n32[1]).toBe('10.0.0.1');
      expect(n32[2]).toBe('10.0.0.2');
   });

   it('should divide a /16 into 256 /24 subnets.', function () {
      let n24 = ip6.divideSubnet4("172.16.0.0", 16, 24);
      expect(n24.length).toBe(256);
      expect(n24[0]).toBe('172.16.0.0');
      expect(n24[255]).toBe('172.16.255.0');
   });
});

describe('To calculate the range of an IPv4 subnet.', function () {
   it('should calculate the range of a /24 subnet.', function () {
      let r = ip6.range4("192.168.1.0", 24, 32);
      expect(r.start).toBe('192.168.1.0');
      expect(r.end).toBe('192.168.1.255');
      expect(r.size).toBe(256);
   });

   it('should calculate the range of a /24 to /26.', function () {
      let r = ip6.range4("192.168.1.0", 24, 26);
      expect(r.start).toBe('192.168.1.0');
      expect(r.end).toBe('192.168.1.192');
      expect(r.size).toBe(4);
   });

   it('should calculate the range of a /0 to /32.', function () {
      let r = ip6.range4("0.0.0.0", 0, 32);
      expect(r.start).toBe('0.0.0.0');
      expect(r.end).toBe('255.255.255.255');
      expect(r.size).toBe(4294967296);
   });
});

describe('To generate random IPv4 subnets.', function () {
   it('should generate 5 random /32 addresses within a /24.', function () {
      let r = ip6.randomSubnet4("10.0.0.0", 24, 32, 5);
      expect(r.length).toBe(5);
      for (const addr of r) {
         expect(addr.startsWith('10.0.0.')).toBe(true);
      }
   });

   it('should generate 1 random subnet by default.', function () {
      let r = ip6.randomSubnet4("192.168.0.0", 16, 24);
      expect(r.length).toBe(1);
      expect(r[0].startsWith('192.168.')).toBe(true);
      expect(r[0].endsWith('.0')).toBe(true);
   });
});

describe('To generate PTR records for DNS zone file.', function () {
   it('should generate a PTR record for DNS zone file.', function () {
      expect(ip6.ptr("2607:5300:60:1234:cafe:babe:dead:beef", 64)).toBe('f.e.e.b.d.a.e.d.e.b.a.b.e.f.a.c');
      expect(ip6.ptr("2607:5300:60:1234:cafe:babe:dead:beef", 128)).toBe('');
      expect(ip6.ptr("2607:5300:60:1234:cafe:babe:dead:beef", 0)).toBe('f.e.e.b.d.a.e.d.e.b.a.b.e.f.a.c.4.3.2.1.0.6.0.0.0.0.3.5.7.0.6.2');
   });
});