BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Codes" (
	"code"	INTEGER,
	"incident_type"	TEXT,
	PRIMARY KEY("code")
);
CREATE TABLE IF NOT EXISTS "Neighborhoods" (
	"neighborhood_number"	INTEGER,
	"neighborhood_name"	TEXT,
	PRIMARY KEY("neighborhood_number")
);
CREATE TABLE IF NOT EXISTS "Incidents" (
	"case_number"	TEXT,
	"date_time"	DATETIME,
	"code"	INTEGER,
	"incident"	TEXT,
	"police_grid"	INTEGER,
	"neighborhood_number"	INTEGER,
	"block"	TEXT,
	PRIMARY KEY("case_number"),
	FOREIGN KEY("neighborhood_number") REFERENCES "Neighborhoods"("neighborhood_number"),
	FOREIGN KEY("code") REFERENCES "Codes"("code")
);
COMMIT;
