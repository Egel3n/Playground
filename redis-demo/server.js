import { client } from './services/redis-client.js';
import { connection } from "./services/mariadb-client.js"
import {getProduct,getProductss} from './services/cacher.js'

import express from "express";

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  let products = await getProductss([1,21])
  res.send(products);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});