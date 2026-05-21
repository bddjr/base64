import type {
    Type_bytesToBase64,
    Type_base64ToBytes,
    Type_encode,
    Type_decode,
    Type_decodeToString,
} from '../type.d.ts'

import {
    make_bytesToBase64,
    make_base64ToBytes,
    make_base64ToBytes_NodeJS,
    make_encode,
    make_decode,
    make_decodeToString,
} from './make.js'

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
export const alphabeturl = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export const _bytesToBase64: Type_bytesToBase64 = /*@__PURE__*/ (
    typeof Uint8Array.prototype.toBase64 == 'function' // Node.js v25
        ? (bytes, omitPadding) => Uint8Array.prototype.toBase64.call(bytes, { omitPadding })
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64Slice == 'function'
            ? (bytes, omitPadding) => {
                // Deno: `Buffer.prototype.base64Slice` throws error when arguments are omitted
                // https://github.com/denoland/deno/issues/34286
                const out = Buffer.prototype.base64Slice.call(bytes, 0, bytes.length) as string // has padding
                return omitPadding && out.charCodeAt(out.length - 1) === 61
                    ? out.slice(0, -1 - ((out.charCodeAt(out.length - 2) === 61) as any))
                    : out
            }
            : make_bytesToBase64(alphabet)
)

/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export const _bytesToBase64url: Type_bytesToBase64 = /*@__PURE__*/ (
    typeof Uint8Array.prototype.toBase64 == 'function' // Node.js v25
        ? (bytes, omitPadding) => Uint8Array.prototype.toBase64.call(bytes, { alphabet: 'base64url', omitPadding })
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64urlSlice == 'function'
            ? (bytes, omitPadding) => {
                const out = Buffer.prototype.base64urlSlice.call(bytes) as string // not has padding
                    , mod = !omitPadding && out.length % 4
                return mod
                    ? mod === 3
                        ? out + '='
                        : out + '=='
                    : out
            }
            : make_bytesToBase64(alphabeturl)
)

export const _base64ToBytes: Type_base64ToBytes = /*@__PURE__*/ (
    typeof Uint8Array.fromBase64 == 'function' // Node.js v25
        ? base64 => Uint8Array.fromBase64(base64)
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64Write == 'function'
            ? make_base64ToBytes_NodeJS(Buffer.prototype.base64Write)
            : make_base64ToBytes(alphabet)
)

export const _base64urlToBytes: Type_base64ToBytes = /*@__PURE__*/ (
    typeof Uint8Array.fromBase64 == 'function' // Node.js v25
        ? base64 => Uint8Array.fromBase64(base64, { alphabet: 'base64url' })
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64urlWrite == 'function'
            ? make_base64ToBytes_NodeJS(Buffer.prototype.base64urlWrite)
            : make_base64ToBytes(alphabeturl)
)

/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export const encode = /*@__PURE__*/ make_encode(_bytesToBase64)

/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export const encodeurl = /*@__PURE__*/ make_encode(_bytesToBase64url)

export const decode = /*@__PURE__*/ make_decode(_base64ToBytes)
export const decodeurl = /*@__PURE__*/ make_decode(_base64urlToBytes)

export const decodeToString = /*@__PURE__*/ make_decodeToString(decode)
export const decodeurlToString = /*@__PURE__*/ make_decodeToString(decodeurl)

const base64 = {
    alphabet: alphabet as typeof alphabet,
    alphabeturl: alphabeturl as typeof alphabeturl,
    _bytesToBase64,
    _bytesToBase64url,
    _base64ToBytes,
    _base64urlToBytes,
    encode,
    encodeurl,
    decode,
    decodeurl,
    decodeToString,
    decodeurlToString,
}

export default base64
