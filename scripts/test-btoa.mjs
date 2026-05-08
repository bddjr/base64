console.log('test-btoa')
delete global.Buffer
delete Uint8Array.fromBase64
delete Uint8Array.prototype.toBase64
await import('./test.mjs')
