
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2/promise');

// GraphQL スキーマの定義
const schema = buildSchema(`

  type Ingredient {
    name: String
    amount: String
  }

  type Recipe {
    id: String
    title: String
    frontImg:String
    description:String
    author:String
    servings:String
    ingredients: [Ingredient]
    instructions:[String]
  }

  type Query {
    hello: String
    recipes: [Recipe]
    recipe(id: Int): Recipe

  }
`);


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

async function fetchAllRecipes() {
  const connection = await connectToDatabase();
  try {
    const [rows] = await connection.query('SELECT id,title,frontImg FROM recipes');
    return rows;
  } catch (error) {
    console.error('Error fetching all recipes: ', error);
    throw error;
  } finally {
    await connection.end();
  }
}



// ルートのリゾルバ
const root = {
  hello: () => 'Hello, world!',
  recipes: async () => await fetchAllRecipes(),
};

// Expressサーバーの作成
const app = express();
const cors = require('cors');
app.use(cors());
// GraphQLエンドポイントの設定
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// サーバーの起動
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));