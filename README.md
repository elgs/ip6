# ip6
IPv6 address helper utilities.

# Installation
`npm install ip6`

# Samples
## To `normalize` IPv6 addresses
```javascript
var ip6 = require('ip6')

console.log(ip6.normalize('2404:6800:4003:808::200e'));
// 2404:6800:4003:0808:0000:0000:0000:200e
console.log(ip6.normalize('2404:6800:4003:0808:0000:0000:0000:200e'));
// 2404:6800:4003:0808:0000:0000:0000:200e
console.log(ip6.normalize('2404:6800:4003:808::'));
// 2404:6800:4003:0808:0000:0000:0000:0000
console.log(ip6.normalize('2404:68::'));
// 2404:0068:0000:0000:0000:0000:0000:0000
console.log(ip6.normalize('2404:0068:0000:0000:0000:0000:0000:0000'));
// 2404:0068:0000:0000:0000:0000:0000:0000
console.log(ip6.normalize('2404:6800:4003:0808:0:0:0:200e'));
// 2404:6800:4003:0808:0000:0000:0000:200e
console.log(ip6.normalize('::1'));
// 0000:0000:0000:0000:0000:0000:0000:0001
```

## To `abbreviate` IPv6 addresses

```javascript
console.log(ip6.abbreviate('2001:0000:0111:0000:0011:0000:0001:0000'));
// 2001:0:111:0:11:0:1:0
console.log(ip6.abbreviate('2001:0001:0000:0001:0000:0000:0000:0001'));
// 2001:1:0:1::1
console.log(ip6.abbreviate('2001:0001:0000:0001:0000:0000:0000:0000'));
// 2001:1:0:1::
console.log(ip6.abbreviate('0000:0000:0000:0000:0000:0000:0000:0000'));
// ::
console.log(ip6.abbreviate('0000:0000:0000:0000:0000:0000:0000:0001'));
// ::1
console.log(ip6.abbreviate('2041:0000:140F:0000:0000:0000:875B:131B'));
// 2041:0:140F::875B:131B
console.log(ip6.abbreviate('2001:0001:0002:0003:0004:0005:0006:0007'));
// 2001:1:2:3:4:5:6:7
```

## To divide a `/64` subnet into 4 `/66` subnets
```javascript
let subnets = ip6.divideSubnet("2607:5300:60:72b7::", 64, 66);
console.log(subnets);

/*
outputs:
[ '2607:5300:0060:72b7:0000:0000:0000:0000',
  '2607:5300:0060:72b7:4000:0000:0000:0000',
  '2607:5300:0060:72b7:8000:0000:0000:0000',
  '2607:5300:0060:72b7:c000:0000:0000:0000' ]
*/
```