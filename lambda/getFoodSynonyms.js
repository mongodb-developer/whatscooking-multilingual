const { MongoClient } = require("mongodb");

const { MONGODB_URI } = process.env;

const client = new MongoClient(MONGODB_URI);

exports.handler = async (event) => {
    console.log("Returning all food synonyms");
    console.debug(`Event: ${JSON.stringify(event)}`);
  
    let synonyms = event.queryStringParameters.synonyms;
    let locale = event.queryStringParameters.locale;

    await client.connect();
    const collection = client.db('whatscooking').collection(`menu_synonyms_${locale}`);
    
    const foodSynonyms = await collection.find({}).toArray();
   
    // https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html
    return {
        statusCode: 200,
        body: {
            foodSynonyms,
            ok:true,
        }, 
    };
};
