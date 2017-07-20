var nodeunit = require('nodeunit');
var extended = require(require('path').resolve(__dirname, '..', 'lib', 'types',
  'extended'));

module.exports = nodeunit.testCase({
  'complex_parse': function(t) {
    var tsa = []
    tsa.push('tactics[0][]=fileUpload');
    tsa.push('tactics[0][1][s_id]=54801dc17ff479754ef83b33');
    tsa.push('tactics[0][1][c_id]=547ffe057ff479754ef83ab8');
    tsa.push('tactics[0][1][file][]=lean.synquery.tgz');
    tsa.push('tactics[1][]=decompressArchive');
    tsa.push('tactics[2][]=buildProject');
    tsa.push('tactics[2][1][s_id]=54801dc17ff479754ef83b33');
    tsa.push('tactics[2][1][c_id]=547ffe057ff479754ef83ab8');
    tsa.push('tactics[2][1][project][lean.synquery][build]=0.7.4');
    tsa.push('tactics[2][1][project][lean.synquery][copy][]=bin');
    tsa.push('tactics[2][1][project][lean.synquery][copy][]=sbin');
    tsa.push('tactics[2][1][project][lean.synquery][upload][mtime]'
      + '=2015-03-12T02:34:34.000Z');
    tsa.push('tactics[2][1][project][lean.synquery][upload][contentType]'
      + '=application/octet-stream');
    tsa.push('tactics[2][1][project][lean.synquery][upload][name]'
      + '=lean.synquery.tgz');
    tsa.push('tactics[2][1][project][lean.synquery][upload][size]=42263');
    tsa.push('tactics[2][1][project][lean.synquery][upload][lastModified]'
      + '=Thu+Mar+12+2015+11:34:34+GMT+0900+(JST)');
    tsa.push('8e5f59a2=548ab42192b438e86f9a2c46');

    var prs = extended.parse(tsa.join('&'));

    // level 0
    t.ok(Array.isArray(prs.tactics));
    t.equals(prs.tactics.length, 3);
    t.equals(prs['8e5f59a2'], '548ab42192b438e86f9a2c46');

    // level 1
    var lev0 = prs.tactics;
    t.ok(Array.isArray(lev0[0]));
    t.equals(lev0[0].length, 2);
    t.ok(Array.isArray(lev0[1]));
    t.equals(lev0[1].length, 1);
    t.ok(Array.isArray(lev0[2]));
    t.equals(lev0[2].length, 2);

    // level2
    var lev00 = lev0[0];
    //console.log('lev00', lev00);
    t.equals(lev00[0], 'fileUpload');
    t.equals(lev00[1].s_id, '54801dc17ff479754ef83b33');
    t.equals(lev00[1].c_id, '547ffe057ff479754ef83ab8');
    t.ok(Array.isArray(lev00[1].file), '.file.isArray');

    var lev01 = lev0[1];
    //console.log('lev01', lev01);
    t.equals(lev01[0], 'decompressArchive');

    var lev02 = lev0[2];
    //console.log('lev02', lev02);
    //console.log('lev02.project', lev02[1].project);
    t.equals(lev02[0], 'buildProject');
    t.equals(lev02[1].s_id, '54801dc17ff479754ef83b33');
    t.equals(lev02[1].c_id, '547ffe057ff479754ef83ab8');
    t.equals(lev02[1].project['lean.synquery'].build, '0.7.4', 'lev02.build');
    t.ok(Array.isArray(lev02[1].project['lean.synquery'].copy), 'lev02.copy');

    t.done();
  }
});
