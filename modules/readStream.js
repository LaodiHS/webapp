var fs = require('fs');
var inspect = require('util').inspect;

var buffer = '';
var rs = fs.createReadStream('Chines-to-Englishecdict.csv');
rs.on('data', function(chunk) {
  var lines = (buffer + chunk).split(/\r?\n/g);
  buffer = lines.pop();
  for (var i = 0; i < lines.length; ++i) {
    // do something with `lines[i]`
    console.log('found line: ' + inspect(lines[i]));
  }
});
rs.on('end', function() {
  // optionally process `buffer` here if you want to treat leftover data without
  // a newline as a "line"
  console.log('ended on non-empty buffer: ' + inspect(buffer));
});
