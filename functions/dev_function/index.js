const app = require('./app');

app.listen(process.env.PORT || 3001, () => {
  console.log('Server Started');
});

module.exports = app;


 // "source": "client/build",
    // "ignore": [],
    // "scripts": {
    //   "packageJson": "cd client && copy client-package.json build",
    //   "build": "cd client && npm install && npm run build",
    //   "preserve": "catalyst run client:build && catalyst run client:packageJson",
    //   "predeploy": "catalyst run client:build && catalyst run client:packageJson"
    // }