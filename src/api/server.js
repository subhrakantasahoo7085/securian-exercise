import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.post('/api/add', (req, res) => {
  const { a, b } = req.body;
  res.json({ result: a + b });
});

export default app;
