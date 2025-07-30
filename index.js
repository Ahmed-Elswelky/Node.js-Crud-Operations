const express = require('express');
const app = express();
const coursesRoutes = require('./routes/coursesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoute');
const notificationsRoute = require('./routes/notificationsRoute');
const cors = require('cors');
const httpStatus = require('./utils/httpStatus');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use('/api/courses', coursesRoutes) ;
app.use('/api/users', usersRoutes) ;
app.use('/api/auth', authRoutes) ;
// app.use('/api/notifications', notificationsRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use((err, req, res, next) => {
  // console.error(err.stack);
  res.status(httpStatus.ERROR.code).json({ status: httpStatus.ERROR.message, message: err.message });
});

// app.all('*', (req, res) => {
//   res.status(404).json({ status: 'error', message: 'Not Found' });
// });


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});