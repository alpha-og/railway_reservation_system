import { queryDB } from "./db.js";

const seedData = {
  roles: [{ name: "admin" }, { name: "customer" }],

  coachTypes: [
    { name: "Sleeper Class" },
    { name: "AC 3 Tier" },
    { name: "AC 2 Tier" },
    { name: "AC 1 Tier" },
    { name: "General" },
    { name: "AC Chair Car" },
  ],

  seatTypes: [
    { name: "Lower Berth", description: "Lower sleeping berth" },
    { name: "Middle Berth", description: "Middle sleeping berth" },
    { name: "Upper Berth", description: "Upper sleeping berth" },
    { name: "Side Lower", description: "Side lower berth" },
    { name: "Side Upper", description: "Side upper berth" },
    { name: "Chair", description: "Sitting chair" },
  ],

  bookingStatuses: [
    { name: "Confirmed" },
    { name: "Waiting" },
    { name: "RAC" },
    { name: "Cancelled" },
  ],

  paymentStatuses: [
    { name: "Pending" },
    { name: "Completed" },
    { name: "Failed" },
    { name: "Refunded" },
  ],

  refundStatuses: [
    { name: "Requested" },
    { name: "Processing" },
    { name: "Completed" },
    { name: "Rejected" },
  ],

  stations: [
    { name: "New Delhi Railway Station", code: "NDLS", city: "New Delhi" },
    { name: "Mumbai Central", code: "BCT", city: "Mumbai" },
    { name: "Howrah Junction", code: "HWH", city: "Kolkata" },
    { name: "Chennai Central", code: "MAS", city: "Chennai" },
    { name: "Bengaluru City Junction", code: "SBC", city: "Bengaluru" },
    { name: "Secunderabad Junction", code: "SC", city: "Hyderabad" },
    { name: "Pune Junction", code: "PUNE", city: "Pune" },
    { name: "Ahmedabad Junction", code: "ADI", city: "Ahmedabad" },
    { name: "Jaipur Junction", code: "JP", city: "Jaipur" },
    { name: "Lucknow Charbagh", code: "LKO", city: "Lucknow" },
  ],

  trains: [
    // Premium Express Trains
    { name: "Rajdhani Express", code: "12301" },
    { name: "New Delhi Rajdhani", code: "12951" },
    { name: "Mumbai Rajdhani", code: "12953" },
    
    // Shatabdi Express Services
    { name: "Shatabdi Express", code: "12002" },
    { name: "New Delhi Shatabdi", code: "12017" },
    { name: "Habibganj Shatabdi", code: "12059" },
    
    // Duronto Express Services
    { name: "Duronto Express", code: "12259" },
    { name: "Sealdah Duronto", code: "12273" },
    { name: "Mumbai Duronto", code: "12267" },
    
    // Garib Rath Services
    { name: "Garib Rath", code: "12215" },
    { name: "Poorva Garib Rath", code: "12553" },
    { name: "Sampark Garib Rath", code: "12565" },
    
    // Jan Shatabdi Services
    { name: "Jan Shatabdi", code: "12023" },
    { name: "Gomti Jan Shatabdi", code: "12055" },
    { name: "Kerala Jan Shatabdi", code: "12081" },
    
    // Modern Express Trains
    { name: "Humsafar Express", code: "22405" },
    { name: "Tejas Express", code: "22119" },
    { name: "Vande Bharat Express", code: "22435" },
    { name: "Gatiman Express", code: "12049" },
    
    // Superfast Express
    { name: "Chennai Mail", code: "12615" },
    { name: "Grand Trunk Express", code: "12615" },
    { name: "Howrah Mail", code: "12809" },
    { name: "Karnataka Express", code: "12627" },
    { name: "Punjab Mail", code: "12137" },
    { name: "Konkan Kanya Express", code: "10111" },
    
    // Additional Express Services
    { name: "Intercity Express", code: "12015" },
    { name: "Double Decker Express", code: "12273" },
    { name: "Superfast Express", code: "12649" },
    { name: "Mail Express", code: "11077" },
    { name: "Passenger Express", code: "56473" },
  ],

  // Station distances in kilometers - realistic distances between major Indian cities
  stationDistances: [
    // Delhi routes
    { from: "NDLS", to: "JP", distance: 308 },      // Delhi to Jaipur
    { from: "NDLS", to: "LKO", distance: 556 },     // Delhi to Lucknow
    { from: "NDLS", to: "ADI", distance: 934 },     // Delhi to Ahmedabad
    { from: "NDLS", to: "BCT", distance: 1384 },    // Delhi to Mumbai
    { from: "NDLS", to: "SC", distance: 1579 },     // Delhi to Hyderabad
    { from: "NDLS", to: "MAS", distance: 2180 },    // Delhi to Chennai
    { from: "NDLS", to: "SBC", distance: 2444 },    // Delhi to Bangalore
    { from: "NDLS", to: "HWH", distance: 1441 },    // Delhi to Kolkata
    
    // Mumbai routes
    { from: "BCT", to: "PUNE", distance: 192 },     // Mumbai to Pune
    { from: "BCT", to: "ADI", distance: 545 },      // Mumbai to Ahmedabad
    { from: "BCT", to: "SC", distance: 713 },       // Mumbai to Hyderabad
    { from: "BCT", to: "SBC", distance: 1279 },     // Mumbai to Bangalore
    { from: "BCT", to: "MAS", distance: 1279 },     // Mumbai to Chennai
    { from: "BCT", to: "HWH", distance: 1968 },     // Mumbai to Kolkata
    
    // Other major routes
    { from: "JP", to: "ADI", distance: 626 },       // Jaipur to Ahmedabad
    { from: "PUNE", to: "SBC", distance: 840 },     // Pune to Bangalore
    { from: "SC", to: "SBC", distance: 612 },       // Hyderabad to Bangalore
    { from: "SC", to: "MAS", distance: 625 },       // Hyderabad to Chennai
    { from: "SBC", to: "MAS", distance: 362 },      // Bangalore to Chennai
    { from: "HWH", to: "MAS", distance: 1663 },     // Kolkata to Chennai
    { from: "LKO", to: "HWH", distance: 585 },      // Lucknow to Kolkata
  ],
};

