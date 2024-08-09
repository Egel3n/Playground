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

export {client,save_product}