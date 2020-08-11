const path = require('path');
const express = require('express');

const app = express();
const publicPath = path.join(__dirname, 'dist');
app.use(express.static(publicPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(3000, () => {
  console.log(`App listening at http://localhost:3000`)
})