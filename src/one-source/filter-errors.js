const {createStream, createProperty} = require('../patterns/one-source');
const {ERROR} = require('../constants');

const mixin = {

  _init({fn}) {
    this._fn = fn;
  },

  _free() {
    this._fn = null;
  },

  _handleError(x, isCurrent) {
    if (this._fn(x)) {
      this._send(ERROR, x, isCurrent);
    }
  }

};

exports.FilterErrorsStream = createStream('filterErrors', mixin);
exports.FilterErrorsProperty = createProperty('filterErrors', mixin);
