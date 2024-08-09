import { client , create_session} from './services/redis-client.js';
import { connection , checkUser} from "./services/mariadb-client.js"
import {getProduct,getProductss} from './services/cacher.js'

import RedisStore from "connect-redis"
import session from "express-session"

import express from "express";
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

let redisStore = new RedisStore({
  client: client,
  prefix: "myapp:",
})

app.use(session({
  store: redisStore,
  secret: 'egelen',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.json())
app.use(cookieParser())


app.get('/', async (req, res) => {
  console.log(req.session)
  if (req.session.views) {
    req.session.views++;
} else {
    req.session.views = 1;
}
res.send(`Views: ${req.session.views}`);
  console.log(req.session)
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

