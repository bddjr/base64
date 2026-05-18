import type {
    Type_bytesToBase64,
    Type_base64ToBytes,
    Type_encode,
    Type_decode,
    Type_decodeToString,
} from '../type.d.ts'

let __textEncoder: TextEncoder | undefined
let __textDecoder: TextDecoder | undefined

export function make_bytesToBase64(alphabet: string): Type_bytesToBase64 {
    if (typeof alphabet != 'string' || alphabet.length !== 64) throw TypeError(`invalid alphabet format`);
    const _alphabet = new Uint8Array(64)
    for (let code, i = 0; i < 64; i++) {
        if ((code = alphabet.charCodeAt(i)) > 127) throw TypeError(`invalid alphabet format`);
        _alphabet[i] = code
    }
    return (bytes, omitPadding) => {
        const il = bytes.length
            , out = new Uint8Array(
                omitPadding
                    ? Math.ceil(il / 3 * 4)
                    : Math.ceil(il / 3) * 4
            )
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
        if (!omitPadding && (cache = il % 3)) {
            // fill '='
            out.fill(61, cache - 3)
        }
        return (__textDecoder ||= new TextDecoder).decode(out)
    }
}

export function make_base64ToBytes(alphabet: string): Type_base64ToBytes {
    if (typeof alphabet != 'string' || alphabet.length !== 64) throw TypeError(`invalid alphabet length`);
    const _alphabet = new Uint8Array(128).fill(64)
    for (let code, i = 0; i < 64; i++) {
        if ((code = alphabet.charCodeAt(i)) > 127) throw TypeError(`invalid alphabet format`);
        _alphabet[code] = i
    }
    return base64 => {
        const b64len = base64.length
            , out = new Uint8Array(b64len * .75 - (
                base64.charCodeAt(b64len - 1) === 61 &&
                1 + ((base64.charCodeAt(b64len - 2) === 61) as any)
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
                }
                if (ii >= b64len) {
                    if (chunk_n < 2) break loop1;
                    break
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

export function make_base64ToBytes_NodeJS(
    base64Write: (this: Uint8Array, base64: string) => number
): Type_base64ToBytes {
    return base64 => {
        const b64len = base64.length
            , out = new Uint8Array(b64len * .75 - (
                base64.charCodeAt(b64len - 1) === 61 &&
                1 + ((base64.charCodeAt(b64len - 2) === 61) as any)
            ))
            , n = base64Write.call(out, base64)
        return n < out.length
            ? out.subarray(0, n)
            : out
    }
}

export function make_encode(toBase64: Type_bytesToBase64): Type_encode {
    return (input, omitPadding) => toBase64(
        typeof input == 'string'
            ? (__textEncoder ||= new TextEncoder).encode(input)
            : input
        , omitPadding
    )
}

export function make_decode(toBytes: Type_base64ToBytes): Type_decode {
    return base64 => toBytes('' + base64)
}

export function make_decodeToString(_decode: Type_decode): Type_decodeToString {
    return (input, textDecoder) =>
        (textDecoder || (__textDecoder ||= new TextDecoder)).decode(_decode(input))
}
