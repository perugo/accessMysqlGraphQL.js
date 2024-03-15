const mysql = require('mysql2/promise');


async function testDatabaseConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'db-publicly-accessible-instance-1.cxyyeu6qem9f.ap-northeast-1.rds.amazonaws.com',
      user: 'admin',
      database: 'sys',
      password: 'helloworld',
      port: 3306
    });
    console.log('Connection successful!');
    connection.end();
  } catch (error) {
    console.error('Connection failed: ', error);
  }
}

testDatabaseConnection();