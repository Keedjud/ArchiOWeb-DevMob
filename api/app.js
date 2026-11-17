import express from 'express';

// Express app only: no listen() and no database connection here,
// so tests can import it directly.
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ name: 'BOMB API', status: 'ok' });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Central error handler (Express needs the 4 arguments)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message:
      status >= 500 && isProduction ? 'Internal server error' : err.message,
  });
});

export default app;
