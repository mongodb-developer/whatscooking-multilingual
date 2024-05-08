exports = async function(payload){
   
  let restname = payload.query.restname;
  let locale = payload.query.locale;
 
  const collection = context.services.get("mongodb-atlas").db("whatscooking").collection("restaurants_" + locale);
  
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
   
  return names;

};
