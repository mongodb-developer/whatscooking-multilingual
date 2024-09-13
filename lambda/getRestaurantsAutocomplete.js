const { MongoClient } = require("mongodb");

const { MONGODB_URI } = process.env;

const client = new MongoClient(MONGODB_URI);

exports.handler = async (event) => {
  console.log("IN GETRESTAURANTS_AUTOCOMPLETE REQUEST");
  console.debug(`Event: ${JSON.stringify(event)}`);
   
  let restname = event.queryStringParameters.restname;
  let locale = event.queryStringParameters.locale;
 
  await client.connect();
  const collection = client.db('whatscooking').collection(`restaurants_${locale}`);
  
  //aggregation array
  let calledAggregation = [
    {
      '$search': {
        'index': 'autocomplete', 
        'autocomplete': {
          'query': restname, 
          'path': 'name', 
          'tokenOrder': 'any', 
          'fuzzy': {
            'maxEdits': 1, 
            'prefixLength': 1, 
            'maxExpansions': 256
          }
        }
      }
    }, {
      '$project': {
        'name': 1, 
        'restaurant_id': 1
        }
      }, {
        '$limit': 9
    }
  ];
  
  let names = await collection.aggregate(calledAggregation).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(names), 
  };

};
