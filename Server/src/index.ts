import express from 'express';
import exampleRoute from './routes/test';

const app = express();
const port = 3000;

app.use('/test', exampleRoute);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});