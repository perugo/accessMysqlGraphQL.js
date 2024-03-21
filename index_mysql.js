const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mysql = require('mysql2/promise');
// GraphQL スキーマの定義

/*


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

*/
const schema = buildSchema(`

type Ingredient {
  name: String
  amount: String
}

type Category {
  categoryName: String
  ingredients: [Ingredient]
}

type Recipe {
  id: String
  title: String
  frontImg: String
  description: String
  author: String
  serving: String
  categories: [Category]
  instructions: [String]
}

type Query {
  recipes: [Recipe]
  recipe(id: String): Recipe
}

`);

async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost', // ここをあなたのRDSのホスト名に置き換えてください
    user: 'root', // ここをあなたのデータベースユーザー名に置き換えてください
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
async function fetchRecipe(id) {
  const connection = await connectToDatabase();
  try {
    // Fetch basic recipe information
    const [recipeResults] = await connection.query('SELECT * FROM recipes WHERE id = ?', [id]);
    if (recipeResults.length === 0) return null;
    const recipe = recipeResults[0];

    // Fetch related ingredients
    const [ingredientsResults] = await connection.query('SELECT * FROM ingredients WHERE recipe_id = ?', [id]);

    // Group ingredients by category
    const ingredientsByCategory = ingredientsResults.reduce((acc, ingredient) => {
      if (!acc[ingredient.category]) acc[ingredient.category] = [];
      acc[ingredient.category].push({ name: ingredient.name, amount: ingredient.amount });
      return acc;
    }, {});

    // Fetch related instructions
    const [instructionsResults] = await connection.query('SELECT * FROM instructions WHERE recipe_id = ?', [id]);
    const instructions = instructionsResults.map(instruction => instruction.instruction);

    // Combine into final recipe object
    return {
      ...recipe,
      categories: Object.keys(ingredientsByCategory).map(categoryName => ({
        categoryName,
        ingredients: ingredientsByCategory[categoryName]
      })),
      instructions
    };
  } catch (error) {
    console.error('Error fetching recipe: ', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// ルートのリゾルバ
const root = {
  hello: () => 'Hello, world!',
  recipes: async () => await fetchAllRecipes(),
  recipe: async({id}) => await fetchRecipe(id),
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