import {
    type bytesToBase64Func,
    type encodeFunc,
    type decodeFunc,
    type decodeToStringFunc,
    make_bytesToBase64,
    make_decode,
    make_encode,
    make_decodeToString,
} from './make.js'

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
export const alphabeturl = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export const _bytesToBase64: bytesToBase64Func = /*@__PURE__*/ (
    typeof Uint8Array.prototype.toBase64 == 'function' // ES2026, Node.js v25
        ? (bytes, omitPadding) => Uint8Array.prototype.toBase64.call(bytes, { omitPadding })
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64Slice == 'function'
            ? (bytes, omitPadding) => {
                const out = Buffer.prototype.base64Slice.call(bytes) as string // has padding
                return omitPadding && out.charCodeAt(out.length - 1) === 61
                    //@ts-ignore
                    ? out.slice(0, -1 - (out.charCodeAt(out.length - 2) === 61))
                    : out
            }
            : make_bytesToBase64(alphabet)
)

/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export const _bytesToBase64url: bytesToBase64Func = /*@__PURE__*/ (
    typeof Uint8Array.prototype.toBase64 == 'function' // ES2026, Node.js v25
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

export const decode: decodeFunc = /*@__PURE__*/ (
    typeof Uint8Array.fromBase64 == 'function' // ES2026, Node.js v25
        ? (base64) => Uint8Array.fromBase64(base64)
        : make_decode(alphabet)
)

export const decodeurl: decodeFunc = /*@__PURE__*/ (
    typeof Uint8Array.fromBase64 == 'function' // ES2026, Node.js v25
        ? (base64) => Uint8Array.fromBase64(base64, { alphabet: 'base64url' })
        : make_decode(alphabeturl)
)

export const decodeToString = /*@__PURE__*/ make_decodeToString(decode)
export const decodeurlToString = /*@__PURE__*/ make_decodeToString(decodeurl)

const base64 = {
    alphabet: alphabet as typeof alphabet,
    alphabeturl: alphabeturl as typeof alphabeturl,
    _bytesToBase64,
    _bytesToBase64url,
    encode,
    encodeurl,
    decode,
    decodeurl,
    decodeToString,
    decodeurlToString,
}

export default base64
