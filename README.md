Base64 encode, decode and decodeToString.

## Setup

```
npm i @bddjr/base64
```

```js
import base64 from "@bddjr/base64"

// Encode string
var enc = base64.encode("Hello world!")
console.log(enc)

// Decode to string
var dec = base64.decodeToString("SGVsbG8gd29ybGQh")
console.log(dec)

// Encode Uint8Array
var enc = base64.encode(new Uint8Array(16))
console.log(enc)

// Decode to Uint8Array
var dec = base64.decode("nszai3rv7QBp+Co0SgB93g==")
console.log(dec)
```
