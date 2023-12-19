import * as path from "node:path";
import * as url from "node:url";

import { default as express } from "express";
import { default as sqlite3 } from "sqlite3";
import fetch from "node-fetch";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const db_filename = path.join(__dirname, "db", "stpaul_crime.sqlite3");

const port = 8000;

let app = express();
app.use(express.json());

/********************************************************************
 ***   DATABASE FUNCTIONS                                         ***
 ********************************************************************/
// Open SQLite3 database (in read-write mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log("Error opening " + path.basename(db_filename));
  } else {
    console.log("Now connected to " + path.basename(db_filename));
  }
});

// Create Promise for SQLite3 database SELECT query
function dbSelect(query, params) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Create Promise for SQLite3 database INSERT or DELETE query
function dbRun(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/********************************************************************
 ***   REST REQUEST HANDLERS                                      ***
 ********************************************************************/

// GET request handler for crime codes
app.get("/codes", async (req, res) => {
  try {
    const query = "SELECT * FROM Codes";
    const codes = await dbSelect(query, []);

    res.status(200).type("json").send({ codes });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET request handler for neighborhoods
app.get("/neighborhoods", async (req, res) => {
  try {
    const query = "SELECT * FROM Neighborhoods";
    const neighborhoods = await dbSelect(query, []);

    res.status(200).type("json").send({ neighborhoods });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET request handler for crime incidents
app.get("/incidents", async (req, res) => {
  try {
    const query = "SELECT * FROM Incidents";
    const incidents = await dbSelect(query, []);

    res.status(200).type("json").send({ incidents });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT request handler for new crime incident
app.put("/new-incident", async (req, res) => {
  try {
    // Assuming req.body contains the data for the new incident
    const {
      case_number,
      date_time,
      code,
      incident,
      police_grid,
      neighborhood_number,
      block,
    } = req.body;

    const query = `
            INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
    await dbRun(query, [
      case_number,
      date_time,
      code,
      incident,
      police_grid,
      neighborhood_number,
      block,
    ]);

    res.status(200).type("txt").send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE request handler for new crime incident
app.delete("/remove-incident", async (req, res) => {
  try {
    // Assuming req.body contains the data for the incident to be removed
    const { case_number } = req.body;

    const query = "DELETE FROM Incidents WHERE case_number = ?";
    await dbRun(query, [case_number]);

    res.status(200).type("txt").send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// GET request handler for crimes visible on the map
app.get("/visible-crimes", async (req, res) => {
  try {
    // Get visible bounds from the request, adjust as needed based on your implementation
    const { bounds } = req.query;
    const [south, west, north, east] = bounds.split(",").map(parseFloat);

    // Use SQLite to query for crimes within the visible bounds
    const query = `
            SELECT Incidents.case_number, Incidents.date_time, Codes.incident_type, Incidents.incident, 
                   Neighborhoods.neighborhood_name, Incidents.block
            FROM Incidents
            INNER JOIN Codes ON Incidents.code = Codes.code
            INNER JOIN Neighborhoods ON Incidents.neighborhood_number = Neighborhoods.neighborhood_number
            WHERE Incidents.latitude BETWEEN ? AND ?
                AND Incidents.longitude BETWEEN ? AND ?
            ORDER BY Incidents.date_time DESC
            LIMIT 1000;`;

    const crimes = await dbSelect(query, [south, north, west, east]);
    res.status(200).json({ crimes });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Fetch 1,000 most recent crimes from the St. Paul Crime API and populate the database
app.get("/populate-crimes", async (req, res) => {
  try {
    // Fetch data from the St. Paul Crime API or use your preferred method
    const apiResponse = await fetch("https://example.com/api/crimes");
    const apiData = await apiResponse.json();

    // Extract relevant crime data and insert into the database
    const insertQuery = `
            INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const crimesToInsert = apiData.slice(0, 1000); // Limit to 1,000 most recent crimes
    for (const crime of crimesToInsert) {
      await dbRun(insertQuery, [
        crime.case_number,
        crime.date_time,
        crime.code,
        crime.incident,
        crime.police_grid,
        crime.neighborhood_number,
        crime.block,
      ]);
    }

    res.status(200).send("Crimes populated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/********************************************************************
 ***   START SERVER                                               ***
 ********************************************************************/
// Start server - listen for client connections
app.listen(port, () => {
  console.log("Now listening on port " + port);
});
