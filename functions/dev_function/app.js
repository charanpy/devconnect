const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: '*' }));

app.use((req, res, next) => {
  const initializeCatalyst = catalyst.initialize(req);
  req.catalyst = initializeCatalyst;
  // req.user = { id: '9044000000012279' };
  next();
});

const errorController = require('./controllers/error.controller');
const authRoutes = require('./routers/auth.route');
const profileRoutes = require('./routers/profile.route');
const projectRoutes = require('./routers/project.route');
const postRoutes = require('./routers/post.route');
const likeRoutes = require('./routers/like.route');
const commentRoutes = require('./routers/comment.route');
const resourceRoutes = require('./routers/resource.route');
const groupRoutes = require('./routers/group.route');
const messageRoutes = require('./routers/message.route');

app.get('/', () => {
  return res.status(200).json('hi');
});
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/like', likeRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/resource', resourceRoutes);
app.use('/api/v1/group', groupRoutes);
app.use('/api/v1/message', messageRoutes);

app.use(errorController);

module.exports = app;
