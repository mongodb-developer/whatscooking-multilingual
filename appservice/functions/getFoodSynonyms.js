// This function is the webhook's request handler.
exports = async function(payload, response) {
  console.log("Returning all food synonyms");
 

  let synonyms = payload.query.synonyms;
  let locale = payload.query.locale;
  // Querying a mongodb service:
  const collection = context.services.get("mongodb-atlas").db("whatscooking").collection('menu_synonyms_' + locale);
  
  const foodSynonyms = await collection.find({'synonyms':synonyms}).toArray();
  

 return {foodSynonyms, ok:true};
};
