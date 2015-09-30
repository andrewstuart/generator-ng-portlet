var fs = require('fs');
var path = require('path');
var license = fs.readFileSync(path.resolve(__dirname, 'LICENSE.txt')).toString();

module.exports = function(opts) {
  opts = opts || {};
  opts.head = opts.head === undefined ? '/*' : opts.head;
  opts.mid = opts.mid === undefined ? ' *' : opts.mid;
  opts.tail = opts.tail === undefined ? '*/' : opts.tail;

  return [opts.head].concat(
    license.split('\n')).join('\n' + opts.mid) + '\n' + opts.tail;
};
