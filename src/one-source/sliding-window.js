const {createStream, createProperty} = require('../patterns/one-source');
const {VALUE} = require('../constants');
const {slide} = require('../utils/collections');

const mixin = {

  _init({min, max}) {
    this._max = max;
    this._min = min;
    this._buff = [];
  },

  _free() {
    this._buff = null;
  },

  _handleValue(x, isCurrent) {
    this._buff = slide(this._buff, x, this._max);
    if (this._buff.length >= this._min) {
      this._send(VALUE, this._buff, isCurrent);
    }
  }

};

exports.SlidingWindowStream = createStream('slidingWindow', mixin);
exports.SlidingWindowProperty = createProperty('slidingWindow', mixin);
