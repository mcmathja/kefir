const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE, NOTHING} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
    this._prev = NOTHING;
  },

  _free() {
    this._fn = null;
    this._prev = null;
  },

  _handleValue(x, isCurrent) {
    if (this._prev === NOTHING || !this._fn(this._prev, x)) {
      this._prev = x;
      this._send(VALUE, x, isCurrent);
    }
  }

};

exports.SkipDuplicatesStream = createStream('skipDuplicates', mixin);
exports.SkipDuplicatesProperty = createProperty('skipDuplicates', mixin);
