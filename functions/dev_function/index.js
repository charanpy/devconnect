const app = require('./app');

app.listen(3001, () => {
  console.log('Server Started');
});

module.exports = app;