const seedTable = async (tableName, data, options = {}) => {
  console.log(`Seeding ${tableName}...`);

  for (const item of data) {
    const checkColumn = options.checkColumn || "name";
    const hasTimestamps = options.hasTimestamps !== false;

    // Check if record already exists
    const existsQuery = `SELECT id FROM ${tableName} WHERE ${checkColumn} = $1`;
    const existsResult = await queryDB(existsQuery, [item[checkColumn]]);

    if (existsResult.rows.length > 0) {
      console.log(`  - ${item[checkColumn]} already exists in ${tableName}`);
      continue;
    }

    // Insert new record
    const columns = Object.keys(item);
    const values = Object.values(item);

    if (hasTimestamps) {
      columns.push("created_at", "updated_at");
      values.push("NOW()", "NOW()");
    }

    const placeholders = values
      .map((_, index) => {
        if (values[index] === "NOW()") return "NOW()";
        return `$${values.filter((_, i) => i < index && values[i] !== "NOW()").length + 1}`;
      })
      .join(", ");

    const actualValues = values.filter((v) => v !== "NOW()");

    const query = `
      INSERT INTO ${tableName} (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, actualValues);
      if (result.rows.length > 0) {
        console.log(`  ✓ Inserted ${item[checkColumn]} into ${tableName}`);
      }
    } catch (error) {
      console.error(
        `  ✗ Error inserting ${item[checkColumn]} into ${tableName}:`,
        error.message,
      );
    }
  }
};

const seedFareRates = async () => {
  console.log("Seeding fare_rates...");

  const coachTypesResult = await queryDB("SELECT id, name FROM coach_types");
  const trainsResult = await queryDB("SELECT id, name FROM trains");

  if (coachTypesResult.rows.length === 0 || trainsResult.rows.length === 0) {
    console.log("  - Skipping fare_rates (missing coach_types or trains)");
    return;
  }

  const fareRates = [];

  for (const train of trainsResult.rows) {
    for (const coachType of coachTypesResult.rows) {
      let ratePerKm = 1.0;

      switch (coachType.name) {
        case "AC 1 Tier":
          ratePerKm = 5.0;
          break;
        case "AC 2 Tier":
          ratePerKm = 3.5;
          break;
        case "AC 3 Tier":
          ratePerKm = 2.5;
          break;
        case "AC Chair Car":
          ratePerKm = 2.0;
          break;
        case "Sleeper Class":
          ratePerKm = 1.5;
          break;
        case "General":
          ratePerKm = 0.5;
          break;
      }

      fareRates.push({
        train_id: train.id,
        coach_type_id: coachType.id,
        rate_per_km: ratePerKm,
      });
    }
  }

  for (const fareRate of fareRates) {
    // Check if fare rate already exists
    const existsQuery = `SELECT id FROM fare_rates WHERE train_id = $1 AND coach_type_id = $2`;
    const existsResult = await queryDB(existsQuery, [
      fareRate.train_id,
      fareRate.coach_type_id,
    ]);

    if (existsResult.rows.length > 0) {
      continue;
    }

    const query = `
      INSERT INTO fare_rates (train_id, coach_type_id, rate_per_km, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        fareRate.train_id,
        fareRate.coach_type_id,
        fareRate.rate_per_km,
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Inserted fare rate for train/coach type combination`);
      }
    } catch (error) {
      console.error(`  ✗ Error inserting fare rate:`, error.message);
    }
  }
};

const seedUsers = async () => {
  console.log("Seeding users...");

  const rolesResult = await queryDB("SELECT id, name FROM roles");

  if (rolesResult.rows.length === 0) {
    console.log("  - Skipping users (no roles found)");
    return;
  }

  const adminRole = rolesResult.rows.find((role) => role.name === "admin");
  const customerRole = rolesResult.rows.find(
    (role) => role.name === "customer",
  );

  if (!adminRole || !customerRole) {
    console.log("  - Skipping users (admin or customer role not found)");
    return;
  }

  const users = [
    {
      name: "System Administrator",
      email: "admin@railway.com",
      password_hash:
        "$2a$12$aaAzwXNi593UQjovDY8xsOSAvO.Xq7aFlBt9lpd3Yf2FwgTQTkWlG", // password: admin123
      role_id: adminRole.id,
    },
    {
      name: "John Doe",
      email: "john.doe@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Raj Patel",
      email: "raj.patel@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Amit Kumar",
      email: "amit.kumar@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Sneha Gupta",
      email: "sneha.gupta@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Vikram Singh",
      email: "vikram.singh@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
    {
      name: "Anita Desai",
      email: "anita.desai@example.com",
      password_hash:
        "$2b$10$anVmjcJPR9v.jMwJRUvbx.KxGbfpC5XJuVCezCvc0a006249AlxN6", // password: password
      role_id: customerRole.id,
    },
  ];

  for (const user of users) {
    // Check if user already exists
    const existsQuery = `SELECT id FROM users WHERE email = $1`;
    const existsResult = await queryDB(existsQuery, [user.email]);

    if (existsResult.rows.length > 0) {
      console.log(`  - User ${user.email} already exists`);
      continue;
    }

    const query = `
      INSERT INTO users (name, email, password_hash, role_id, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        user.name,
        user.email,
        user.password_hash,
        user.role_id,
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Inserted user ${user.email}`);
      }
    } catch (error) {
      console.error(`  ✗ Error inserting user ${user.email}:`, error.message);
    }
  }
};

const seedSchedules = async () => {
  console.log("Seeding schedules for next 30 days starting from today...");

  const trainsResult = await queryDB("SELECT id, name, code FROM trains");

  if (trainsResult.rows.length === 0) {
    console.log("  - Skipping schedules (no trains found)");
    return;
  }

  const today = new Date();
  const schedules = [];

  // Define train frequency patterns based on service type
  const trainFrequencyPatterns = {
    // Daily premium services
    "12301": { frequency: 1, baseTimes: ["16:55:00"] }, // Rajdhani Express
    "12951": { frequency: 1, baseTimes: ["17:30:00"] }, // New Delhi Rajdhani
    "12002": { frequency: 1, baseTimes: ["06:00:00"] }, // Shatabdi Express
    "12017": { frequency: 1, baseTimes: ["15:30:00"] }, // New Delhi Shatabdi
    "22435": { frequency: 1, baseTimes: ["06:00:00"] }, // Vande Bharat Express
    "12049": { frequency: 1, baseTimes: ["08:10:00"] }, // Gatiman Express
    "22119": { frequency: 1, baseTimes: ["15:50:00"] }, // Tejas Express

    // Bi-weekly premium services (every 2 days)
    "12953": { frequency: 2, baseTimes: ["18:15:00"] }, // Mumbai Rajdhani
    "22405": { frequency: 2, baseTimes: ["14:25:00"] }, // Humsafar Express
    "12059": { frequency: 2, baseTimes: ["07:15:00"] }, // Habibganj Shatabdi

    // Tri-weekly services (every 3 days)
    "12259": { frequency: 3, baseTimes: ["22:30:00"] }, // Duronto Express
    "12273": { frequency: 3, baseTimes: ["07:40:00"] }, // Sealdah Duronto
    "12267": { frequency: 3, baseTimes: ["22:00:00"] }, // Mumbai Duronto
    "12215": { frequency: 3, baseTimes: ["23:45:00"] }, // Garib Rath
    "12553": { frequency: 3, baseTimes: ["21:15:00"] }, // Poorva Garib Rath
    "12565": { frequency: 3, baseTimes: ["19:30:00"] }, // Sampark Garib Rath

    // Weekly services (every 7 days)
    "12023": { frequency: 7, baseTimes: ["05:30:00"] }, // Jan Shatabdi
    "12055": { frequency: 7, baseTimes: ["06:15:00"] }, // Gomti Jan Shatabdi
    "12081": { frequency: 7, baseTimes: ["14:45:00"] }, // Kerala Jan Shatabdi

    // Express services (alternate days)
    "12615": { frequency: 2, baseTimes: ["20:30:00"] }, // Chennai Mail
    "12809": { frequency: 2, baseTimes: ["19:45:00"] }, // Howrah Mail
    "12627": { frequency: 2, baseTimes: ["21:50:00"] }, // Karnataka Express
    "12137": { frequency: 2, baseTimes: ["22:15:00"] }, // Punjab Mail

    // Regular services (every 3 days)
    "10111": { frequency: 3, baseTimes: ["16:20:00"] }, // Konkan Kanya Express
    "12015": { frequency: 3, baseTimes: ["17:20:00"] }, // Intercity Express
    "12649": { frequency: 3, baseTimes: ["18:40:00"] }, // Superfast Express

    // Local services (daily but different times)
    "11077": { frequency: 1, baseTimes: ["06:30:00", "14:15:00", "20:45:00"] }, // Mail Express
    "56473": { frequency: 1, baseTimes: ["05:15:00", "11:30:00", "16:05:00", "21:20:00"] }, // Passenger Express
  };

  // Generate schedules for next 30 days starting from today
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + dayOffset);
    
    for (const train of trainsResult.rows) {
      const pattern = trainFrequencyPatterns[train.code];
      if (!pattern) continue;

      // Check if train should run on this day based on frequency
      const shouldRun = dayOffset % pattern.frequency === (train.code.charCodeAt(0) % pattern.frequency);
      
      if (shouldRun) {
        // Multiple departure times for some trains
        for (const departureTime of pattern.baseTimes) {
          schedules.push({
            train_id: train.id,
            departure_date: scheduleDate.toISOString().split('T')[0],
            departure_time: departureTime
          });
        }
      }
    }
  }

  console.log(`  - Generated ${schedules.length} schedules to insert`);

  const insertedSchedules = [];
  let insertedCount = 0;

  for (const schedule of schedules) {
    if (!schedule.train_id) {
      console.log(`  - Train not found for schedule, skipping`);
      continue;
    }

    // Check if schedule already exists
    const existsQuery = `SELECT id FROM schedules WHERE train_id = $1 AND departure_date = $2 AND departure_time = $3`;
    const existsResult = await queryDB(existsQuery, [
      schedule.train_id,
      schedule.departure_date,
      schedule.departure_time,
    ]);

    if (existsResult.rows.length > 0) {
      insertedSchedules.push(existsResult.rows[0]);
      continue;
    }

    const query = `
      INSERT INTO schedules (train_id, departure_date, departure_time, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, train_id, departure_date;
    `;

    try {
      const result = await queryDB(query, [
        schedule.train_id,
        schedule.departure_date,
        schedule.departure_time,
      ]);

      if (result.rows.length > 0) {
        insertedCount++;
        if (insertedCount % 50 === 0) {
          console.log(`  ✓ Inserted ${insertedCount} schedules...`);
        }
        insertedSchedules.push(result.rows[0]);
      }
    } catch (error) {
      console.error(`  ✗ Error inserting schedule:`, error.message);
    }
  }

  console.log(`  ✓ Successfully inserted ${insertedCount} schedules for next 30 days`);
  return insertedSchedules;
};

const seedScheduleStops = async () => {
  console.log("Seeding schedule_stops...");

  const schedulesResult = await queryDB(`
    SELECT s.id, s.train_id, t.code, t.name 
    FROM schedules s 
    JOIN trains t ON s.train_id = t.id
  `);
  const stationsResult = await queryDB("SELECT id, name, code FROM stations");

  if (schedulesResult.rows.length === 0 || stationsResult.rows.length === 0) {
    console.log("  - Skipping schedule_stops (missing schedules or stations)");
    return;
  }

  // Enhanced route definitions with multiple trains serving similar routes
  const routeDefinitions = {
    // Delhi to Mumbai routes
    "12301": { // Rajdhani Express
      stations: ["NDLS", "JP", "ADI", "BCT"],
      times: [
        { arrival: "16:55:00", departure: "16:55:00" },
        { arrival: "21:30:00", departure: "21:40:00" },
        { arrival: "05:15:00", departure: "05:25:00" },
        { arrival: "12:30:00", departure: "12:30:00" },
      ],
    },
    "12951": { // New Delhi Rajdhani (alternate timing)
      stations: ["NDLS", "JP", "ADI", "BCT"],
      times: [
        { arrival: "17:30:00", departure: "17:30:00" },
        { arrival: "22:15:00", departure: "22:25:00" },
        { arrival: "05:50:00", departure: "06:00:00" },
        { arrival: "13:15:00", departure: "13:15:00" },
      ],
    },
    "12259": { // Duronto Express (Delhi to Mumbai via different route)
      stations: ["NDLS", "ADI", "PUNE", "BCT"],
      times: [
        { arrival: "22:30:00", departure: "22:30:00" },
        { arrival: "08:15:00", departure: "08:25:00" },
        { arrival: "16:20:00", departure: "16:30:00" },
        { arrival: "19:45:00", departure: "19:45:00" },
      ],
    },

    // Delhi to Jaipur routes  
    "12002": { // Shatabdi Express
      stations: ["NDLS", "JP"],
      times: [
        { arrival: "06:00:00", departure: "06:00:00" },
        { arrival: "10:45:00", departure: "10:45:00" },
      ],
    },
    "12017": { // New Delhi Shatabdi (evening service)
      stations: ["NDLS", "JP"],
      times: [
        { arrival: "15:30:00", departure: "15:30:00" },
        { arrival: "20:15:00", departure: "20:15:00" },
      ],
    },
    "12049": { // Gatiman Express (fastest to Jaipur)
      stations: ["NDLS", "JP"],
      times: [
        { arrival: "08:10:00", departure: "08:10:00" },
        { arrival: "12:00:00", departure: "12:00:00" },
      ],
    },

    // Delhi to Chennai routes
    "12215": { // Garib Rath
      stations: ["NDLS", "SC", "MAS"],
      times: [
        { arrival: "23:45:00", departure: "23:45:00" },
        { arrival: "20:30:00", departure: "20:40:00" },
        { arrival: "06:15:00", departure: "06:15:00" },
      ],
    },
    "12615": { // Chennai Mail
      stations: ["NDLS", "SC", "MAS"],
      times: [
        { arrival: "20:30:00", departure: "20:30:00" },
        { arrival: "18:15:00", departure: "18:25:00" },
        { arrival: "04:30:00", departure: "04:30:00" },
      ],
    },

    // Delhi to Lucknow routes
    "12023": { // Jan Shatabdi
      stations: ["NDLS", "LKO"],
      times: [
        { arrival: "05:30:00", departure: "05:30:00" },
        { arrival: "11:45:00", departure: "11:45:00" },
      ],
    },
    "12055": { // Gomti Jan Shatabdi
      stations: ["NDLS", "LKO"],
      times: [
        { arrival: "06:15:00", departure: "06:15:00" },
        { arrival: "12:30:00", departure: "12:30:00" },
      ],
    },

    // Mumbai to Pune routes
    "12273": { // Double Decker Express
      stations: ["BCT", "PUNE"],
      times: [
        { arrival: "07:40:00", departure: "07:40:00" },
        { arrival: "11:15:00", departure: "11:15:00" },
      ],
    },
    "12015": { // Intercity Express
      stations: ["BCT", "PUNE"],
      times: [
        { arrival: "17:20:00", departure: "17:20:00" },
        { arrival: "20:55:00", departure: "20:55:00" },
      ],
    },

    // Mumbai to Bangalore routes
    "12627": { // Karnataka Express
      stations: ["BCT", "PUNE", "SC", "SBC"],
      times: [
        { arrival: "21:50:00", departure: "21:50:00" },
        { arrival: "01:35:00", departure: "01:45:00" },
        { arrival: "14:20:00", departure: "14:30:00" },
        { arrival: "21:15:00", departure: "21:15:00" },
      ],
    },
    "22405": { // Humsafar Express
      stations: ["BCT", "PUNE", "SBC"],
      times: [
        { arrival: "14:25:00", departure: "14:25:00" },
        { arrival: "18:10:00", departure: "18:20:00" },
        { arrival: "04:45:00", departure: "04:45:00" },
      ],
    },

    // Mumbai to Kolkata routes
    "12267": { // Mumbai Duronto
      stations: ["BCT", "SC", "HWH"],
      times: [
        { arrival: "22:00:00", departure: "22:00:00" },
        { arrival: "16:30:00", departure: "16:40:00" },
        { arrival: "07:20:00", departure: "07:20:00" },
      ],
    },
    "12809": { // Howrah Mail
      stations: ["BCT", "SC", "HWH"],
      times: [
        { arrival: "19:45:00", departure: "19:45:00" },
        { arrival: "14:15:00", departure: "14:25:00" },
        { arrival: "05:05:00", departure: "05:05:00" },
      ],
    },

    // Premium modern services
    "22435": { // Vande Bharat Express (Delhi-Jaipur)
      stations: ["NDLS", "JP"],
      times: [
        { arrival: "06:00:00", departure: "06:00:00" },
        { arrival: "09:30:00", departure: "09:30:00" },
      ],
    },
    "22119": { // Tejas Express (Mumbai-Pune)
      stations: ["BCT", "PUNE"],
      times: [
        { arrival: "15:50:00", departure: "15:50:00" },
        { arrival: "19:25:00", departure: "19:25:00" },
      ],
    },
  };

  for (const schedule of schedulesResult.rows) {
    const route = routeDefinitions[schedule.code];
    if (!route) {
      console.log(`  - No route definition found for train ${schedule.code}, skipping`);
      continue;
    }

    for (let stopIndex = 0; stopIndex < route.stations.length; stopIndex++) {
      const stationCode = route.stations[stopIndex];
      const timeInfo = route.times[stopIndex];

      const station = stationsResult.rows.find((s) => s.code === stationCode);
      if (!station) {
        console.log(`  - Station ${stationCode} not found, skipping`);
        continue;
      }

      // Check if schedule stop already exists
      const existsQuery = `SELECT id FROM schedule_stops WHERE schedule_id = $1 AND station_id = $2 AND stop_number = $3`;
      const existsResult = await queryDB(existsQuery, [
        schedule.id,
        station.id,
        stopIndex + 1,
      ]);

      if (existsResult.rows.length > 0) {
        console.log(
          `  - Schedule stop ${stopIndex + 1} for ${station.name} already exists`,
        );
        continue;
      }

      const query = `
        INSERT INTO schedule_stops (schedule_id, station_id, stop_number, arrival_time, departure_time, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING id;
      `;

      try {
        const result = await queryDB(query, [
          schedule.id,
          station.id,
          stopIndex + 1,
          timeInfo.arrival,
          timeInfo.departure,
        ]);

        if (result.rows.length > 0) {
          console.log(
            `  ✓ Inserted schedule stop ${stopIndex + 1} for ${station.name} (${schedule.name})`,
          );
        }
      } catch (error) {
        console.error(
          `  ✗ Error inserting schedule stop for ${station.name}:`,
          error.message,
        );
      }
    }
  }
};

const seedStationDistances = async () => {
  console.log("Seeding station_distances...");

  const stationsResult = await queryDB("SELECT id, code FROM stations");
  if (stationsResult.rows.length === 0) {
    console.log("  - Skipping station_distances (no stations found)");
    return;
  }

  for (const distanceData of seedData.stationDistances) {
    const fromStation = stationsResult.rows.find(s => s.code === distanceData.from);
    const toStation = stationsResult.rows.find(s => s.code === distanceData.to);

    if (!fromStation || !toStation) {
      console.log(`  - Stations ${distanceData.from} or ${distanceData.to} not found, skipping`);
      continue;
    }

    // Check if distance already exists (in either direction)
    const existsQuery = `
      SELECT id FROM station_distances 
      WHERE (from_station_id = $1 AND to_station_id = $2) 
         OR (from_station_id = $2 AND to_station_id = $1)
    `;
    const existsResult = await queryDB(existsQuery, [fromStation.id, toStation.id]);

    if (existsResult.rows.length > 0) {
      console.log(`  - Distance between ${distanceData.from} and ${distanceData.to} already exists`);
      continue;
    }

    const query = `
      INSERT INTO station_distances (from_station_id, to_station_id, distance, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [fromStation.id, toStation.id, distanceData.distance]);
      if (result.rows.length > 0) {
        console.log(`  ✓ Inserted distance ${distanceData.from} -> ${distanceData.to}: ${distanceData.distance}km`);
      }
    } catch (error) {
      console.error(`  ✗ Error inserting distance ${distanceData.from} -> ${distanceData.to}:`, error.message);
    }
  }
};

const seedCoaches = async () => {
  console.log("Seeding coaches...");

  const trainsResult = await queryDB("SELECT id, code FROM trains");
  const coachTypesResult = await queryDB("SELECT id, name FROM coach_types");

  if (trainsResult.rows.length === 0 || coachTypesResult.rows.length === 0) {
    console.log("  - Skipping coaches (missing trains or coach types)");
    return;
  }

  // Enhanced coach compositions for different train types
  const coachCompositions = {
    // Premium Rajdhani services
    "12301": [ // Rajdhani Express
      { type: "AC 1 Tier", count: 2, prefix: "H" },
      { type: "AC 2 Tier", count: 4, prefix: "A" },
      { type: "AC 3 Tier", count: 6, prefix: "B" },
    ],
    "12951": [ // New Delhi Rajdhani
      { type: "AC 1 Tier", count: 3, prefix: "H" },
      { type: "AC 2 Tier", count: 5, prefix: "A" },
      { type: "AC 3 Tier", count: 8, prefix: "B" },
    ],
    "12953": [ // Mumbai Rajdhani
      { type: "AC 1 Tier", count: 2, prefix: "H" },
      { type: "AC 2 Tier", count: 6, prefix: "A" },
      { type: "AC 3 Tier", count: 4, prefix: "B" },
    ],

    // Shatabdi services
    "12002": [ // Shatabdi Express
      { type: "AC Chair Car", count: 8, prefix: "CC" },
      { type: "AC 1 Tier", count: 1, prefix: "EC" },
    ],
    "12017": [ // New Delhi Shatabdi
      { type: "AC Chair Car", count: 10, prefix: "CC" },
      { type: "AC 1 Tier", count: 1, prefix: "EC" },
    ],
    "12059": [ // Habibganj Shatabdi
      { type: "AC Chair Car", count: 6, prefix: "CC" },
      { type: "AC 1 Tier", count: 1, prefix: "EC" },
    ],

    // Duronto services
    "12259": [ // Duronto Express
      { type: "AC 2 Tier", count: 3, prefix: "A" },
      { type: "AC 3 Tier", count: 8, prefix: "B" },
      { type: "Sleeper Class", count: 4, prefix: "S" },
    ],
    "12273": [ // Sealdah Duronto
      { type: "AC 2 Tier", count: 4, prefix: "A" },
      { type: "AC 3 Tier", count: 6, prefix: "B" },
      { type: "Sleeper Class", count: 6, prefix: "S" },
    ],
    "12267": [ // Mumbai Duronto
      { type: "AC 2 Tier", count: 5, prefix: "A" },
      { type: "AC 3 Tier", count: 7, prefix: "B" },
      { type: "Sleeper Class", count: 3, prefix: "S" },
    ],

    // Garib Rath services
    "12215": [ // Garib Rath
      { type: "AC 3 Tier", count: 12, prefix: "B" },
    ],
    "12553": [ // Poorva Garib Rath
      { type: "AC 3 Tier", count: 10, prefix: "B" },
    ],
    "12565": [ // Sampark Garib Rath
      { type: "AC 3 Tier", count: 14, prefix: "B" },
    ],

    // Jan Shatabdi services
    "12023": [ // Jan Shatabdi
      { type: "AC Chair Car", count: 6, prefix: "CC" },
      { type: "AC 2 Tier", count: 2, prefix: "A" },
    ],
    "12055": [ // Gomti Jan Shatabdi
      { type: "AC Chair Car", count: 8, prefix: "CC" },
      { type: "AC 2 Tier", count: 1, prefix: "A" },
    ],
    "12081": [ // Kerala Jan Shatabdi
      { type: "AC Chair Car", count: 7, prefix: "CC" },
      { type: "AC 2 Tier", count: 2, prefix: "A" },
    ],

    // Modern premium trains
    "22405": [ // Humsafar Express
      { type: "AC 3 Tier", count: 16, prefix: "B" },
    ],
    "22119": [ // Tejas Express
      { type: "AC Chair Car", count: 10, prefix: "CC" },
      { type: "AC 1 Tier", count: 2, prefix: "EC" },
    ],
    "22435": [ // Vande Bharat Express
      { type: "AC Chair Car", count: 14, prefix: "CC" },
      { type: "AC 1 Tier", count: 2, prefix: "EC" },
    ],
    "12049": [ // Gatiman Express
      { type: "AC Chair Car", count: 10, prefix: "CC" },
      { type: "AC 1 Tier", count: 1, prefix: "EC" },
    ],

    // Mail and Express trains
    "12615": [ // Chennai Mail
      { type: "AC 2 Tier", count: 2, prefix: "A" },
      { type: "AC 3 Tier", count: 4, prefix: "B" },
      { type: "Sleeper Class", count: 8, prefix: "S" },
      { type: "General", count: 4, prefix: "GS" },
    ],
    "12809": [ // Howrah Mail
      { type: "AC 2 Tier", count: 3, prefix: "A" },
      { type: "AC 3 Tier", count: 3, prefix: "B" },
      { type: "Sleeper Class", count: 10, prefix: "S" },
      { type: "General", count: 3, prefix: "GS" },
    ],
    "12627": [ // Karnataka Express
      { type: "AC 2 Tier", count: 2, prefix: "A" },
      { type: "AC 3 Tier", count: 5, prefix: "B" },
      { type: "Sleeper Class", count: 6, prefix: "S" },
      { type: "General", count: 2, prefix: "GS" },
    ],
    "12137": [ // Punjab Mail
      { type: "AC 2 Tier", count: 1, prefix: "A" },
      { type: "AC 3 Tier", count: 3, prefix: "B" },
      { type: "Sleeper Class", count: 12, prefix: "S" },
      { type: "General", count: 6, prefix: "GS" },
    ],

    // Express and Intercity trains
    "10111": [ // Konkan Kanya Express
      { type: "AC 2 Tier", count: 1, prefix: "A" },
      { type: "AC 3 Tier", count: 3, prefix: "B" },
      { type: "Sleeper Class", count: 8, prefix: "S" },
      { type: "General", count: 4, prefix: "GS" },
    ],
    "12015": [ // Intercity Express
      { type: "AC Chair Car", count: 4, prefix: "CC" },
      { type: "AC 2 Tier", count: 2, prefix: "A" },
      { type: "Sleeper Class", count: 4, prefix: "S" },
      { type: "General", count: 3, prefix: "GS" },
    ],
    "12649": [ // Superfast Express
      { type: "AC 2 Tier", count: 2, prefix: "A" },
      { type: "AC 3 Tier", count: 4, prefix: "B" },
      { type: "Sleeper Class", count: 8, prefix: "S" },
      { type: "General", count: 4, prefix: "GS" },
    ],
    "11077": [ // Mail Express
      { type: "AC 3 Tier", count: 2, prefix: "B" },
      { type: "Sleeper Class", count: 10, prefix: "S" },
      { type: "General", count: 8, prefix: "GS" },
    ],
    "56473": [ // Passenger Express
      { type: "Sleeper Class", count: 6, prefix: "S" },
      { type: "General", count: 12, prefix: "GS" },
    ],
  };

  for (const train of trainsResult.rows) {
    const composition = coachCompositions[train.code];
    if (!composition) {
      console.log(`  - No coach composition found for train ${train.code}, skipping`);
      continue;
    }

    for (const coachSpec of composition) {
      const coachType = coachTypesResult.rows.find(ct => ct.name === coachSpec.type);
      if (!coachType) {
        console.log(`  - Coach type ${coachSpec.type} not found, skipping`);
        continue;
      }

      for (let i = 1; i <= coachSpec.count; i++) {
        const coachCode = `${coachSpec.prefix}${i}`;

        // Check if coach already exists
        const existsQuery = `SELECT id FROM coaches WHERE train_id = $1 AND code = $2`;
        const existsResult = await queryDB(existsQuery, [train.id, coachCode]);

        if (existsResult.rows.length > 0) {
          console.log(`  - Coach ${coachCode} already exists for train ${train.code}`);
          continue;
        }

        const query = `
          INSERT INTO coaches (train_id, code, coach_type_id, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
          RETURNING id;
        `;

        try {
          const result = await queryDB(query, [train.id, coachCode, coachType.id]);
          if (result.rows.length > 0) {
            console.log(`  ✓ Inserted coach ${coachCode} for train ${train.code}`);
          }
        } catch (error) {
          console.error(`  ✗ Error inserting coach ${coachCode}:`, error.message);
        }
      }
    }
  }
};

const seedSeats = async () => {
  console.log("Seeding seats...");

  const coachesResult = await queryDB(`
    SELECT c.id, c.code, ct.name as coach_type_name 
    FROM coaches c 
    JOIN coach_types ct ON c.coach_type_id = ct.id
  `);
  const seatTypesResult = await queryDB("SELECT id, name FROM seat_types");

  if (coachesResult.rows.length === 0 || seatTypesResult.rows.length === 0) {
    console.log("  - Skipping seats (missing coaches or seat types)");
    return;
  }

  // Define seat configurations for different coach types
  const seatConfigurations = {
    "AC 1 Tier": {
      total: 18,
      types: [
        { name: "Lower Berth", count: 6 },
        { name: "Upper Berth", count: 6 },
        { name: "Side Lower", count: 3 },
        { name: "Side Upper", count: 3 }
      ]
    },
    "AC 2 Tier": {
      total: 46,
      types: [
        { name: "Lower Berth", count: 16 },
        { name: "Upper Berth", count: 16 },
        { name: "Side Lower", count: 7 },
        { name: "Side Upper", count: 7 }
      ]
    },
    "AC 3 Tier": {
      total: 64,
      types: [
        { name: "Lower Berth", count: 18 },
        { name: "Middle Berth", count: 18 },
        { name: "Upper Berth", count: 18 },
        { name: "Side Lower", count: 5 },
        { name: "Side Upper", count: 5 }
      ]
    },
    "Sleeper Class": {
      total: 72,
      types: [
        { name: "Lower Berth", count: 24 },
        { name: "Middle Berth", count: 24 },
        { name: "Upper Berth", count: 24 }
      ]
    },
    "AC Chair Car": {
      total: 78,
      types: [
        { name: "Chair", count: 78 }
      ]
    },
    "General": {
      total: 108,
      types: [
        { name: "Chair", count: 108 }
      ]
    }
  };

  for (const coach of coachesResult.rows) {
    const config = seatConfigurations[coach.coach_type_name];
    if (!config) continue;

    let seatNumber = 1;
    for (const seatTypeConfig of config.types) {
      const seatType = seatTypesResult.rows.find(st => st.name === seatTypeConfig.name);
      if (!seatType) continue;

      for (let i = 0; i < seatTypeConfig.count; i++) {
        // Check if seat already exists
        const existsQuery = `SELECT id FROM seats WHERE coach_id = $1 AND seat_number = $2`;
        const existsResult = await queryDB(existsQuery, [coach.id, seatNumber]);

        if (existsResult.rows.length > 0) {
          seatNumber++;
          continue;
        }

        const query = `
          INSERT INTO seats (coach_id, seat_number, seat_type_id, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
          RETURNING id;
        `;

        try {
          const result = await queryDB(query, [coach.id, seatNumber, seatType.id]);
          if (result.rows.length > 0) {
            console.log(`  ✓ Inserted seat ${seatNumber} in coach ${coach.code}`);
          }
        } catch (error) {
          console.error(`  ✗ Error inserting seat ${seatNumber}:`, error.message);
        }

        seatNumber++;
      }
    }
  }
};

const seedPassengers = async () => {
  console.log("Seeding passengers...");

  const customersResult = await queryDB(`
    SELECT u.id FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE r.name = 'customer'
  `);

  if (customersResult.rows.length === 0) {
    console.log("  - Skipping passengers (no customer users found)");
    return;
  }

  const samplePassengers = [
    // For John Doe user
    [
      { name: "John Doe", email: "john.doe@example.com", age: 35 },
      { name: "Jane Doe", email: "jane.doe@example.com", age: 32 },
      { name: "Emily Doe", email: "emily.doe@example.com", age: 8 },
    ],
    // For Jane Smith user
    [
      { name: "Jane Smith", email: "jane.smith@example.com", age: 28 },
      { name: "Robert Smith", email: "robert.smith@example.com", age: 30 },
    ],
    // For Raj Patel user
    [
      { name: "Raj Patel", email: "raj.patel@example.com", age: 42 },
      { name: "Meera Patel", email: "meera.patel@example.com", age: 38 },
      { name: "Arjun Patel", email: "arjun.patel@example.com", age: 15 },
      { name: "Kavya Patel", email: "kavya.patel@example.com", age: 12 },
    ],
    // For Priya Sharma user
    [
      { name: "Priya Sharma", email: "priya.sharma@example.com", age: 26 },
    ],
    // For Amit Kumar user
    [
      { name: "Amit Kumar", email: "amit.kumar@example.com", age: 33 },
      { name: "Sunita Kumar", email: "sunita.kumar@example.com", age: 29 },
      { name: "Dev Kumar", email: "dev.kumar@example.com", age: 5 },
    ],
    // For Sneha Gupta user
    [
      { name: "Sneha Gupta", email: "sneha.gupta@example.com", age: 31 },
      { name: "Rohit Gupta", email: "rohit.gupta@example.com", age: 34 },
    ],
    // For Vikram Singh user
    [
      { name: "Vikram Singh", email: "vikram.singh@example.com", age: 45 },
      { name: "Deepika Singh", email: "deepika.singh@example.com", age: 41 },
      { name: "Karan Singh", email: "karan.singh@example.com", age: 18 },
    ],
    // For Anita Desai user
    [
      { name: "Anita Desai", email: "anita.desai@example.com", age: 29 },
    ]
  ];

  for (let userIndex = 0; userIndex < Math.min(customersResult.rows.length, samplePassengers.length); userIndex++) {
    const user = customersResult.rows[userIndex];
    const passengers = samplePassengers[userIndex];

    for (const passengerData of passengers) {
      // Check if passenger already exists
      const existsQuery = `SELECT id FROM passengers WHERE user_id = $1 AND email = $2`;
      const existsResult = await queryDB(existsQuery, [user.id, passengerData.email]);

      if (existsResult.rows.length > 0) {
        console.log(`  - Passenger ${passengerData.email} already exists`);
        continue;
      }

      const query = `
        INSERT INTO passengers (user_id, name, email, age, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id;
      `;

      try {
        const result = await queryDB(query, [user.id, passengerData.name, passengerData.email, passengerData.age]);
        if (result.rows.length > 0) {
          console.log(`  ✓ Inserted passenger ${passengerData.name}`);
        }
      } catch (error) {
        console.error(`  ✗ Error inserting passenger ${passengerData.name}:`, error.message);
      }
    }
  }
};

const seedBookings = async () => {
  console.log("Seeding sample bookings...");

  const customersResult = await queryDB(`
    SELECT u.id FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE r.name = 'customer'
  `);
  const schedulesResult = await queryDB("SELECT id, train_id FROM schedules LIMIT 3");
  const stationsResult = await queryDB("SELECT id, code FROM stations");
  const bookingStatusesResult = await queryDB("SELECT id, name FROM booking_statuses");

  if (customersResult.rows.length === 0 || schedulesResult.rows.length === 0) {
    console.log("  - Skipping bookings (missing customers or schedules)");
    return;
  }

  const confirmedStatus = bookingStatusesResult.rows.find(s => s.name === 'Confirmed');
  const waitingStatus = bookingStatusesResult.rows.find(s => s.name === 'Waiting');

  const sampleBookings = [
    {
      userId: customersResult.rows[0]?.id,
      scheduleId: schedulesResult.rows[0]?.id,
      fromStation: "NDLS", // Delhi
      toStation: "BCT",   // Mumbai
      statusId: confirmedStatus?.id,
      totalAmount: 2500.00
    },
    {
      userId: customersResult.rows[1]?.id,
      scheduleId: schedulesResult.rows[1]?.id,
      fromStation: "NDLS", // Delhi
      toStation: "JP",    // Jaipur
      statusId: waitingStatus?.id,
      totalAmount: 1200.00
    },
    {
      userId: customersResult.rows[0]?.id,
      scheduleId: schedulesResult.rows[2]?.id,
      fromStation: "BCT", // Mumbai
      toStation: "PUNE", // Pune
      statusId: confirmedStatus?.id,
      totalAmount: 800.00
    }
  ];

  for (const bookingData of sampleBookings) {
    if (!bookingData.userId || !bookingData.scheduleId || !bookingData.statusId) continue;

    const fromStation = stationsResult.rows.find(s => s.code === bookingData.fromStation);
    const toStation = stationsResult.rows.find(s => s.code === bookingData.toStation);

    if (!fromStation || !toStation) continue;

    // Check if similar booking already exists
    const existsQuery = `
      SELECT id FROM bookings 
      WHERE user_id = $1 AND schedule_id = $2 AND from_station_id = $3 AND to_station_id = $4
    `;
    const existsResult = await queryDB(existsQuery, [
      bookingData.userId, bookingData.scheduleId, fromStation.id, toStation.id
    ]);

    if (existsResult.rows.length > 0) {
      console.log(`  - Similar booking already exists`);
      continue;
    }

    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const query = `
      INSERT INTO bookings (user_id, schedule_id, from_station_id, to_station_id, status_id, total_amount, pnr, booking_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        bookingData.userId,
        bookingData.scheduleId,
        fromStation.id,
        toStation.id,
        bookingData.statusId,
        bookingData.totalAmount,
        pnr
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Inserted booking ${pnr} from ${bookingData.fromStation} to ${bookingData.toStation}`);
        
        // Create corresponding payment for confirmed bookings
        if (bookingData.statusId === confirmedStatus?.id) {
          const completedPaymentStatus = await queryDB("SELECT id FROM payment_statuses WHERE name = 'Completed' LIMIT 1");
          if (completedPaymentStatus.rows.length > 0) {
            await queryDB(
              `INSERT INTO payments (booking_id, amount, status_id, payment_date, created_at) 
               VALUES ($1, $2, $3, CURRENT_DATE, NOW())`,
              [result.rows[0].id, bookingData.totalAmount, completedPaymentStatus.rows[0].id]
            );
            console.log(`  ✓ Created payment for booking ${pnr}`);
          }
        }
      }
    } catch (error) {
      console.error(`  ✗ Error inserting booking:`, error.message);
    }
  }
};

