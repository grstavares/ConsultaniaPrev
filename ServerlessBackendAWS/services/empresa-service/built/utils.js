var crypto = require('crypto');
function nodeRNG() {
    return crypto.randomBytes(16);
}
;
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
}
function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    return ([bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]], '-',
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]],
        bth[buf[i++]], bth[buf[i++]]]).join('');
}
function v4(options, buf, offset) {
    var i = buf && offset || 0;
    if (typeof (options) == 'string') {
        buf = options === 'binary' ? new Array(16) : null;
        options = null;
    }
    options = options || {};
    var rnds = options.random || (options.rng || nodeRNG)();
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    if (buf) {
        for (var ii = 0; ii < 16; ++ii) {
            buf[i + ii] = rnds[ii];
        }
    }
    return buf || bytesToUuid(rnds);
}
var uuid = v4;
module.exports = uuid;
