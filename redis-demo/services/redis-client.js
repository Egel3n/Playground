import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();




async function save_product(db_object){
    console.log(db_object)
    try{
        const results = await client.hSet(`products:${db_object.id}`,{
            id:db_object.id,
            name:db_object.name,
            price:db_object.price
        })
        console.log("result: "+results)
    } catch(err) {
        return {error:err}
    } finally{
        console.log(db_object.name + " cached.")
    }

}

async function create_session(db_object){
    try{
        const key = `sessions:${db_object.id}`
        const sessionKey = await client.hSet(key,{key:Math.random()*10})
        client.expireAt(key,parseInt((+new Date) / 1000) + 600)
        return sessionKey
    }catch(err){
        return {error:err}
    }finally{
        console.log("session created for "+db_object.name)
    }

}

export {client,save_product,create_session}