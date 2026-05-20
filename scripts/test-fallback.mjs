console.log('test-fallback')
delete global.Buffer
delete Uint8Array.fromBase64
delete Uint8Array.prototype.toBase64
import('./test.mjs')
