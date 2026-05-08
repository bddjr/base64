const _toBase64: (input: Uint8Array) => string = (
    typeof Uint8Array.prototype.toBase64 == 'function' // Node.js v25
        ? i => Uint8Array.prototype.toBase64.call(i)
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64Slice == 'function'
            ? i => Buffer.prototype.base64Slice.call(i) as string
            : i => btoa(String.fromCharCode(...i))
)

const _fromBase64: (input: string) => Uint8Array<ArrayBuffer> = (
    typeof Uint8Array.fromBase64 == 'function' // Node.js v25
        ? Uint8Array.fromBase64
        : typeof Buffer == 'function' && Buffer.prototype && typeof Buffer.prototype.base64Write == 'function'
            ? i => {
                let l = i.length
                if (i.charCodeAt(l - 1) == 61)
                    l -= 1 + ((i.charCodeAt(l - 2) == 61) as any)
                const b = new Uint8Array(l * 3 >>> 2)
                Buffer.prototype.base64Write.call(b, i)
                return b
            }
            : i => Uint8Array.from(atob(i), m => m.charCodeAt(0))
)

export function encode(input: Uint8Array | string): string {
    return _toBase64(
        typeof input == 'string'
            ? new TextEncoder().encode(input)
            : input
    )
}

export function decode(input: string): Uint8Array<ArrayBuffer> {
    return _fromBase64('' + input)
}

export function decodeToString(input: string, textDecoder = new TextDecoder()): string {
    return textDecoder.decode(decode(input))
}

const base64 = {
    encode,
    decode,
    decodeToString
}

export default base64
