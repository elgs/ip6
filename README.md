# ip6
IPv6 address helper utilities.

## Installation
### Module
`npm install ip6`
### Standalone
`npm install ip6 -g`

## Module Usage
### To `normalize` IPv6 addresses
```javascript
let ip6 = require('ip6')

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

### To `abbreviate` IPv6 addresses

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

### To divide a `/64` subnet into 4 `/66` subnets
```javascript
let subnets = ip6.divideSubnet("2607:5300:60:1234::", 64, 66);
console.log(subnets);

/*
outputs:
[ '2607:5300:0060:1234:0000:0000:0000:0000',
  '2607:5300:0060:1234:4000:0000:0000:0000',
  '2607:5300:0060:1234:8000:0000:0000:0000',
  '2607:5300:0060:1234:c000:0000:0000:0000' ]
*/
```

### To divide a `/64` subnet into `/128` subnets, but limit to 8 addresses
```javascript
let subnets = ip6.divideSubnet("2607:5300:60:1234::", 64, 128, 8);
console.log(subnets);

/*
[ '2607:5300:0060:1234:0000:0000:0000:0000',
  '2607:5300:0060:1234:0000:0000:0000:0001',
  '2607:5300:0060:1234:0000:0000:0000:0002',
  '2607:5300:0060:1234:0000:0000:0000:0003',
  '2607:5300:0060:1234:0000:0000:0000:0004',
  '2607:5300:0060:1234:0000:0000:0000:0005',
  '2607:5300:0060:1234:0000:0000:0000:0006',
  '2607:5300:0060:1234:0000:0000:0000:0007' ]
*/
```

### To divide a `/64` subnet into `/128` subnets, but limit to 8 abbreviated addresses
```javascript
let subnets = ip6.divideSubnet("2607:5300:60:1234::", 64, 128, 8, true);
console.log(subnets);

/*
[ '2607:5300:60:1234::',
  '2607:5300:60:1234::1',
  '2607:5300:60:1234::2',
  '2607:5300:60:1234::3',
  '2607:5300:60:1234::4',
  '2607:5300:60:1234::5',
  '2607:5300:60:1234::6',
  '2607:5300:60:1234::7' ]
*/
```

### To calculate the range and size of a `/64` subnet:
```javascript
let range = ip6.range("2607:5300:60:1234::", 64, 128);
console.log(range);
/*
{ start: '2607:5300:0060:1234:0000:0000:0000:0000',
  end: '2607:5300:0060:1234:ffff:ffff:ffff:ffff',
  size: 1 }
 */
```

### To calculate the range and size of a `/64` subnet divided into /120 subnets (output in abbreviated mode):
```javascript
let range = ip6.range("2607:5300:60:1234::", 64, 120, true);
console.log(range);
/*
{ start: '2607:5300:60:1234::',
  end: '2607:5300:60:1234:ffff:ffff:ffff:ff00',
  size: 256 }
 */
```

## Standalone Usage
### To normalize an IPv6 address:
```bash
ip6 -n 2001:db8::
2001:0db8:0000:0000:0000:0000:0000:0000
```

### To abbreviate an IPv6 address:
```bash
ip6 -a 2001:0db8:0000:0000:0000:0000:0000:0000
2001:db8::
```

### To divide a `/64` subnet into 4 `/66` subnets:
```bash
ip6 -d 2001:db8:: 64 66
2001:0db8:0000:0000:0000:0000:0000:0000
2001:0db8:0000:0000:4000:0000:0000:0000
2001:0db8:0000:0000:8000:0000:0000:0000
2001:0db8:0000:0000:c000:0000:0000:0000
```

### To divide a `/64` subnet into `/80` subnets, but outputs only 5 subnets:
```bash
ip6 -d 2001:db8:: 64 80 5
2001:0db8:0000:0000:0001:0000:0000:0000
2001:0db8:0000:0000:0002:0000:0000:0000
2001:0db8:0000:0000:0003:0000:0000:0000
2001:0db8:0000:0000:0004:0000:0000:0000
2001:0db8:0000:0000:0005:0000:0000:0000
```

### To divide a `/64` subnet into `/80` subnets, but outputs only 5 subnets in abbreviated mode:
```bash
ip6 -d -s 2001:db8:: 64 80 5
2001:db8:0:0:1::
2001:db8:0:0:2::
2001:db8:0:0:3::
2001:db8:0:0:4::
2001:db8:0:0:5::
```

### To calculate the range and size of a `/64` subnet divided into /120 subnets (output in abbreviated mode):
```bash
ip6 -r -s 2607:5300:60:1234:: 64 120
{"start":"2607:5300:60:1234::","end":"2607:5300:60:1234:ffff:ffff:ffff:ff00","size":256}
```

## License
The MIT License (MIT)

Copyright (c) 2016 Elgs Qian Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
