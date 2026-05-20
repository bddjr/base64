A high-performance Base64 and Base64url library, featuring automatic native API acceleration, and support for custom alphabets.

## Setup

```
npm i @bddjr/base64
```

```js
import base64 from "@bddjr/base64"

// Encode string to base64
var enc = base64.encode("👋Hello!")
console.log(enc)

// Decode base64 to string
var dec = base64.decodeToString("8J+Ri0hlbGxvIQ==")
console.log(dec)

// Encode Uint8Array to base64
var enc = base64.encode(new Uint8Array(16))
console.log(enc)

// Decode base64 to Uint8Array
var dec = base64.decode("nszai3rv7QBp+/o0SgB93g==")
console.log(dec)



// Encode string to base64url
var enc = base64.encodeurl("👋你好")
console.log(enc)

// Decode base64url to string
var dec = base64.decodeurlToString("8J-Ri-S9oOWlvQ==")
console.log(dec)

// Encode Uint8Array to base64url
var enc = base64.encodeurl(new Uint8Array(16))
console.log(enc)

// Decode base64url to Uint8Array
var dec = base64.decodeurl("dBZ7uNJ0D-_EbZwZnQcEBA==")
console.log(dec)



// Encode to base64 omit padding characters (=)
var enc = base64.encode("omit", true)
console.log(enc) // b21pdA

// Encode to base64url omit padding characters (=)
var enc = base64.encodeurl("omit", true)
console.log(enc)
```

You can also use `@bddjr/base64/make` to create an encoder/decoder with a custom alphabet:

```ts
import {
    make_bytesToBase64,
    make_encode,
    make_decode,
    make_decodeToString,
} from "@bddjr/base64/make"

// base64-no-upper-case
export const alphabet = "!#$%&()*,-.:;<>?@[]^_`{|}~abcdefghijklmnopqrstuvwxyz0123456789+/"

export const _bytesToBase64 = /*@__PURE__*/ make_bytesToBase64(alphabet)
export const encode = /*@__PURE__*/ make_encode(_bytesToBase64)

export const decode = /*@__PURE__*/ make_decode(alphabet)
export const decodeToString = /*@__PURE__*/ make_decodeToString(decode)

const base64custom = {
    alphabet: alphabet as typeof alphabet, // TypeScript
    _bytesToBase64,
    encode,
    decode,
    decodeToString,
}
export default base64custom
```
