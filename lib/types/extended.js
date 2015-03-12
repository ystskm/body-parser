/***/
module.exports = Parser;
function Parser() {
}

// parser for x-www-urlencode
Parser.parse = parse;

function parse(buf) {

  typeof buf == 'string' || (buf = buf.toString());

  // detect x-www-form-data
  var regkeys = /form-data; name="(\w+)"/;

  // if not detect
  if(!regkeys.test(buf))
    return _parse(buf);

  // parse multi-part form data
  // TODO more large data (two or more frame) ok?
  // TODO check RFC.
  var mulbuf = null, regline = /Content-Disposition: /;
  mulbuf = buf, buf = '';

  mulbuf.split(regline).forEach(function(group, i) {
    if(i === 0)
      return;
    group.split(/\r\n|\r|\n/).forEach(function(line, i) {

      // assume that 5 line consists a group.
      // TODO check standard.
      switch(i) {
      case 1: // (empty line)
      case 3: // ------WebKitFormBoundary6BQAS0QfdLIP6JnR--
      case 4:
        return;
      }

      var is_key = i == 0;
      var li_mtc = (is_key && line.match(regkeys) || '');

      // change to query-like
      if(buf.length)
        buf += is_key ? '&': '=';
      buf += is_key ? li_mtc[1]: line;

    });
  });

  return _parse(buf);
  // << END_OF_CLOSURE <<

  function _parse(str) {

    try {
      str = decodeURIComponent(str);
    } catch(e) {
      // ignore decode failed.
      // for sometimes chrome send JSON without encodedURIComponent.
    }

    //    console.log(require('querystring').parse(str));
    // console.log(str);

    // be careful for the "depth"
    // over the limit, array will looks like a "object"
    // TODO warning in "qs"
    return require('qs').parse(str, {
      depth: 25
    });

  }

}
