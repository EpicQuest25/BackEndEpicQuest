const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MySQL connection...');
  console.log('Using credentials:');
  console.log(`Host: ${process.env.EPICQUEST_URL}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`User: ${process.env.EPICQUEST_DB_USERNAME}`);
  console.log(`Database: ${process.env.EPICQUEST_DB_NAME}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.EPICQUEST_URL,
      port: process.env.DB_PORT,
      user: process.env.EPICQUEST_DB_USERNAME,
      password: process.env.EPICQUEST_DB_PASSWORD,
      database: process.env.EPICQUEST_DB_NAME
    });
    
    console.log('Connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query result:', rows);
    
    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to MySQL:');
    console.error(error);
  }
}

testConnection();