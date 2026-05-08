if (Uint8Array.fromBase64) {
    console.log('test-buffer')
    delete Uint8Array.fromBase64
    delete Uint8Array.prototype.toBase64
    await import('./test.mjs')
}