import {
  connection,
  getProductFromDB,
  getProductSFromDB,
} from "./mariadb-client.js";
import { client , save_product} from "./redis-client.js";

const getProduct = async (id) => {
  const key = `products:${id}`;
  const exist = await client.EXISTS(key);
  if (exist) {
    let result = await client.hGetAll(key);
  } else {
    const db_object = await getProductFromDB(id);
    const saved = save_product(db_object)
    if(saved?.error !== null){
      console.log(saved.error)
    }
    return db_object
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
    results.forEach((p) => {
      products.push(p);
      const saved = save_product(p); 
      if(saved?.error !== null){
      console.log(saved.error);
    }});
  }

  return products;
};

export { getProduct, getProductss };
