const mysql = require('mysql2/promise');

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'db-publicly-accessible-instance-1.cxyyeu6qem9f.ap-northeast-1.rds.amazonaws.com', // ここをあなたのRDSのホスト名に置き換えてください
    user: 'admin', // ここをあなたのデータベースユーザー名に置き換えてください
    database: 'recipeDB', // ここをあなたのデータベース名に置き換えてください
    password: 'helloworld', // ここをあなたのデータベースパスワードに置き換えてください
    port: 3306 // MySQLのデフォルトポート。PostgreSQLの場合は5432に変更してください。

  });
  return connection;
}

async function fetchData() {
  const connection = await connectToDatabase();
  
  try {
    const [rows] = await connection.query('select * from recipes');
    console.log(JSON.stringify(rows)); // JSON形式でコンソールに出力
    return rows; // このJSONオブジェクトを必要に応じて使用
  } catch (error) {
    console.error('Error fetching data: ', error);
  } finally {
    connection.end();
  }
}


fetchData();