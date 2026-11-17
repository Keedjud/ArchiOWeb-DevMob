import http from 'node:http';
import mongoose from 'mongoose';
import app from '../app.js';
import config from '../config.js';

try {
  await mongoose.connect(config.databaseUrl);
  console.log('Connected to MongoDB');
} catch (err) {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
}

// Explicit HTTP server so WebSockets can be attached to it later.
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}`);
});
