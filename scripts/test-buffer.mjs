console.log('test-buffer')
if (!Uint8Array.fromBase64) {
    console.log('skip')
    console.log()
    process.exit()
}
delete Uint8Array.fromBase64
delete Uint8Array.prototype.toBase64
import('./test.mjs')
