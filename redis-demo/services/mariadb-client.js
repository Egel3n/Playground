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

async function checkUser(uName,pWord){
  try {
    const result = await connection.query(
      `SELECT * FROM users WHERE name = '${uName}'`
    );
    if (pWord == result[0][0].age){
      return result[0][0]
    }else{
      return {error:"Password Wrong"}
    }
  } catch (err) {
    return { err: err };
  }
}

export { connection, getProductFromDB, getProductSFromDB, checkUser };
