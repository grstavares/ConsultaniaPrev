// Adapted from https://github.com/broofa/node-uuid/
// Under MIT License

// tslint:disable:no-bitwise

function getRandomFromMathRandom() {
    const result = new Array(16);

    let r = 0;
    for (let i = 0; i < 16; i++) {
        if ((i & 0x03) === 0) {
            r = Math.random() * 0x100000000;
        }
        result[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return result as ArrayLike<number>;
}

function getRandomFunction() {
    // tslint:disable-next-line:no-string-literal
    const browserCrypto = window.crypto || (window['msCrypto'] as Crypto);
    if (browserCrypto && browserCrypto.getRandomValues) {
        // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
        //
        // Moderately fast, high quality
        try {
        return function getRandomFromCryptoRandom() {
            const result = new Uint8Array(16);
            browserCrypto.getRandomValues(result);
            return result as ArrayLike<number>;
        };
      } catch (e) { /* fallback*/ }
    }

    // Math.random()-based (RNG)
    //
    // If all else fails, use Math.random().  It's fast, but is of unspecified
    // quality.
    return getRandomFromMathRandom;
}

const getRandom = getRandomFunction();

class ByteHexMappings {
    byteToHex: string[] = [];
    hexToByte: { [hex: string]: number; } = {};

    constructor() {
        for (let i = 0; i < 256; i++) {
            this.byteToHex[i] = (i + 0x100).toString(16).substr(1);
            this.hexToByte[this.byteToHex[i]] = i;
        }
    }
}

const byteHexMappings = new ByteHexMappings();

export function getUuidV4() {

    const origin = getRandom();
    const result = new Uint8Array(16);

    let i: number;
    for (i = 0; origin.length; ++i) {
        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        if (i === 6) {result[i] = (origin[6] & 0x0f) | 0x40;
        } else if (i === 8 ) {result[8] = (origin[8] & 0x3f) | 0x80;
        } else {result[i] = origin[i]; }
     }

    return result;
}

export function uuidToString(buf: ArrayLike<number>, offset: number = 0) {
    let i = offset;
    const bth = byteHexMappings.byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
}

export function getUuidV4String() {
    return uuidToString(getUuidV4());
}
