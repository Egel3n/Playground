import {
  connection,
  getProductFromDB,
  getProductSFromDB,
} from "./mariadb-client.js";
import { client } from "./redis-client.js";

const getProduct = async (id) => {
  const key = `products:${id}`;
  const exist = await client.EXISTS(key);
  if (exist) {
    let result = await client.hGetAll(key);
  } else {
    return await getProductFromDB(id);
  }
};

const getProductss = async (ids) => {
  let products = [];
  let notCachedIDs = [];
  for (const id of ids) {
    const key = `products:${id}`;
    const exist = await client.EXISTS(key);
    if (exist) {
      let result = await client.hGetAll(key);
      products.push(result);
    } else {
      notCachedIDs.push(id);
    }
  }

  if (notCachedIDs.length > 0) {
    const results = await getProductSFromDB(notCachedIDs);
    results.forEach((p) => products.push(p));
  }

  return products;
};

export { getProduct, getProductss };
