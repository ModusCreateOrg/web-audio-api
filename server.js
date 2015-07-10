var connect = require('connect'),
    serveStatic = require('serve-static');

connect().use(
    serveStatic(__dirname)
).listen(5000);