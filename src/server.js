const express = require('express');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.static('./public'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('homepage');
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
