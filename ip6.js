/**
 * Created by elgs on 3/5/16.
 */
const normalize = function (a) {
   validate(a);

   a = a.toLowerCase()

   const nh = a.split(/\:\:/g);
   if (nh.length > 2) {
      throw new Error('Invalid address: ' + a);
   }

   let sections = [];
   if (nh.length === 1) {
      // full mode
      sections = a.split(/\:/g);
      if (sections.length !== 8) {
         throw new Error('Invalid address: ' + a);
      }
   } else if (nh.length === 2) {
      // compact mode
      const n = nh[0];
      const h = nh[1];
      const ns = n.split(/\:/g);
      const hs = h.split(/\:/g);
      for (let i in ns) {
         sections[i] = ns[i];
      }
      for (let i = hs.length; i > 0; --i) {
         sections[7 - (hs.length - i)] = hs[i - 1];
      }
   }
   for (let i = 0; i < 8; ++i) {
      if (sections[i] === undefined) {
         sections[i] = '0000';
      }
      sections[i] = sections[i].padStart(4, '0');
   }
   return sections.join(':');
};

const abbreviate = function (a) {
   validate(a);
   a = normalize(a);
   a = a.replace(/0000/g, 'g');
   a = a.replace(/\:000/g, ':');
   a = a.replace(/\:00/g, ':');
   a = a.replace(/\:0/g, ':');
   a = a.replace(/g/g, '0');
   // remove leading zeros of the first group, but keep at least one digit
   a = a.replace(/^0+(?=[^:])/, '');
   const sections = a.split(/\:/g);
   let zPreviousFlag = false;
   let zeroStartIndex = -1;
   let zeroLength = 0;
   let zStartIndex = -1;
   let zLength = 0;
   for (let i = 0; i < 8; ++i) {
      const section = sections[i];
      let zFlag = (section === '0');
      if (zFlag && !zPreviousFlag) {
         zStartIndex = i;
      }
      if (!zFlag && zPreviousFlag) {
         zLength = i - zStartIndex;
      }
      if (zLength > 1 && zLength > zeroLength) {
         zeroStartIndex = zStartIndex;
         zeroLength = zLength;
      }
      zPreviousFlag = (section === '0');
   }
   if (zPreviousFlag) {
      zLength = 8 - zStartIndex;
   }
   if (zLength > 1 && zLength > zeroLength) {
      zeroStartIndex = zStartIndex;
      zeroLength = zLength;
   }
   //console.log(zeroStartIndex, zeroLength);
   //console.log(sections);
   if (zeroStartIndex >= 0 && zeroLength > 1) {
      sections.splice(zeroStartIndex, zeroLength, 'g');
   }
   //console.log(sections);
   a = sections.join(':');
   //console.log(a);
   a = a.replace(/\:g\:/g, '::');
   a = a.replace(/\:g/g, '::');
   a = a.replace(/g\:/g, '::');
   a = a.replace(/g/g, '::');
   //console.log(a);
   return a;
};

// Basic validation
const validate = function (a) {
   const ns = [];
   const nh = a.split('::');
   if (nh.length > 2) {
      throw new Error('Invalid address: ' + a);
   } else if (nh.length === 2) {
      if (nh[0].startsWith(':') || nh[0].endsWith(':') || nh[1].startsWith(':') || nh[1].endsWith(':')) {
         throw new Error('Invalid address: ' + a);
      }

      ns.push(... (nh[0].split(':').filter(a => a)));
      ns.push(... (nh[1].split(':').filter(a => a)));
      if (ns.length > 7) {
         throw new Error('Invalid address: ' + a);
      }
   } else if (nh.length === 1) {
      ns.push(... (nh[0].split(':').filter(a => a)));
      if (ns.length !== 8) {
         throw new Error('Invalid address: ' + a);
      }
   }

   for (const n of ns) {
      const match = n.match(/^[a-f0-9]{1,4}$/i);
      if (match?.[0] !== n) {
         throw new Error('Invalid address: ' + a);
      }
   }
};

const _hex2bin = function (hex) {
   return parseInt(hex, 16).toString(2)
};
const _bin2hex = function (bin) {
   return parseInt(bin, 2).toString(16)
};

const _addr2bin = function (addr) {
   const nAddr = normalize(addr);
   const sections = nAddr.split(":");
   let binAddr = '';
   for (const section of sections) {
      binAddr += _hex2bin(section).padStart(16, '0');
   }
   return binAddr;
};

