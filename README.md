A high-performance Base64 and Base64url library, featuring automatic native API acceleration, and support for custom alphabets.

## Setup

```
npm i @bddjr/base64
```

```js
import base64 from "@bddjr/base64"

// Encode string to base64
var enc = base64.encode("Hello world!")
console.log(enc)

// Decode base64 to string
var dec = base64.decodeToString("SGVsbG8gd29ybGQh")
console.log(dec)

// Encode Uint8Array to base64
var enc = base64.encode(new Uint8Array(16))
console.log(enc)

// Decode base64 to Uint8Array
var dec = base64.decode("nszai3rv7QBp+Co0SgB93g==")
console.log(dec)


// Encode string to base64url
var enc = base64.encodeurl("Hello world!")
console.log(enc)

// Decode base64url to string
var dec = base64.decodeurlToString("SGVsbG8gd29ybGQh")
console.log(dec)

// Encode Uint8Array to base64url
var enc = base64.encodeurl(new Uint8Array(16))
console.log(enc)

// Decode base64url to Uint8Array
var dec = base64.decodeurl("dBZ7uNJ0D6_EbZwZnQcEBA==")
console.log(dec)
```

You can also use `@bddjr/base64/make` to create an encoder/decoder with a custom alphabet:

```js
import {
    make_bytesToBase64,
    make_base64ToBytes,
    make_encode,
    make_decode,
    make_decodeToString,
} from "@bddjr/base64/make"

// base64-no-upper-case
const alphabet = "!#$%&()*,-.:;<>?@[]^_`{|}~abcdefghijklmnopqrstuvwxyz0123456789+/"

const _bytesToBase64 = make_bytesToBase64(alphabet)
const encode = make_encode(_bytesToBase64)

const _base64ToBytes = make_base64ToBytes(alphabet)
const decode = make_decode(_base64ToBytes)
const decodeToString = make_decodeToString(decode)
```
