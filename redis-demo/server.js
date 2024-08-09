import { client , create_session} from './services/redis-client.js';
import { connection , checkUser} from "./services/mariadb-client.js"
import {getProduct,getProductss} from './services/cacher.js'


import express from "express";
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json())
app.use(cookieParser())

app.get('/', async (req, res) => {
  let products = await getProductss([1,21])
  res.send(products);
});

app.post('/login', async (req,res)=>{
  const uName = req.body.username;
  const pWord = req.body.password;
  const result = await checkUser(uName,pWord);
  console.log(result)
  if(result?.error !== undefined){
    console.log(result.error)
    return
  }
  const sessionKey = create_session(result)
  res.cookie("sessionKey",sessionKey)
  res.send("Successful")
  
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

