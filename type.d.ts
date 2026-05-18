/**
 * @param omitPadding
 * A boolean specifying whether to omit padding characters (=) at the end of the base64 string.
 * The default is false.
 */
export type Type_bytesToBase64 = (bytes: Uint8Array, omitPadding?: boolean) => string

export type Type_base64ToBytes = (base64: string) => Uint8Array<ArrayBuffer>

export type Type_encode = (input: Uint8Array | string, omitPadding?: boolean) => string

export type Type_decode = Type_base64ToBytes

export type Type_decodeToString = (input: string, textDecoder?: TextDecoder) => string
