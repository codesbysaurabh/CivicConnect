import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import { Worker } from '../models/Worker.js';

const workers = [
  { name: 'Ramesh Kumar', area: 'Zone A' },
  { name: 'Sunita Devi', area: 'Zone B' },
  { name: 'Imran Khan', area: 'Zone C' },
  { name: 'Priya Sharma', area: 'Zone D' },
];

await connectDb();
for (const w of workers)
  await Worker.updateOne({ name: w.name }, { $setOnInsert: w }, { upsert: true });
console.log(`✔ Seeded ${workers.length} field workers (${env.nodeEnv})`);
await disconnectDb();
