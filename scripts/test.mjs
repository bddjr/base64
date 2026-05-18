import base64 from '../dist/main.js'

let allSuccess = true

/**
 * @param {{
 *  encode: typeof base64.encode
 *  decode: typeof base64.decode
 *  decodeToString: typeof base64.decodeToString
 * }} base64 
 * @param {boolean} omitPadding 
 */
function test(base64, omitPadding) {
    /**
     * @param {string | Uint8Array} v
     */
    function test2(v) {
        console.log('------------------')
        console.log(v)
        const enc = base64.encode(v, omitPadding)
        console.log(enc)
        if (omitPadding && enc.endsWith('=')) process.exit(1);
        var isEqual = false
        if (typeof v == 'string') {
            const dec = base64.decodeToString(enc)
            console.log(dec)
            isEqual = dec === v
        } else {
            const dec = base64.decode(enc)
            console.log(dec)
            isEqual = (() => {
                if (dec.length !== v.length) return false
                for (const i of dec.keys()) {
                    if (dec[i] !== v[i]) return false
                }
                return true
            })()
        }
        allSuccess &&= isEqual
        console.log('equal:', isEqual)
        isEqual || process.exit(1)
    }

    test2("Hello world!")
    test2("123456")
    test2("1234567")
    test2("12345678")
    test2(crypto.getRandomValues(new Uint8Array(12)))
    test2(crypto.getRandomValues(new Uint8Array(13)))
    test2(crypto.getRandomValues(new Uint8Array(14)))
    test2(crypto.getRandomValues(new Uint8Array(15)))
    test2(crypto.getRandomValues(new Uint8Array(16)))
}

for (const omitPadding of [false, true]) {
    test(base64, omitPadding);
    test({
        encode: base64.encodeurl,
        decode: base64.decodeurl,
        decodeToString: base64.decodeurlToString,
    }, omitPadding);
}


console.log('------------------')
console.log('allSuccess:', allSuccess)
console.log()

allSuccess || process.exit(1)