const _bin2addr = function (bin) {
   const addr = [];
   for (let i = 0; i < 8; ++i) {
      const binPart = bin.substr(i * 16, 16);
      const hexSection = _bin2hex(binPart).padStart(4, '0');
      addr.push(hexSection);
   }
   return addr.join(':');
};

const divideSubnet = function (addr, mask0, mask1, limit, abbr) {
   validate(addr);
   mask0 *= 1;
   mask1 *= 1;
   limit *= 1;
   mask1 = mask1 || 128;
   if (mask0 < 0 || mask1 < 0 || mask0 > 128 || mask1 > 128 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const ret = [];
   const binAddr = _addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(128 - mask1);
   const subnetBits = mask1 - mask0;
   const numSubnets = subnetBits <= 53 ? Math.pow(2, subnetBits) : Number.MAX_SAFE_INTEGER;
   for (let i = 0; i < numSubnets; ++i) {
      if (!!limit && i >= limit) {
         break;
      }
      const binSubnet = i.toString(2).padStart(mask1 - mask0, '0');
      const binSubAddr = binNetPart + binSubnet + binHostPart;
      const hexAddr = _bin2addr(binSubAddr);
      if (!!abbr) {
         ret.push(abbreviate(hexAddr));
      } else {
         ret.push(hexAddr);
      }

   }
   // console.log(numSubnets);
   // console.log(binNetPart, binSubnetPart, binHostPart);
   // console.log(binNetPart.length, binSubnetPart.length, binHostPart.length);
   // console.log(ret.length);
   return ret;
};

const range = function (addr, mask0, mask1, abbr) {
   validate(addr);
   mask0 *= 1;
   mask1 *= 1;
   mask1 = mask1 || 128;
   if (mask0 < 0 || mask1 < 0 || mask0 > 128 || mask1 > 128 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const binAddr = _addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(128 - mask1);
   const binStartAddr = binNetPart + '0'.repeat(mask1 - mask0) + binHostPart;
   const binEndAddr = binNetPart + '1'.repeat(mask1 - mask0) + binHostPart;
   if (!!abbr) {
      return {
         start: abbreviate(_bin2addr(binStartAddr)),
         end: abbreviate(_bin2addr(binEndAddr)),
         size: Math.pow(2, mask1 - mask0)
      };
   } else {
      return {
         start: _bin2addr(binStartAddr),
         end: _bin2addr(binEndAddr),
         size: Math.pow(2, mask1 - mask0)
      };
   }
};

const rangeBigInt = function (addr, mask0, mask1, abbr) {
   if (typeof BigInt === 'undefined') {
      return range(addr, mask0, mask1, abbr);
   }

   validate(addr);
   mask0 *= 1;
   mask1 *= 1;
   mask1 = mask1 || 128;
   if (mask0 < 0 || mask1 < 0 || mask0 > 128 || mask1 > 128 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const binAddr = _addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(128 - mask1);
   const binStartAddr = binNetPart + '0'.repeat(mask1 - mask0) + binHostPart;
   const binEndAddr = binNetPart + '1'.repeat(mask1 - mask0) + binHostPart;
   if (!!abbr) {
      return {
         start: abbreviate(_bin2addr(binStartAddr)),
         end: abbreviate(_bin2addr(binEndAddr)),
         size: (BigInt(2) ** BigInt(mask1 - mask0)).toString()
      };
   } else {
      return {
         start: _bin2addr(binStartAddr),
         end: _bin2addr(binEndAddr),
         size: (BigInt(2) ** BigInt(mask1 - mask0)).toString()
      };
   }
};

const randomSubnet = function (addr, mask0, mask1, limit, abbr) {
   validate(addr);
   mask0 *= 1;
   mask1 *= 1;
   limit *= 1;
   mask1 = mask1 || 128;
   limit = limit || 1;
   if (mask0 < 0 || mask1 < 0 || mask0 > 128 || mask1 > 128 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const ret = [];
   const binAddr = _addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(128 - mask1);
   const subnetBits = mask1 - mask0;
   const numSubnets = subnetBits <= 53 ? Math.pow(2, subnetBits) : Number.MAX_SAFE_INTEGER;
   for (let i = 0; i < numSubnets && i < limit; ++i) {
      // generate an binary string with length of mask1 - mask0
      let binSubnet = '';
      for (let j = 0; j < mask1 - mask0; ++j) {
         binSubnet += Math.floor(Math.random() * 2);
      }
      const binSubAddr = binNetPart + binSubnet + binHostPart;
      const hexAddr = _bin2addr(binSubAddr);
      if (!!abbr) {
         ret.push(abbreviate(hexAddr));
      } else {
         ret.push(hexAddr);
      }
   }
   // console.log(numSubnets);
   // console.log(binNetPart, binSubnetPart, binHostPart);
   // console.log(binNetPart.length, binSubnetPart.length, binHostPart.length);
   // console.log(ret.length);
   return ret;
};

// IPv4 helpers
const _ipv4addr2bin = function (addr) {
   const sections = addr.split('.');
   if (sections.length !== 4) {
      throw new Error('Invalid IPv4 address: ' + addr);
   }
   let bin = '';
   for (const section of sections) {
      const num = parseInt(section, 10);
      if (isNaN(num) || num < 0 || num > 255) {
         throw new Error('Invalid IPv4 address: ' + addr);
      }
      bin += num.toString(2).padStart(8, '0');
   }
   return bin;
};

const _bin2ipv4addr = function (bin) {
   const parts = [];
   for (let i = 0; i < 4; ++i) {
      parts.push(parseInt(bin.substr(i * 8, 8), 2));
   }
   return parts.join('.');
};

const divideSubnet4 = function (addr, mask0, mask1, limit) {
   mask0 *= 1;
   mask1 *= 1;
   limit *= 1;
   mask1 = mask1 || 32;
   if (mask0 < 0 || mask1 < 0 || mask0 > 32 || mask1 > 32 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const ret = [];
   const binAddr = _ipv4addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(32 - mask1);
   const subnetBits = mask1 - mask0;
   const numSubnets = Math.pow(2, subnetBits);
   for (let i = 0; i < numSubnets; ++i) {
      if (!!limit && i >= limit) {
         break;
      }
      const binSubnet = i.toString(2).padStart(mask1 - mask0, '0');
      const binSubAddr = binNetPart + binSubnet + binHostPart;
      ret.push(_bin2ipv4addr(binSubAddr));
   }
   return ret;
};

const range4 = function (addr, mask0, mask1) {
   mask0 *= 1;
   mask1 *= 1;
   mask1 = mask1 || 32;
   if (mask0 < 0 || mask1 < 0 || mask0 > 32 || mask1 > 32 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const binAddr = _ipv4addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(32 - mask1);
   const binStartAddr = binNetPart + '0'.repeat(mask1 - mask0) + binHostPart;
   const binEndAddr = binNetPart + '1'.repeat(mask1 - mask0) + binHostPart;
   return {
      start: _bin2ipv4addr(binStartAddr),
      end: _bin2ipv4addr(binEndAddr),
      size: Math.pow(2, mask1 - mask0)
   };
};

const randomSubnet4 = function (addr, mask0, mask1, limit) {
   mask0 *= 1;
   mask1 *= 1;
   limit *= 1;
   mask1 = mask1 || 32;
   limit = limit || 1;
   if (mask0 < 0 || mask1 < 0 || mask0 > 32 || mask1 > 32 || mask0 > mask1) {
      throw new Error('Invalid masks.');
   }
   const ret = [];
   const binAddr = _ipv4addr2bin(addr);
   const binNetPart = binAddr.substr(0, mask0);
   const binHostPart = '0'.repeat(32 - mask1);
   const subnetBits = mask1 - mask0;
   const numSubnets = Math.pow(2, subnetBits);
   for (let i = 0; i < numSubnets && i < limit; ++i) {
      let binSubnet = '';
      for (let j = 0; j < mask1 - mask0; ++j) {
         binSubnet += Math.floor(Math.random() * 2);
      }
      const binSubAddr = binNetPart + binSubnet + binHostPart;
      ret.push(_bin2ipv4addr(binSubAddr));
   }
   return ret;
};

const ptr = function (addr, mask) {
   validate(addr);
   mask *= 1;
   if (mask < 0 || mask > 128 || Math.floor(mask / 4) != mask / 4) {
      throw new Error('Invalid masks.');
   }
   const fullAddr = normalize(addr);
   const reverse = fullAddr.replace(/:/g, '').split('').reverse();
   return reverse.slice(0, (128 - mask) / 4).join('.');
};

export default {
   normalize,
   abbreviate,
   validate,
   divideSubnet,
   range,
   rangeBigInt,
   randomSubnet,
   ptr,
   divideSubnet4,
   range4,
   randomSubnet4,
};