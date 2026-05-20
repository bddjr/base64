import base64 from '../dist/main.js'

let allSuccess = true

/**
 * @param {number} length 
 */
function randBytes(length) {
    const b = new Uint8Array(length)
    for (let i = b.length; i;) {
        b[--i] = Math.random() * 256
    }
    return b
}

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
        console.log('omitPadding:', omitPadding)
        console.log(v)
        const enc = base64.encode(v, omitPadding)
        console.log(enc)
        if (omitPadding || v.length % 3 === 0) {
            if (enc.endsWith('=')) process.exit(1)
        } else if (!enc.endsWith('='.repeat(3 - (v.length % 3)))) {
            process.exit(1)
        }
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
        if (!isEqual) allSuccess = false;
        console.log('equal:', isEqual)
        isEqual || process.exit(1)
    }

    test2("Hello world!")
    test2("👋Hello!")
    test2("👋你好")
    test2("")
    test2("1")
    test2("12")
    test2("123")
    test2("1234")
    test2("12345")
    test2("123456")
    test2("1234567")
    test2("12345678")
    test2("12345678 ")
    test2(randBytes(12))
    test2(randBytes(13))
    test2(randBytes(14))
    test2(randBytes(15))
    test2(randBytes(16))
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
console.log(base64.decode('x\t\n\f\r x'))
console.log(base64.decode('xx\t\n\f\r '))

for (const str of ['x', 'x===', '?', 'vvvvX', 'xx==x', 'xx==xx', 'xx=']) {
    console.log('------------------')
    console.log(`decode invalid base64: ${str}`)
    try {
        const v = base64.decode(str)
        console.log(v)
        process.exit(1)
    } catch (e) {
        console.log(e)
    }
}

console.log('------------------')
console.log('allSuccess:', allSuccess)
console.log()

allSuccess || process.exit(1)