// Enhanced comprehensive bookings with more realistic data
const seedComprehensiveBookings = async () => {
  console.log("Seeding comprehensive bookings for demo...");

  const customersResult = await queryDB(`
    SELECT u.id, u.name FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE r.name = 'customer'
  `);
  const schedulesResult = await queryDB("SELECT id, train_id, departure_date FROM schedules");
  const stationsResult = await queryDB("SELECT id, code FROM stations");
  const bookingStatusesResult = await queryDB("SELECT id, name FROM booking_statuses");

  if (customersResult.rows.length === 0 || schedulesResult.rows.length === 0) {
    console.log("  - Skipping comprehensive bookings (missing customers or schedules)");
    return;
  }

  const confirmedStatus = bookingStatusesResult.rows.find(s => s.name === 'Confirmed');
  const waitingStatus = bookingStatusesResult.rows.find(s => s.name === 'Waiting');
  const racStatus = bookingStatusesResult.rows.find(s => s.name === 'RAC');
  const cancelledStatus = bookingStatusesResult.rows.find(s => s.name === 'Cancelled');

  // Generate realistic booking scenarios across different dates
  const comprehensiveBookings = [
    // Family trips
    {
      userId: customersResult.rows[2]?.id, // Raj Patel (family of 4)
      scheduleId: schedulesResult.rows[0]?.id,
      fromStation: "NDLS", toStation: "BCT",
      statusId: confirmedStatus?.id,
      totalAmount: 8500.00,
      passengerCount: 4
    },
    {
      userId: customersResult.rows[4]?.id, // Amit Kumar (family of 3)
      scheduleId: schedulesResult.rows[1]?.id,
      fromStation: "NDLS", toStation: "JP",
      statusId: confirmedStatus?.id,
      totalAmount: 3600.00,
      passengerCount: 3
    },
    // Business trips (single passenger)
    {
      userId: customersResult.rows[3]?.id, // Priya Sharma
      scheduleId: schedulesResult.rows[2]?.id,
      fromStation: "BCT", toStation: "PUNE",
      statusId: confirmedStatus?.id,
      totalAmount: 1200.00,
      passengerCount: 1
    },
    {
      userId: customersResult.rows[7]?.id, // Anita Desai
      scheduleId: schedulesResult.rows[3]?.id,
      fromStation: "NDLS", toStation: "MAS",
      statusId: waitingStatus?.id,
      totalAmount: 4500.00,
      passengerCount: 1
    },
    // Couple trips
    {
      userId: customersResult.rows[1]?.id, // Jane Smith
      scheduleId: schedulesResult.rows[4]?.id,
      fromStation: "NDLS", toStation: "LKO",
      statusId: confirmedStatus?.id,
      totalAmount: 2400.00,
      passengerCount: 2
    },
    {
      userId: customersResult.rows[5]?.id, // Sneha Gupta
      scheduleId: schedulesResult.rows[0]?.id,
      fromStation: "JP", toStation: "ADI",
      statusId: racStatus?.id,
      totalAmount: 3200.00,
      passengerCount: 2
    },
    // Cancelled booking scenarios
    {
      userId: customersResult.rows[6]?.id, // Vikram Singh
      scheduleId: schedulesResult.rows[1]?.id,
      fromStation: "NDLS", toStation: "JP",
      statusId: cancelledStatus?.id,
      totalAmount: 5400.00,
      passengerCount: 3
    },
    // Waiting list scenarios
    {
      userId: customersResult.rows[0]?.id, // John Doe
      scheduleId: schedulesResult.rows[2]?.id,
      fromStation: "BCT", toStation: "SC",
      statusId: waitingStatus?.id,
      totalAmount: 6800.00,
      passengerCount: 3
    }
  ];

  const createdBookings = [];

  for (const bookingData of comprehensiveBookings) {
    if (!bookingData.userId || !bookingData.scheduleId || !bookingData.statusId) continue;

    const fromStation = stationsResult.rows.find(s => s.code === bookingData.fromStation);
    const toStation = stationsResult.rows.find(s => s.code === bookingData.toStation);

    if (!fromStation || !toStation) continue;

    // Check if similar booking already exists
    const existsQuery = `
      SELECT id FROM bookings 
      WHERE user_id = $1 AND schedule_id = $2 AND from_station_id = $3 AND to_station_id = $4
    `;
    const existsResult = await queryDB(existsQuery, [
      bookingData.userId, bookingData.scheduleId, fromStation.id, toStation.id
    ]);

    if (existsResult.rows.length > 0) {
      console.log(`  - Similar booking already exists`);
      createdBookings.push({ id: existsResult.rows[0].id, ...bookingData });
      continue;
    }

    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const query = `
      INSERT INTO bookings (user_id, schedule_id, from_station_id, to_station_id, status_id, total_amount, pnr, booking_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        bookingData.userId,
        bookingData.scheduleId,
        fromStation.id,
        toStation.id,
        bookingData.statusId,
        bookingData.totalAmount,
        pnr
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Inserted booking ${pnr} from ${bookingData.fromStation} to ${bookingData.toStation}`);
        createdBookings.push({ id: result.rows[0].id, ...bookingData });
      }
    } catch (error) {
      console.error(`  ✗ Error inserting booking:`, error.message);
    }
  }

  return createdBookings;
};

