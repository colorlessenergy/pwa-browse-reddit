const express = require('express');
const app = express();

// load static assets
app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
})