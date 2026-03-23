// seed/showSeeder.ts
import mongoose from "mongoose";
import dayjs from "dayjs";
import { MovieModel } from "../modules/movie/movie.model";
import { TheaterModel } from "../modules/theater/theater.model";
import { ShowModel } from "../modules/show/show.model";
import { config } from "../config/config";
import { generateSeatLayout } from "../utils/index"


const generatePriceMap = () =>
  new Map([
    ["PREMIUM", 510],
    ["EXECUTIVE", 290],
    ["NORMAL", 270],
  ]);

const formats = ["2D", "3D", "IMAX", "PVR PXL"];

// 🎞️ Realistic time slots
const fixedTimeSlots = [
  { start: "09:00 AM", end: "11:30 AM" },
  { start: "12:30 PM", end: "03:00 PM" },
  { start: "04:00 PM", end: "06:30 PM" },
  { start: "07:30 PM", end: "10:00 PM" },
  { start: "10:30 PM", end: "01:00 AM" },
];

const toDateWithTime = (baseDate: Date, timeStr: string) => {
  return dayjs(baseDate)
    .hour(dayjs(timeStr, ["hh:mm A"]).hour())
    .minute(dayjs(timeStr, ["hh:mm A"]).minute())
    .second(0)
    .toDate();
};

export const seedShow = async () => {
  const movies = await MovieModel.find({});
  const theatres = await TheaterModel.find({});

  if (!movies.length || !theatres.length) {
    console.error("Movies or theatres not found. Please ensure they are seeded first.");
    return;
  }

  const today = dayjs().startOf("day");
  const showsToInsert = [];

  for (const movie of movies) {
    for (const theatre of theatres) {
      // ✅ next 7 days for every movie and theatre combo
      for (let d = 0; d < 7; d++) { 
        const showDate = today.add(d, "day");
        const formattedDate = showDate.format("DD-MM-YYYY");
        const numShows = Math.floor(Math.random() * 3) + 2; // 2–4 shows
        const selectedSlots = fixedTimeSlots.slice(0, numShows);

        for (const slot of selectedSlots) {
          showsToInsert.push({
            movie: movie._id,
            theater: theatre._id,
            location: theatre.state,
            format: formats[Math.floor(Math.random() * formats.length)],
            audioType: "Dolby 7.1",
            startTime: slot.start, 
            date: formattedDate, // ✅ "DD-MM-YYYY"
            priceMap: generatePriceMap(),
            seatLayout: generateSeatLayout(),
          });
        }
      }
    }
  }

  console.log(`Inserting ${showsToInsert.length} shows...`);
  
  // Batch insert to avoid overwhelming memory/db
  const BATCH_SIZE = 1000;
  for (let i = 0; i < showsToInsert.length; i += BATCH_SIZE) {
    const batch = showsToInsert.slice(i, i + BATCH_SIZE);
    await ShowModel.insertMany(batch);
    console.log(`Inserted ${i + batch.length} of ${showsToInsert.length} shows`);
  }

  console.log("✅ Show seeding completed for all movies and theaters.");
};

mongoose
  .connect(config.databaseUrl as string)
  .then(async () => {
    console.log("DB connected");
    await ShowModel.deleteMany({});
    console.log("🧹 Existing shows deleted.");
    await seedShow();
    mongoose.disconnect();
  })
  .catch((err) => console.log(err));
