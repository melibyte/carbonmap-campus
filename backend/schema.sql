CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    unit TEXT NOT NULL,
    factor REAL NOT NULL,
    scope TEXT NOT NULL,
    total_emission REAL NOT NULL,
    source TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT
);
