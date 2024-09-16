import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "farcasterbot.db");

export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
  }
);

export const migrate = () => {
  db.serialize(() => {
   db.run(
    `
      CREATE TABLE IF NOT EXISTS webhook_payload (
        hash TEXT PRIMARY KEY,
        payload TEXT NOT NULL
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);d
     }
     console.log("webhook_payload table created successfully.");
    }
   );
  });
}

export const write_payload = async (query: string, values: string[]) => {
  return await new Promise((resolve, reject) => {
    migrate();
    db.run(query, values, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(null);
    });
  });
 };