const seedBookedPassengers = async () => {
  console.log("Seeding booked passengers...");

  const bookingsResult = await queryDB(`
    SELECT b.id as booking_id, b.user_id, bs.name as status 
    FROM bookings b 
    JOIN booking_statuses bs ON b.status_id = bs.id
  `);
  
  const passengersResult = await queryDB("SELECT id, user_id, name, email, age FROM passengers");

  if (bookingsResult.rows.length === 0 || passengersResult.rows.length === 0) {
    console.log("  - Skipping booked passengers (missing bookings or passengers)");
    return;
  }

  const genders = ['Male', 'Female', 'Other'];
  const createdBookedPassengers = [];

  for (const booking of bookingsResult.rows) {
    // Get passengers for this user
    const userPassengers = passengersResult.rows.filter(p => p.user_id === booking.user_id);
    
    if (userPassengers.length === 0) continue;

    // Create booked passenger entries for each passenger in the booking
    for (let i = 0; i < Math.min(userPassengers.length, 4); i++) {
      const passenger = userPassengers[i];
      
      // Check if booked passenger already exists
      const existsQuery = `SELECT id FROM booked_passengers WHERE booking_id = $1 AND passenger_id = $2`;
      const existsResult = await queryDB(existsQuery, [booking.booking_id, passenger.id]);

      if (existsResult.rows.length > 0) {
        createdBookedPassengers.push({ id: existsResult.rows[0].id, booking_id: booking.booking_id, passenger_id: passenger.id });
        continue;
      }

      const gender = passenger.name.includes('Jane') || passenger.name.includes('Emily') || 
                    passenger.name.includes('Priya') || passenger.name.includes('Sneha') ||
                    passenger.name.includes('Anita') || passenger.name.includes('Meera') ||
                    passenger.name.includes('Kavya') || passenger.name.includes('Sunita') ||
                    passenger.name.includes('Deepika') ? 'Female' : 'Male';

      const query = `
        INSERT INTO booked_passengers (booking_id, passenger_id, name, gender, age)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;

      try {
        const result = await queryDB(query, [
          booking.booking_id,
          passenger.id,
          passenger.name,
          gender,
          passenger.age
        ]);

        if (result.rows.length > 0) {
          console.log(`  ✓ Linked passenger ${passenger.name} to booking`);
          createdBookedPassengers.push({ 
            id: result.rows[0].id, 
            booking_id: booking.booking_id, 
            passenger_id: passenger.id 
          });
        }
      } catch (error) {
        console.error(`  ✗ Error linking passenger ${passenger.name}:`, error.message);
      }
    }
  }

  return createdBookedPassengers;
};

const seedBookedSeats = async () => {
  console.log("Seeding booked seats...");

  const bookedPassengersResult = await queryDB(`
    SELECT bp.id as booked_passenger_id, bp.booking_id,
           b.schedule_id, bs.name as booking_status
    FROM booked_passengers bp
    JOIN bookings b ON bp.booking_id = b.id
    JOIN booking_statuses bs ON b.status_id = bs.id
  `);

  const seatsResult = await queryDB(`
    SELECT s.id, s.seat_number, s.coach_id,
           c.code as coach_code, c.train_id,
           sch.id as schedule_id
    FROM seats s
    JOIN coaches c ON s.coach_id = c.id
    JOIN schedules sch ON c.train_id = sch.train_id
    ORDER BY s.coach_id, s.seat_number
  `);

  if (bookedPassengersResult.rows.length === 0 || seatsResult.rows.length === 0) {
    console.log("  - Skipping booked seats (missing booked passengers or seats)");
    return;
  }

  const usedSeats = new Set();

  for (const bookedPassenger of bookedPassengersResult.rows) {
    // Only assign seats to confirmed and RAC bookings
    if (!['Confirmed', 'RAC'].includes(bookedPassenger.booking_status)) continue;

    // Find available seats for this schedule
    const availableSeats = seatsResult.rows.filter(s => 
      s.schedule_id === bookedPassenger.schedule_id && 
      !usedSeats.has(`${s.id}-${bookedPassenger.schedule_id}`)
    );

    if (availableSeats.length === 0) continue;

    // Pick a random available seat
    const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
    const seatKey = `${randomSeat.id}-${bookedPassenger.schedule_id}`;

    // Check if seat assignment already exists
    const existsQuery = `SELECT id FROM booked_seats WHERE booking_id = $1 AND booked_passenger_id = $2`;
    const existsResult = await queryDB(existsQuery, [
      bookedPassenger.booking_id, 
      bookedPassenger.booked_passenger_id
    ]);

    if (existsResult.rows.length > 0) {
      continue;
    }

    const query = `
      INSERT INTO booked_seats (booking_id, booked_passenger_id, seat_id, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        bookedPassenger.booking_id,
        bookedPassenger.booked_passenger_id,
        randomSeat.id
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Assigned seat ${randomSeat.seat_number} in coach ${randomSeat.coach_code}`);
        usedSeats.add(seatKey);
      }
    } catch (error) {
      console.error(`  ✗ Error assigning seat:`, error.message);
    }
  }
};

const seedPayments = async () => {
  console.log("Seeding payments...");

  const bookingsResult = await queryDB(`
    SELECT b.id, b.total_amount, bs.name as status, b.booking_date
    FROM bookings b
    JOIN booking_statuses bs ON b.status_id = bs.id
  `);

  const paymentStatusesResult = await queryDB("SELECT id, name FROM payment_statuses");

  if (bookingsResult.rows.length === 0 || paymentStatusesResult.rows.length === 0) {
    console.log("  - Skipping payments (missing bookings or payment statuses)");
    return;
  }

  const completedStatus = paymentStatusesResult.rows.find(s => s.name === 'Completed');
  const pendingStatus = paymentStatusesResult.rows.find(s => s.name === 'Pending');
  const failedStatus = paymentStatusesResult.rows.find(s => s.name === 'Failed');
  const refundedStatus = paymentStatusesResult.rows.find(s => s.name === 'Refunded');

  for (const booking of bookingsResult.rows) {
    // Check if payment already exists
    const existsQuery = `SELECT id FROM payments WHERE booking_id = $1`;
    const existsResult = await queryDB(existsQuery, [booking.id]);

    if (existsResult.rows.length > 0) {
      continue;
    }

    let paymentStatusId;
    let paymentDate;

    // Assign payment status based on booking status
    switch (booking.status) {
      case 'Confirmed':
      case 'RAC':
        paymentStatusId = completedStatus?.id;
        paymentDate = new Date(booking.booking_date);
        paymentDate.setMinutes(paymentDate.getMinutes() + Math.floor(Math.random() * 30));
        break;
      case 'Cancelled':
        // Some cancelled bookings have refunded payments
        paymentStatusId = Math.random() > 0.5 ? refundedStatus?.id : completedStatus?.id;
        paymentDate = new Date(booking.booking_date);
        paymentDate.setHours(paymentDate.getHours() + Math.floor(Math.random() * 48));
        break;
      case 'Waiting':
        // Waiting bookings might have pending or completed payments
        paymentStatusId = Math.random() > 0.3 ? completedStatus?.id : pendingStatus?.id;
        paymentDate = new Date(booking.booking_date);
        paymentDate.setMinutes(paymentDate.getMinutes() + Math.floor(Math.random() * 60));
        break;
      default:
        paymentStatusId = pendingStatus?.id;
        paymentDate = new Date();
    }

    if (!paymentStatusId) continue;

    const query = `
      INSERT INTO payments (booking_id, amount, status_id, payment_date, created_at)
      VALUES ($1, $2, $3, $4::date, NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        booking.id,
        booking.total_amount,
        paymentStatusId,
        paymentDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD format for date type
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Created payment for booking (${booking.status})`);
      }
    } catch (error) {
      console.error(`  ✗ Error creating payment:`, error.message);
    }
  }
};

const seedRefunds = async () => {
  console.log("Seeding refunds...");

  const cancelledPaymentsResult = await queryDB(`
    SELECT p.id as payment_id, p.booking_id, p.amount
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    JOIN booking_statuses bs ON b.status_id = bs.id
    JOIN payment_statuses ps ON p.status_id = ps.id
    WHERE bs.name = 'Cancelled' AND ps.name IN ('Completed', 'Refunded')
  `);

  const refundStatusesResult = await queryDB("SELECT id, name FROM refund_statuses");

  if (cancelledPaymentsResult.rows.length === 0 || refundStatusesResult.rows.length === 0) {
    console.log("  - Skipping refunds (no cancelled payments or refund statuses)");
    return;
  }

  const requestedStatus = refundStatusesResult.rows.find(s => s.name === 'Requested');
  const processingStatus = refundStatusesResult.rows.find(s => s.name === 'Processing');
  const completedStatus = refundStatusesResult.rows.find(s => s.name === 'Completed');
  const rejectedStatus = refundStatusesResult.rows.find(s => s.name === 'Rejected');

  for (const payment of cancelledPaymentsResult.rows) {
    // Check if refund already exists
    const existsQuery = `SELECT id FROM refunds WHERE payment_id = $1`;
    const existsResult = await queryDB(existsQuery, [payment.payment_id]);

    if (existsResult.rows.length > 0) {
      continue;
    }

    // Random refund status distribution
    const rand = Math.random();
    let refundStatusId, refundAmount;
    
    if (rand < 0.6) {
      refundStatusId = completedStatus?.id;
      refundAmount = payment.amount * 0.85; // 15% cancellation fee
    } else if (rand < 0.8) {
      refundStatusId = processingStatus?.id;
      refundAmount = payment.amount * 0.85;
    } else if (rand < 0.9) {
      refundStatusId = requestedStatus?.id;
      refundAmount = payment.amount * 0.85;
    } else {
      refundStatusId = rejectedStatus?.id;
      refundAmount = 0;
    }

    if (!refundStatusId) continue;

    const refundDate = new Date();
    refundDate.setDate(refundDate.getDate() - Math.floor(Math.random() * 15));

    const query = `
      INSERT INTO refunds (payment_id, amount, status_id, refund_date, created_at)
      VALUES ($1, $2, $3, $4::date, NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        payment.payment_id,
        refundAmount,
        refundStatusId,
        refundDate.toISOString().split('T')[0] // Convert to YYYY-MM-DD format for date type
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Created refund for payment (Amount: ${refundAmount})`);
      }
    } catch (error) {
      console.error(`  ✗ Error creating refund:`, error.message);
    }
  }
};

const seedAuditLogs = async () => {
  console.log("Seeding audit logs...");

  const usersResult = await queryDB("SELECT id, name, email FROM users");
  const bookingsResult = await queryDB("SELECT id, pnr FROM bookings LIMIT 10");

  if (usersResult.rows.length === 0) {
    console.log("  - Skipping audit logs (no users found)");
    return;
  }

  const auditEvents = [
    // User authentication events
    ...usersResult.rows.flatMap(user => [
        {
          user_id: user.id,
          action: 'LOGIN',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        },
        {
          user_id: user.id,
          action: 'LOGOUT',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
    ]),
    // Booking events
    ...bookingsResult.rows.flatMap(booking => [
        {
          user_id: usersResult.rows[Math.floor(Math.random() * usersResult.rows.length)].id,
          action: 'BOOKING_CREATED',
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        {
          user_id: usersResult.rows[Math.floor(Math.random() * usersResult.rows.length)].id,
          action: 'BOOKING_UPDATED',
          timestamp: new Date(Date.now() - Math.random() * 25 * 24 * 60 * 60 * 1000)
        }
    ]),
    // System events
    {
      user_id: usersResult.rows.find(u => u.email === 'admin@railway.com')?.id,
      action: 'SYSTEM_BACKUP',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  for (const event of auditEvents) {
    if (!event.user_id) continue;

    const query = `
      INSERT INTO audit_logs (user_id, action, timestamp)
      VALUES ($1, $2, $3::timestamp)
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        event.user_id,
        event.action,
        event.timestamp.toISOString()
      ]);

      if (result.rows.length > 0) {
        console.log(`  ✓ Created audit log: ${event.action}`);
      }
    } catch (error) {
      console.error(`  ✗ Error creating audit log:`, error.message);
    }
  }
};

const seedExtendedSchedules = async () => {
  console.log("Seeding extended schedules for next 30 days...");

  const trainsResult = await queryDB("SELECT id, name, code FROM trains");
  
  if (trainsResult.rows.length === 0) {
    console.log("  - Skipping extended schedules (no trains found)");
    return;
  }

  const today = new Date();
  const extendedSchedules = [];

  // Different train frequency patterns based on type
  const trainFrequencyPatterns = {
    // Daily premium services
    "12301": { frequency: 1, baseTimes: ["16:55:00"] }, // Rajdhani Express
    "12951": { frequency: 1, baseTimes: ["17:30:00"] }, // New Delhi Rajdhani
    "12002": { frequency: 1, baseTimes: ["06:00:00"] }, // Shatabdi Express
    "12017": { frequency: 1, baseTimes: ["15:30:00"] }, // New Delhi Shatabdi
    "22435": { frequency: 1, baseTimes: ["06:00:00"] }, // Vande Bharat Express
    "12049": { frequency: 1, baseTimes: ["08:10:00"] }, // Gatiman Express
    "22119": { frequency: 1, baseTimes: ["15:50:00"] }, // Tejas Express

    // Bi-weekly premium services
    "12953": { frequency: 2, baseTimes: ["18:15:00"] }, // Mumbai Rajdhani
    "22405": { frequency: 2, baseTimes: ["14:25:00"] }, // Humsafar Express
    "12059": { frequency: 2, baseTimes: ["07:15:00"] }, // Habibganj Shatabdi

    // Tri-weekly services
    "12259": { frequency: 3, baseTimes: ["22:30:00"] }, // Duronto Express
    "12273": { frequency: 3, baseTimes: ["07:40:00"] }, // Sealdah Duronto
    "12267": { frequency: 3, baseTimes: ["22:00:00"] }, // Mumbai Duronto
    "12215": { frequency: 3, baseTimes: ["23:45:00"] }, // Garib Rath
    "12553": { frequency: 3, baseTimes: ["21:15:00"] }, // Poorva Garib Rath
    "12565": { frequency: 3, baseTimes: ["19:30:00"] }, // Sampark Garib Rath

    // Weekly services
    "12023": { frequency: 7, baseTimes: ["05:30:00"] }, // Jan Shatabdi
    "12055": { frequency: 7, baseTimes: ["06:15:00"] }, // Gomti Jan Shatabdi
    "12081": { frequency: 7, baseTimes: ["14:45:00"] }, // Kerala Jan Shatabdi

    // Express services (alternate days)
    "12615": { frequency: 2, baseTimes: ["20:30:00"] }, // Chennai Mail
    "12809": { frequency: 2, baseTimes: ["19:45:00"] }, // Howrah Mail
    "12627": { frequency: 2, baseTimes: ["21:50:00"] }, // Karnataka Express
    "12137": { frequency: 2, baseTimes: ["22:15:00"] }, // Punjab Mail

    // Regular services (every 3 days)
    "10111": { frequency: 3, baseTimes: ["16:20:00"] }, // Konkan Kanya Express
    "12015": { frequency: 3, baseTimes: ["17:20:00"] }, // Intercity Express
    "12649": { frequency: 3, baseTimes: ["18:40:00"] }, // Superfast Express

    // Local services (daily but different times)
    "11077": { frequency: 1, baseTimes: ["06:30:00", "14:15:00", "20:45:00"] }, // Mail Express
    "56473": { frequency: 1, baseTimes: ["05:15:00", "11:30:00", "16:05:00", "21:20:00"] }, // Passenger Express
  };

  // Generate schedules for next 30 days
  for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + dayOffset);
    
    for (const train of trainsResult.rows) {
      const pattern = trainFrequencyPatterns[train.code];
      if (!pattern) continue;

      // Check if train should run on this day based on frequency
      const shouldRun = dayOffset % pattern.frequency === (train.code.charCodeAt(0) % pattern.frequency);
      
      if (shouldRun) {
        // Multiple departure times for some trains
        for (const departureTime of pattern.baseTimes) {
          extendedSchedules.push({
            train_id: train.id,
            departure_date: scheduleDate.toISOString().split('T')[0],
            departure_time: departureTime
          });
        }
      }
    }
  }

  console.log(`  - Generated ${extendedSchedules.length} schedules to insert`);

  let insertedCount = 0;
  for (const schedule of extendedSchedules) {
    // Check if schedule already exists
    const existsQuery = `SELECT id FROM schedules WHERE train_id = $1 AND departure_date = $2 AND departure_time = $3`;
    const existsResult = await queryDB(existsQuery, [
      schedule.train_id,
      schedule.departure_date,
      schedule.departure_time
    ]);

    if (existsResult.rows.length > 0) {
      continue;
    }

    const query = `
      INSERT INTO schedules (train_id, departure_date, departure_time, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id;
    `;

    try {
      const result = await queryDB(query, [
        schedule.train_id,
        schedule.departure_date,
        schedule.departure_time
      ]);

      if (result.rows.length > 0) {
        insertedCount++;
        if (insertedCount % 50 === 0) {
          console.log(`  ✓ Inserted ${insertedCount} extended schedules...`);
        }
      }
    } catch (error) {
      console.error(`  ✗ Error adding schedule:`, error.message);
    }
  }

  console.log(`  ✓ Successfully inserted ${insertedCount} extended schedules`);
};

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Seed foundational data
    await seedTable("roles", seedData.roles);
    await seedTable("coach_types", seedData.coachTypes);
    await seedTable("seat_types", seedData.seatTypes, { hasTimestamps: false });
    await seedTable("booking_statuses", seedData.bookingStatuses);
    await seedTable("payment_statuses", seedData.paymentStatuses);
    await seedTable("refund_statuses", seedData.refundStatuses);
    await seedTable("stations", seedData.stations, { checkColumn: "code" });
    await seedTable("trains", seedData.trains, { checkColumn: "code" });

    // Seed station distances
    await seedStationDistances();

    // Seed fare rates and users
    await seedFareRates();
    await seedUsers();

    // Seed schedules and schedule stops
    await seedSchedules();
    await seedScheduleStops();

    // Seed coaches and seats
    await seedCoaches();
    await seedSeats();

    // Seed passengers and sample bookings
    await seedPassengers();
    await seedBookings();

    // Seed comprehensive demo data
    console.log("\n🎯 Seeding comprehensive demo data...");
    await seedComprehensiveBookings();
    await seedBookedPassengers();
    await seedBookedSeats();
    await seedPayments();
    await seedRefunds();
    await seedAuditLogs();

    console.log("\n✅ Database seeding completed successfully!");
    console.log("\n📊 Summary of seeded data:");
    console.log("   • User roles (admin, customer)");
    console.log("   • Coach types and seat types");
    console.log("   • 10 major railway stations across India");
    console.log("   • 30+ different trains with comprehensive route coverage");
    console.log("   • Multiple trains serving same station pairs for realistic options");
    console.log("   • Station distances for fare calculation");
    console.log("   • Comprehensive 30-day schedule coverage starting from today");
    console.log("   • Realistic train frequency patterns (daily, bi-weekly, tri-weekly services)");
    console.log("   • Coaches and seats for all trains with varied compositions");
    console.log("   • 8+ demo users with varied profiles");
    console.log("   • Passengers linked to all customers");
    console.log("   • Comprehensive bookings (confirmed, waiting, cancelled, RAC)");
    console.log("   • Complete passenger-seat assignments");
    console.log("   • Payment records for all booking scenarios");
    console.log("   • Refund workflows for cancelled bookings");
    console.log("   • Audit logs for admin tracking");
    console.log("\n🔐 Login credentials:");
    console.log("   Admin: admin@railway.com / admin123");
    console.log("   Customer: john.doe@example.com / password");
    console.log("   Customer: jane.smith@example.com / password");
    console.log("   Customer: raj.patel@example.com / password");
    console.log("   Customer: priya.sharma@example.com / password");
    console.log("   Customer: amit.kumar@example.com / password");
    console.log("   (+ 3 more customers with same password)");
  } catch (error) {
    console.error("\n❌ Error during database seeding:", error);
    throw error;
  }
};

export default seedDatabase;
