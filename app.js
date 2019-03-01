const express = require('express');
const app = express();
const enforce = require('express-sslify');

// force https
app.use(enforce.HTTPS());

// load static assets
app.use(express.static(__dirname + '/public'));

const server = app.listen(8081, () => {
  console.log(__dirname);
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
})