import { env } from './config/env.js';
import { connectDb, disconnectDb } from './config/db.js';
import { app } from './app.js';

await connectDb();
const server = app.listen(env.port, () =>
  console.log(`✔ API listening on http://localhost:${env.port}/api`)
);

const shutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
};
['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
