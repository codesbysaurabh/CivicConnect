import { env } from '../config/env.js';
import { connectDb, disconnectDb } from '../config/db.js';
import { Complaint } from '../models/Complaint.js';
import { User } from '../models/User.js';
import { Worker } from '../models/Worker.js';

if (process.env.SEED_DEMO_DATA !== 'true') {
  console.log('ℹ Demo data seeding is disabled. Set SEED_DEMO_DATA=true in backend/.env to opt in.');
  process.exit(0);
}

const workerSeeds = [
  { name: 'Ramesh Kumar', area: 'Zone A' },
  { name: 'Sunita Devi', area: 'Zone B' },
  { name: 'Imran Khan', area: 'Zone C' },
  { name: 'Priya Sharma', area: 'Zone D' },
];

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const demoPhoto = (label, color) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#e8eef2"/><rect y="390" width="800" height="210" fill="#34495e"/><path d="M0 470h800" stroke="#f5d76e" stroke-width="12" stroke-dasharray="70 45"/><circle cx="400" cy="260" r="115" fill="${color}" opacity=".18"/><circle cx="400" cy="260" r="72" fill="${color}"/><path d="M400 210v100m-50-50h100" stroke="white" stroke-width="18" stroke-linecap="round"/><text x="400" y="555" text-anchor="middle" font-family="Arial,sans-serif" font-size="32" fill="white">${label}</text></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

await connectDb();
try {
  const workers = await Promise.all(
    workerSeeds.map(({ name, area }) =>
      Worker.findOneAndUpdate(
        { name },
        { $setOnInsert: { name, area, active: true } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );
  const workerByName = new Map(workers.map((worker) => [worker.name, worker]));
  console.log(`✔ Ensured ${workers.length} field workers (${env.nodeEnv})`);

  const reporterEmail = (process.env.DEMO_REPORTER_EMAIL || env.adminEmails[0] || '').toLowerCase();
  const reporter = (reporterEmail ? await User.findOne({ email: reporterEmail }) : null)
    || await User.findOne().sort({ createdAt: 1 });
  if (!reporter) {
    console.log('ℹ Register an account with the app, then rerun npm run backend:seed to add the sample reports.');
  } else {
    const reportSeeds = [
      {
        ticketId: 'CC-DEMO01', category: 'pothole', description: 'Large pothole near the bus stop; it is difficult for cyclists to avoid.',
        status: 'submitted', days: 1, address: 'Green Park Main Road, Zone A', coordinates: [77.2066, 28.5580],
        history: [{ status: 'submitted', note: 'Complaint submitted', at: daysAgo(1) }], worker: null, color: '#db715e',
      },
      {
        ticketId: 'CC-DEMO02', category: 'garbage', description: 'The collection point has overflowed and needs a cleanup.',
        status: 'assigned', days: 2, address: 'Aurobindo Marg, Zone B', coordinates: [77.2000, 28.5550],
        history: [
          { status: 'submitted', note: 'Complaint submitted', at: daysAgo(2) },
          { status: 'assigned', note: 'Assigned to field worker', at: daysAgo(1) },
        ], worker: 'Sunita Devi', color: '#5caa7f',
      },
      {
        ticketId: 'CC-DEMO03', category: 'streetlight', description: 'Streetlight has stopped working on the walking path.',
        status: 'in_progress', days: 4, address: 'Sector 14 walking path, Zone C', coordinates: [77.2120, 28.5620],
        history: [
          { status: 'submitted', note: 'Complaint submitted', at: daysAgo(4) },
          { status: 'assigned', note: 'Assigned to field worker', at: daysAgo(3) },
          { status: 'in_progress', note: 'Repair work started', at: daysAgo(1) },
        ], worker: 'Imran Khan', color: '#d9a441',
      },
      {
        ticketId: 'CC-DEMO04', category: 'water', description: 'A leaking public water pipe is flooding the roadside.',
        status: 'resolved', days: 7, address: 'Market Lane, Zone D', coordinates: [77.1960, 28.5600],
        history: [
          { status: 'submitted', note: 'Complaint submitted', at: daysAgo(7) },
          { status: 'assigned', note: 'Assigned to field worker', at: daysAgo(6) },
          { status: 'in_progress', note: 'Repair work started', at: daysAgo(3) },
          { status: 'resolved', note: 'Leak repaired and area cleaned', at: daysAgo(1) },
        ], worker: 'Priya Sharma', color: '#4a9bc7',
      },
    ];

    const existingSeedCount = await Complaint.countDocuments({ ticketId: /^CC-DEMO/ });
    if (existingSeedCount > 0) {
      console.log(`ℹ Found ${existingSeedCount} existing demo reports; skipped sample report seeding to preserve any intentional deletions.`);
    } else {
      const results = await Promise.all(reportSeeds.map((seed) => {
        const { days, address, coordinates, worker, color, ...report } = seed;
        const resolvedAt = report.status === 'resolved' ? report.history.at(-1).at : undefined;
        return Complaint.updateOne(
          { ticketId: report.ticketId },
          {
            $setOnInsert: {
              ...report,
              reporter: reporter._id,
              photo: { url: demoPhoto(report.category, color) },
              location: { type: 'Point', coordinates, address },
              assignee: worker ? workerByName.get(worker)._id : null,
              resolvedAt,
              createdAt: daysAgo(days),
            },
          },
          { upsert: true }
        );
      }));
      const inserted = results.filter((result) => result.upsertedCount > 0).length;
      console.log(`✔ Seeded ${inserted} sample complaints`);
      if (reporter.role !== 'admin') {
        console.log('ℹ This account can view its sample reports. Register an email listed in ADMIN_EMAILS to manage reports in the admin view.');
      }
    }
  }
} finally {
  await disconnectDb();
}
