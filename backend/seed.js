require('dotenv').config();
const mongoose = require('mongoose');
const JobRequest = require('./models/JobRequest');
const connectDB = require('./config/db');

const seedData = [
  {
    title: 'Fix leaking kitchen tap',
    description: 'The kitchen tap has been dripping for a week. Need a plumber to fix it ASAP. The tap is at the sink in the main kitchen.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah.johnson@example.com',
    status: 'Open',
  },
  {
    title: 'Electrical outlet not working',
    description: 'Master bedroom outlet on the west wall stopped working. Cannot determine the cause. Please inspect and repair.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'John Smith',
    contactEmail: 'john.smith@example.com',
    status: 'Open',
  },
  {
    title: 'Paint living room walls',
    description: 'Looking to repaint the living room. Currently cream colored, would like a light blue. About 400 sq ft. High quality paint preferred.',
    category: 'Painting',
    location: 'Aberdeen',
    contactName: 'Margaret Brown',
    contactEmail: 'margaret.brown@example.com',
    status: 'In Progress',
  },
  {
    title: 'Custom door installation',
    description: 'Need a custom wooden door installed in the hallway. Door frame already prepared. Measurements are 36x80 inches.',
    category: 'Joinery',
    location: 'Dundee',
    contactName: 'Robert Wilson',
    contactEmail: 'robert.wilson@example.com',
    status: 'Open',
  },
  {
    title: 'Deck repair and staining',
    description: 'Wooden deck in backyard needs repairs. Some boards are damaged and the whole deck needs staining. About 300 sq ft.',
    category: 'Carpentry',
    location: 'Perth',
    contactName: 'Emma Davis',
    contactEmail: 'emma.davis@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom renovation consultation',
    description: 'Looking to renovate the master bathroom. Need advice on layout and cost estimate. Currently has outdated fixtures.',
    category: 'Other',
    location: 'Stirling',
    contactName: 'Michael Taylor',
    contactEmail: 'michael.taylor@example.com',
    status: 'Closed',
  },
  {
    title: 'Burst pipe emergency repair',
    description: 'Burst pipe under the kitchen sink. Water damage spreading. Need urgent repair. Available for emergency call-out.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Lisa Anderson',
    contactEmail: 'lisa.anderson@example.com',
    status: 'In Progress',
  },
  {
    title: 'Rewire garden shed',
    description: 'Garden shed needs electrical wiring. Want to add lights and power outlets. Shed is 12x10 ft.',
    category: 'Electrical',
    location: 'Edinburgh',
    contactName: 'David Martin',
    contactEmail: 'david.martin@example.com',
    status: 'Open',
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await JobRequest.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert seed data
    const result = await JobRequest.insertMany(seedData);
    console.log(`✅ Successfully seeded ${result.length} jobs`);

    result.forEach((job, index) => {
      console.log(`  ${index + 1}. ${job.title} (${job.category}) - ${job.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seed();
