import mysql from "mysql2/promise";

// Create the connection to database
const connection = await mysql.createConnection({
  host: "localhost",
  user: "egelen",
  database: "mysql",
  password: "123456",
});

async function getProductFromDB(id) {
  try {
    const [results] = await connection.query(
      `SELECT * FROM products WHERE id = ${id}`
    );
    return results;
  } catch (err) {
    return { err: err };
  }
}

async function getProductSFromDB(ids) {
  const [results] = await connection.query(
    "SELECT * FROM products WHERE id IN (?)",
    ids
  );
  return results;
}

export { connection, getProductFromDB, getProductSFromDB };
