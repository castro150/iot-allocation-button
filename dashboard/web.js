let gzippo = require('gzippo');
let express = require('express');
let app = express();

app.use(gzippo.staticGzip('' + __dirname + '/dist'));
let port = process.env.PORT || 9000;
app.listen(port);
console.log('Listening on port ' + port);
