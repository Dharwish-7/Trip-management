import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial default database structure with seed data
const initialData = {
  users: [
    {
      id: "usr-traveler-1",
      email: "traveler@example.com",
      passwordHash: "$2a$10$CHPLgRW64fPkSG3VIP.2KOsrJ06ZPQfCHyQvVYG8ptiR8pn1aFRx.", // "pass123"
      name: "Alex Morgan",
      role: "traveler",
      createdAt: "2026-10-01T10:00:00.000Z"
    },
    {
      id: "usr-traveler-2",
      email: "sarah@example.com",
      passwordHash: "$2a$10$CHPLgRW64fPkSG3VIP.2KOsrJ06ZPQfCHyQvVYG8ptiR8pn1aFRx.", // "pass123"
      name: "Sarah Chen",
      role: "traveler",
      createdAt: "2026-10-05T14:30:00.000Z"
    },
    {
      id: "usr-official-1",
      email: "official@govt.gov",
      passwordHash: "$2a$10$0wdLQ.ZLep5nLW0Iw..Axe45NGjUJOLC6ZKPvsGIgyt2EtjdthCdS", // "admin123"
      name: "Director Robert Hayes",
      role: "official",
      department: "Ministry of Tourism & Civil Aviation",
      createdAt: "2026-09-15T09:00:00.000Z"
    }
  ],
  trips: [
    {
      id: "trip-1",
      userId: "usr-traveler-1",
      travelerName: "Alex Morgan",
      travelerEmail: "traveler@example.com",
      title: "Autumn Expedition Across Kyoto",
      destination: "Kyoto, Japan",
      startDate: "2026-10-02",
      endDate: "2026-10-08",
      purpose: "Cultural heritage and photography expedition",
      budget: 2500,
      description: "Exploration of historic temples, bamboo groves, and traditional tea ceremonies across northern Kyoto.",
      coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      status: "Submitted", // Submitted for government records (GK-12, GK-16)
      submittedAt: "2026-10-09T11:20:00.000Z",
      places: [
        {
          id: "plc-1",
          name: "Fushimi Inari-taisha",
          location: "Fushimi Ward, Kyoto",
          visitDate: "2026-10-03",
          notes: "Walked through thousands of vermilion torii gates early morning before crowds arrived.",
          rating: 5
        },
        {
          id: "plc-2",
          name: "Arashiyama Bamboo Grove",
          location: "Ukyo Ward, Kyoto",
          visitDate: "2026-10-05",
          notes: "Serene towering green bamboo stalks; visited Tenryu-ji temple garden nearby.",
          rating: 4
        },
        {
          id: "plc-3",
          name: "Kinkaku-ji (Golden Pavilion)",
          location: "Kita Ward, Kyoto",
          visitDate: "2026-10-06",
          notes: "Zen Buddhist temple covered in authentic gold leaf reflecting over the pond.",
          rating: 5
        }
      ],
      photos: [
        {
          id: "pht-1",
          url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
          caption: "Morning sunrise at Fushimi Inari shrine path",
          placeName: "Fushimi Inari-taisha",
          uploadedAt: "2026-10-04T12:00:00.000Z"
        },
        {
          id: "pht-2",
          url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
          caption: "Golden Pavilion glowing under clear autumn skies",
          placeName: "Kinkaku-ji",
          uploadedAt: "2026-10-06T15:30:00.000Z"
        }
      ],
      createdAt: "2026-10-01T15:00:00.000Z",
      updatedAt: "2026-10-09T11:20:00.000Z"
    },
    {
      id: "trip-2",
      userId: "usr-traveler-1",
      travelerName: "Alex Morgan",
      travelerEmail: "traveler@example.com",
      title: "Alpine Adventure in Interlaken",
      destination: "Interlaken, Switzerland",
      startDate: "2026-10-12",
      endDate: "2026-10-18",
      purpose: "Hiking & Alpine landscape documentation",
      budget: 3200,
      description: "Breathtaking mountain peaks, glacial valleys, and tranquil alpine lakes in the Bernese Oberland.",
      coverImage: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
      status: "Submitted", // GK-12, GK-16
      submittedAt: "2026-10-19T16:45:00.000Z",
      places: [
        {
          id: "plc-4",
          name: "Jungfraujoch - Top of Europe",
          location: "Bernese Alps, Switzerland",
          visitDate: "2026-10-14",
          notes: "Took the cogwheel train through the Eiger to Europe's highest railway station.",
          rating: 5
        },
        {
          id: "plc-5",
          name: "Lake Brienz Ferry & Iseltwald",
          location: "Lake Brienz, Interlaken",
          visitDate: "2026-10-16",
          notes: "Crystal-clear turquoise waters and quiet fishing village walking path.",
          rating: 4
        }
      ],
      photos: [
        {
          id: "pht-3",
          url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
          caption: "Glacial valley panoramic view from Jungfrau observatory",
          placeName: "Jungfraujoch",
          uploadedAt: "2026-10-15T09:00:00.000Z"
        }
      ],
      createdAt: "2026-10-10T08:30:00.000Z",
      updatedAt: "2026-10-19T16:45:00.000Z"
    },
    {
      id: "trip-3",
      userId: "usr-traveler-2",
      travelerName: "Sarah Chen",
      travelerEmail: "sarah@example.com",
      title: "Mediterranean Coastal Voyage",
      destination: "Amalfi Coast, Italy",
      startDate: "2026-10-15",
      endDate: "2026-10-22",
      purpose: "Culinary and architectural research",
      budget: 2800,
      description: "Picturesque cliffside towns, lemon groves, and stunning coastal drives along the Tyrrhenian Sea.",
      coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      status: "Submitted", // GK-16
      submittedAt: "2026-10-23T10:15:00.000Z",
      places: [
        {
          id: "plc-6",
          name: "Positano Cliffside Viewpoint",
          location: "Positano, Salerno, Italy",
          visitDate: "2026-10-16",
          notes: "Trek along the Path of the Gods overlooking colorful cascading houses.",
          rating: 5
        },
        {
          id: "plc-7",
          name: "Villa Rufolo Gardens",
          location: "Ravello, Italy",
          visitDate: "2026-10-18",
          notes: "Historic estate gardens with sweeping view of the Gulf of Salerno.",
          rating: 5
        }
      ],
      photos: [
        {
          id: "pht-4",
          url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
          caption: "Pastel colored houses overlooking Positano bay",
          placeName: "Positano Cliffside Viewpoint",
          uploadedAt: "2026-10-17T11:00:00.000Z"
        }
      ],
      createdAt: "2026-10-14T09:00:00.000Z",
      updatedAt: "2026-10-23T10:15:00.000Z"
    },
    {
      id: "trip-4",
      userId: "usr-traveler-1",
      travelerName: "Alex Morgan",
      travelerEmail: "traveler@example.com",
      title: "Upcoming Trek in Banff National Park",
      destination: "Banff, Alberta, Canada",
      startDate: "2026-11-05",
      endDate: "2026-11-12",
      purpose: "Wilderness trekking and wildlife photography",
      budget: 1800,
      description: "Draft plan for exploring Lake Louise, Moraine Lake, and Icefields Parkway.",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      status: "Draft", // In-progress / Draft (GK-8, GK-14)
      places: [
        {
          id: "plc-8",
          name: "Lake Louise Shoreline Trail",
          location: "Banff National Park, Canada",
          visitDate: "2026-11-06",
          notes: "Early sunrise hike along the turquoise lake perimeter.",
          rating: 5
        }
      ],
      photos: [],
      createdAt: "2026-10-25T14:00:00.000Z",
      updatedAt: "2026-10-25T14:00:00.000Z"
    }
  ]
};

// Database helper class
class JSONDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_PATH)) {
      this.write(initialData);
    } else {
      try {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        JSON.parse(content);
      } catch (err) {
        console.warn("DB file corrupted or empty, restoring initial seed data...");
        this.write(initialData);
      }
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      this.init();
      return initialData;
    }
  }

  write(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Collection helpers
  getCollection(name) {
    const data = this.read();
    return data[name] || [];
  }

  setCollection(name, items) {
    const data = this.read();
    data[name] = items;
    this.write(data);
  }
}

export const db = new JSONDatabase();
