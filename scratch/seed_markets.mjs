
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'elgrancesar-betting',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mocks = [
  {
    name: 'Real Madrid vs Man City',
    category: 'Champions League',
    startTime: new Date(),
    status: 'LIVE',
    liveTime: '45:00',
    teams: [
      { name: 'Real Madrid', score: 1, odds: 2.10, logo: 'RMA' },
      { name: 'Man City', score: 1, odds: 2.40, logo: 'MCI' }
    ],
    drawOdds: 3.10
  },
  {
    name: 'Arsenal vs Chelsea',
    category: 'Premier League',
    startTime: new Date(),
    status: 'UPCOMING',
    teams: [
      { name: 'Arsenal', odds: 1.85, logo: 'ARS' },
      { name: 'Chelsea', odds: 4.20, logo: 'CHE' }
    ],
    drawOdds: 3.50
  },
  {
    name: 'Kentucky Derby',
    category: 'Hípica',
    startTime: new Date(),
    status: 'UPCOMING',
    teams: [
      { name: 'Thunderbolt', odds: 3.50 },
      { name: 'Silver Streak', odds: 5.00 },
      { name: 'Midnight Run', odds: 8.00 }
    ]
  },
  {
    name: 'Lakers vs Celtics',
    category: 'NBA',
    startTime: new Date(),
    status: 'UPCOMING',
    teams: [
      { name: 'Lakers', odds: 1.90, logo: 'LAL' },
      { name: 'Celtics', odds: 1.90, logo: 'BOS' }
    ]
  }
];

async function seed() {
  console.log('Seeding markets...');
  const marketsCol = collection(db, 'markets');
  for (const m of mocks) {
    await addDoc(marketsCol, m);
    console.log(`Added ${m.name}`);
  }
  console.log('Done!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
