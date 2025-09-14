function seededRandom(seed1, seed2, seed3, seed4) {
    if (typeof seed1 == "bigint") {
        seed4 = Number(BigInt.asUintN(16, seed1 >> 48n));
        seed3 = Number(BigInt.asUintN(16, seed1 >> 32n));
        seed2 = Number(BigInt.asUintN(16, seed1 >> 16n));
        seed1 = Number(BigInt.asUintN(16, seed1));
    }
    seed1 |= 0; seed2 |= 0; seed3 |= 0; seed4 |= 0;
    return () => {
        var result = (seed1 + seed2 | 0) + seed4 | 0;
        seed4 = seed4 + 1 | 0;
        seed1 = seed2 ^ seed2 >>> 9;
        seed2 = seed3 + (seed3 << 3) | 0;
        seed3 = seed3 << 21 | seed3 >>> 11;
        seed3 = seed3 + result | 0;
        return (result >>> 0) / 4294967296;
    }
}

/** 
 * @param {string} str
 * @param {number} seed 
*/
function stringHash(str, seed) {
    str ??= "";
    seed ??= 0;
    seed |= 0;
    seed = BigInt(seed);

    let byteRemainder = str.length % 16;
    let byteLength = str.length - byteRemainder;

    let 
        h1 = seed, h2 = seed,
        k1 = 0n, k2 = 0n;

    const
        c1 = 0x87c37b91114253d5n,
        c2 = 0x4cf5ad432745937fn

    let i = 0;
    for (; i < byteLength; i += 16) {
        k1 =
             BigInt(str.charCodeAt(i     ) & 0xff)         |
            (BigInt(str.charCodeAt(i + 1 ) & 0xff) << 8n)  |
            (BigInt(str.charCodeAt(i + 2 ) & 0xff) << 16n) |
            (BigInt(str.charCodeAt(i + 3 ) & 0xff) << 24n) |
            (BigInt(str.charCodeAt(i + 4 ) & 0xff) << 32n) |
            (BigInt(str.charCodeAt(i + 5 ) & 0xff) << 40n) |
            (BigInt(str.charCodeAt(i + 6 ) & 0xff) << 48n) |
            (BigInt(str.charCodeAt(i + 7 ) & 0xff) << 56n)
        k2 =
             BigInt(str.charCodeAt(i + 8 ) & 0xff)         |
            (BigInt(str.charCodeAt(i + 9 ) & 0xff) << 8n)  |
            (BigInt(str.charCodeAt(i + 10) & 0xff) << 16n) |
            (BigInt(str.charCodeAt(i + 11) & 0xff) << 24n) |
            (BigInt(str.charCodeAt(i + 12) & 0xff) << 32n) |
            (BigInt(str.charCodeAt(i + 13) & 0xff) << 40n) |
            (BigInt(str.charCodeAt(i + 14) & 0xff) << 48n) |
            (BigInt(str.charCodeAt(i + 15) & 0xff) << 56n)

        
        k1 = BigInt.asUintN(64, k1 * c1);
        k1 = BigInt.asUintN(64, k1 << 31n) | (k1 >> 33n);
        k1 = BigInt.asUintN(64, k1 * c2);
        h1 ^= k1;
        h1 = BigInt.asUintN(64, k1 << 27n) | (k1 >> 37n);
        h1 += BigInt.asUintN(64, h1 + h2);
        h1 = BigInt.asUintN(64, h1 * 5n + 0x52dce729n);

        k2 = BigInt.asUintN(64, k2 * c2);
        k2 = BigInt.asUintN(64, k2 << 33n) | (k2 >> 31n);
        k2 = BigInt.asUintN(64, k2 * c1);
        h2 ^= k1;
        h2 = BigInt.asUintN(64, k2 << 31n) | (k2 >> 33n);
        h2 += BigInt.asUintN(64, h1 + h2);
        h2 = BigInt.asUintN(64, h2 * 5n + 0x38495ab5n);
    }

    k1 = 0n;
    k2 = 0n;
    switch (byteRemainder) {
        case 15: k2 ^= BigInt(str.charCodeAt(i + 14) & 0xff) << 48n;
        case 14: k2 ^= BigInt(str.charCodeAt(i + 13) & 0xff) << 40n;
        case 13: k2 ^= BigInt(str.charCodeAt(i + 12) & 0xff) << 32n;
        case 12: k2 ^= BigInt(str.charCodeAt(i + 11) & 0xff) << 24n;
        case 11: k2 ^= BigInt(str.charCodeAt(i + 10) & 0xff) << 16n;
        case 10: k2 ^= BigInt(str.charCodeAt(i + 9 ) & 0xff) << 8n;
        case 9:
            k2 ^= BigInt(str.charCodeAt(i + 8) & 0xff);
            k2 = BigInt.asUintN(64, k2 * c2);
            k2 = BigInt.asUintN(64, k2 << 33n) | (k2 >> 31n);
            k2 = BigInt.asUintN(64, k2 * c1);
            h2 ^= k2;
        case 8:  k1 ^= BigInt(str.charCodeAt(i + 7 ) & 0xff) << 56n;
        case 7:  k1 ^= BigInt(str.charCodeAt(i + 6 ) & 0xff) << 48n;
        case 6:  k1 ^= BigInt(str.charCodeAt(i + 5 ) & 0xff) << 40n;
        case 5:  k1 ^= BigInt(str.charCodeAt(i + 4 ) & 0xff) << 32n;
        case 4:  k1 ^= BigInt(str.charCodeAt(i + 3 ) & 0xff) << 24n;
        case 3:  k1 ^= BigInt(str.charCodeAt(i + 2 ) & 0xff) << 16n;
        case 2:  k1 ^= BigInt(str.charCodeAt(i + 1 ) & 0xff) << 8n;
        case 1:
            k1 ^= BigInt(str.charCodeAt(i) & 0xff);
            k1 = BigInt.asUintN(64, k1 * c1);
            k1 = BigInt.asUintN(64, k1 << 31n) | (k1 >> 33n);
            k1 = BigInt.asUintN(64, k1 * c2);
            h1 ^= k1;
    }

    h1 ^= BigInt(str.length);
    h2 ^= BigInt(str.length);

    h1 = BigInt.asUintN(64, h1 + h2);
    h2 = BigInt.asUintN(64, h1 + h2);

    const 
        c3 = 0xff51afd7ed558ccdn
        c4 = 0xc4ceb9fe1a85ec53n
    h1 ^= h1 >> 33n; 
    h2 ^= h2 >> 33n;
    h1 = BigInt.asUintN(64, h1 * c3);
    h2 = BigInt.asUintN(64, h2 * c3);
    h1 ^= h1 >> 33n; 
    h2 ^= h2 >> 33n;
    h1 = BigInt.asUintN(64, h1 * c4);
    h2 = BigInt.asUintN(64, h2 * c4);
    h1 ^= h1 >> 33n; 
    h2 ^= h2 >> 33n;

    h1 = BigInt.asUintN(64, h1 + h2);
    h2 = BigInt.asUintN(64, h1 + h2);

    return h1 << 64n | h2
}