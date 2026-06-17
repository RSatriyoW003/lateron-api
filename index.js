const express = require('express');
const app = express();
const cors = require('cors');
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ROUTES
app.use('/users', require('./routes/users'));
app.use('/test-targets', require('./routes/testTargets'));
app.use('/roadmaps', require('./routes/roadmaps'));
app.use('/daily-schedules', require('./routes/dailySchedules'));
app.use('/checklists', require('./routes/checklists'));
app.use('/reminders', require('./routes/reminders'));
app.use('/study-streaks', require('./routes/studyStreaks'));
app.use('/quiz', require('./routes/quizzes')); // â† tambahkan ini
// SERVER
<<<<<<< HEAD
app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});
=======
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});
>>>>>>> 753db4cf2ec0f5b1499383041a2724cb5e82d133
