import server from ".";
import db from "../db";

// Runs the server

export const PORT = process.env.PORT || 4000;

// INITIALIZE OUR DATABASE OBJECT
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// PUT THE SERVER IN LISTENING MODE
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))