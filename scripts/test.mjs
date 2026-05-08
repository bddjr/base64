import Base64NoUpperCase from '../dist/main.js'

let allSuccess = true

/**
 * @param {typeof Base64NoUpperCase} Base64NoUpperCase 
 */
function test(Base64NoUpperCase) {
    /**
     * @param {string | Uint8Array} v
     */
    function test2(v) {
        console.log('------------------')
        console.log(v)
        const enc = Base64NoUpperCase.encode(v)
        console.log(enc)
        var isEqual = false
        if (typeof v == 'string') {
            const dec = Base64NoUpperCase.decodeToString(enc)
            console.log(dec)
            isEqual = dec === v
        } else {
            const dec = Base64NoUpperCase.decode(enc)
            console.log(dec)
            isEqual = (() => {
                if (dec.length !== v.length) return false
                for (const i in dec) {
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

test(Base64NoUpperCase);

console.log('------------------')
console.log('allSuccess:', allSuccess)
console.log()

allSuccess || process.exit(1)
