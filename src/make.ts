/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export type bytesToBase64Func = (bytes: Uint8Array, omitPadding?: boolean) => string

export type decodeFunc = (base64: string) => Uint8Array<ArrayBuffer>

export type encodeFunc = (input: Uint8Array | string, omitPadding?: boolean) => string

export type decodeToStringFunc = (input: string, textDecoder?: TextDecoder) => string

export const errType_inputArgMustStr = `input argument must be a string`
export const errType_inputArgMustUint8Array = `input argument must be a Uint8Array`
export const errType_alphabetMustStr = `alphabet must be a string`
export const errType_paddingCharMustStr = `paddingChar must be a string`

export const errSyntax_alphabetLen = `alphabet length must be 64`
export const errSyntax_alphabetMustASCII = `alphabet only allows ASCII characters`
export const errSyntax_alphabetNoPaddingChar = `alphabet cannot contain the padding character '='`
export const errSyntax_alphabetNoDuplicate = `alphabet cannot contain duplicate characters`
export const errSyntax_paddingCharLen = `paddingChar length must be 1`
export const errSyntax_paddingCharMustASCII = `paddingChar only allows ASCII character`
export const errSyntax_decodeInvalidChar = `Found a character that cannot be part of a valid base64 string.`
export const errSyntax_decodeSingleChar = `The base64 input terminates with a single character, excluding padding (=).`

export const textEncoder = /*@__PURE__*/ new TextEncoder
export const textDecoder = /*@__PURE__*/ new TextDecoder

export function make_bytesToBase64(alphabet: string, paddingChar?: string): bytesToBase64Func {
    if (typeof alphabet != 'string') throw TypeError(errType_alphabetMustStr);
    if (alphabet.length !== 64) throw SyntaxError(errSyntax_alphabetLen);
    let paddingCharCode = 61 // '='
    if (paddingChar != null) {
        if (typeof paddingChar != 'string')
            throw TypeError(errType_paddingCharMustStr);
        if (paddingChar.length !== 1)
            throw SyntaxError(errSyntax_paddingCharLen);
        if ((paddingCharCode = paddingChar.charCodeAt(0)) > 127)
            throw SyntaxError(errSyntax_paddingCharMustASCII);
    }
    const _alphabet = new Uint8Array(64)
    for (let code: number, i = 64; i--;) {
        if ((code = alphabet.charCodeAt(i)) > 127)
            throw SyntaxError(errSyntax_alphabetMustASCII);
        if (code === paddingCharCode)
            throw SyntaxError(errSyntax_alphabetNoPaddingChar);
        if (_alphabet.includes(code, i + 1))
            throw SyntaxError(errSyntax_alphabetNoDuplicate);
        _alphabet[i] = code
    }
    return function bytesToBase64(bytes, omitPadding) {
        if (
            !(bytes instanceof Uint8Array) &&
            (typeof bytes != 'object' || !bytes || bytes[Symbol.toStringTag] !== 'Uint8Array')
        ) throw TypeError(errType_inputArgMustUint8Array);
        const il = bytes.length;
        if (!Number.isInteger(il) || il < 0) throw TypeError(errType_inputArgMustUint8Array);
        const out = new Uint8Array(
            omitPadding
                ? Math.ceil(il / 3 * 4)
                : Math.ceil(il / 3) * 4
        );
        let ii = 0
            , oi = 0
            , cache: number // 24b
        while (ii < il) {
            cache = ((bytes[ii++] & 255) << 16) | ((bytes[ii++] & 255) << 8) | (bytes[ii++] & 255)
            out[oi++] = _alphabet[cache >> 18]
            out[oi++] = _alphabet[(cache >> 12) & 63]
            out[oi++] = _alphabet[(cache >> 6) & 63]
            out[oi++] = _alphabet[cache & 63]
        }
        // fill '='
        !omitPadding && (cache = il % 3) && out.fill(paddingCharCode, cache - 3);
        return textDecoder.decode(out)
    }
}

