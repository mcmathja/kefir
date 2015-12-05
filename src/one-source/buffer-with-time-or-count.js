const {createStream, createProperty} = require('../patterns/one-source');

const mixin = {

  _init({wait, count, flushOnEnd}) {
    this._wait = wait;
    this._count = count;
    this._flushOnEnd = flushOnEnd;
    this._timeoutId = null;
    this._$onTick = () => this._flush();
    this._buff = [];
  },

  _free() {
    this._$onTick = null;
    this._buff = null;
  },

  _flush() {
    clearTimeout(this._timeoutId);
    this._timeoutId = null
    if (this._buff !== null && this._buff.length !== 0) {
      this._emitValue(this._buff);
      this._buff = [];
    }
  },

  _handleValue(x) {
    this._buff.push(x);
    if (this._buff.length >= this._count) {
      this._flush();
    } else if (this._buff.length === 1) {
      this._timeoutId = setTimeout(this._$onTick, this._wait);
    }
  },

  _handleEnd() {
    if (this._flushOnEnd) {
      this._flush();
    }
    this._emitEnd();
  },

  _onDeactivation() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }

    // copied from patterns/one-source
    this._source.offAny(this._$handleAny);
  }

};


const S = createStream('bufferWithTimeOrCount', mixin);
const P = createProperty('bufferWithTimeOrCount', mixin);

module.exports = function bufferWithTimeOrCount(obs, wait, count, {flushOnEnd = true} = {}) {
  return new (obs._ofSameType(S, P))(obs, {wait, count, flushOnEnd});
};
