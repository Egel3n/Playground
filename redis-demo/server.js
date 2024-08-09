import { client } from './services/redis-client.js';
import { connection , checkUser} from "./services/mariadb-client.js"
import {getProduct,getProductss} from './services/cacher.js'

import RedisStore from "connect-redis"
import session from "express-session"

import express from "express";
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;


app.use(bodyParser.json())
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

app.use(cookieParser())

// sends a cokkie named connect.sid to browser. with this sid creates a session in redis like myapp:<sid> 
app.get('/', async (req, res) => {
  console.log(req.session)
  if (req.session.views) {
    req.session.views++;  
} else {
  req.session.views = 1 ;
}
res.send(`${req.session.username}'s Views:${req.session.views}`)
});

app.post('/login', async (req,res)=>{
  console.log(req)
  const uName = req.body.username;
  const pWord = req.body.password;
  console.log(uName)
  const result = await checkUser(uName,pWord);
  if (result == undefined){
    res.send("WRONG")
    return
  }
   req.session.username = result.name;
   res.send("Logged In")
}
)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