export function make_encode(bytesToBase64: bytesToBase64Func): encodeFunc {
    return function encode(input, omitPadding) {
        return bytesToBase64(
            typeof input == 'string'
                ? textEncoder.encode(input)
                : input
            , omitPadding
        )
    }
}

export function make_decode(alphabet: string, paddingChar?: string): decodeFunc {
    if (typeof alphabet != 'string') throw TypeError(errType_alphabetMustStr);
    if (alphabet.length !== 64) throw SyntaxError(errSyntax_alphabetLen);
    let paddingCharCode = 61 // '='
    if (paddingChar != null) {
        if (typeof paddingChar != 'string')
            throw TypeError(errType_paddingCharMustStr);
        if (paddingChar.length !== 1)
            throw SyntaxError(errSyntax_paddingCharLen);
        if ((paddingCharCode = paddingChar.charCodeAt(0)) > 127)
            throw SyntaxError(errSyntax_paddingCharMustASCII);
    }
    const _alphabet = new Uint8Array(128).fill(255)
    // '\t\n\f\r '
    _alphabet[9] =
        _alphabet[10] =
        _alphabet[12] =
        _alphabet[13] =
        _alphabet[32] = 65;
    for (let code: number, i = 0; i < 64; i++) {
        if ((code = alphabet.charCodeAt(i)) > 127)
            throw SyntaxError(errSyntax_alphabetMustASCII);
        if (code === paddingCharCode)
            throw SyntaxError(errSyntax_alphabetNoPaddingChar);
        if (_alphabet[code] < 64)
            throw SyntaxError(errSyntax_alphabetNoDuplicate);
        _alphabet[code] = i
    }
    _alphabet[paddingCharCode] = 64;
    return function decode(base64) {
        if (typeof base64 != 'string') throw TypeError(errType_inputArgMustStr);
        const b64len = base64.length
            , out = new Uint8Array(b64len * .75 - (
                base64.charCodeAt(b64len - 1) === paddingCharCode &&
                //@ts-ignore
                1 + (base64.charCodeAt(b64len - 2) === paddingCharCode)
            ))
        let n = 0
            , ii = 0
            , oi = 0
            , chunk: number // 24b
            , chunk_n: number // 0~4
            , code: number
        loop1: while (ii < b64len) {
            for (chunk = chunk_n = 0; ;) {
                if ((code = _alphabet[base64.charCodeAt(ii++)]) < 64) {
                    chunk |= code << ((3 - chunk_n) * 6)
                    if (++chunk_n === 4) break;
                } else if (code === 64) {
                    // first '='
                    if (chunk_n < 2) throw SyntaxError(errSyntax_decodeInvalidChar);
                    if (chunk_n === 2) for (; ;) {
                        // must find second '='
                        if (ii >= b64len)
                            throw SyntaxError(errSyntax_decodeInvalidChar);
                        if ((code = _alphabet[base64.charCodeAt(ii++)]) === 64)
                            break; // found
                        if (code !== 65)
                            throw SyntaxError(errSyntax_decodeInvalidChar);
                    }
                    while (ii < b64len) {
                        if ((code = _alphabet[base64.charCodeAt(ii++)]) !== 65)
                            throw SyntaxError(errSyntax_decodeInvalidChar);
                    }
                    break;
                } else if (code !== 65) {
                    // not '\t\n\f\r '
                    throw SyntaxError(errSyntax_decodeInvalidChar);
                }
                if (ii >= b64len) {
                    if (chunk_n === 0) break loop1;
                    if (chunk_n === 1) throw SyntaxError(errSyntax_decodeSingleChar);
                    break;
                }
            }
            out[oi++] = chunk >> 16
            out[oi++] = chunk >> 8
            out[oi++] = chunk
            n += chunk_n - 1;
        }
        return n < out.length
            ? out.subarray(0, n)
            : out
    }
}

export function make_decodeToString(decode: decodeFunc): decodeToStringFunc {
    return function decodeToString(input, _textDecoder) {
        return (_textDecoder || textDecoder).decode(decode(input))
    }
}
