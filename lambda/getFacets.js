const { MongoClient } = require("mongodb");
const EJSON = require("ejson");

const { MONGODB_URI } = process.env;

const client = new MongoClient(MONGODB_URI);

exports.handler = async (event) => {
    console.log("IN GETFACETS POST REQUEST");
    console.debug(`Event: ${JSON.stringify(event)}`);
      
    if (!event.body) {
      return {
        statusCode: 400,
        body: {
            ok: false,
            msg: "No payload body",
        }, 
       };
    }
    
    
       
    let searchParameters = EJSON.parse(event.body);
    console.log(JSON.stringify(searchParameters));
      
       
    let { searchTerm, food, operator, dist, stars, borough, cuisine, locale, lng, lat } = searchParameters;
  
    if (lng === undefined || lat === undefined) {
      lng = -73.98474;
      lat = 40.76289;

      console.log('Longitude or Latitude is not defined. Using default values')
    }

    // Querying a mongodb collection:
    await client.connect();
    const collection = client.db('whatscooking').collection(`restaurants_${locale}`);
    
    let pathArray = ["name", "cuisine"];
    let distance = 1609;
    const METERS_PER_MILE = 1609.0;
    //const METERS_PER_KM = 1000;
    
    let foodArray =  [];
    if (food){
      foodArray = food.split(',').map(item=>item.trim());
    }
  
    if (stars){
      stars = parseFloat(stars);
      console.log("STARS", stars);
    }
    
    if (dist){
      dist = parseFloat(dist);
      distance = dist * METERS_PER_MILE;        // changed to km
    }
     
    // NOW I CAN BUILD query
    let synObject={};
    let geoSearchObject = {};
    let textObject ={};
    let compoundObject={};
    let starsObject ={};
    let filterArray=[]; 
    
    let facetOperatorObject={};
    
    let ObjectCounter = 0;
  
  
    if (searchTerm){
      
      ObjectCounter++;
      textObject = {
          text:{
            query:searchTerm,
            path: pathArray,
            // fuzzy:{
            //  maxEdits:2
            // }
          }
        };
        facetOperatorObject = textObject;
    }
    
    if (foodArray.length>0){
      console.log("MENU - LOOK FOR SYNONYMS");
      console.log(foodArray.length);
      console.log(JSON.stringify(foodArray));
      
      ObjectCounter++;
      synObject = {
        text:{
          query:foodArray,
          path: "menu",
          synonyms:"MenuSynonyms"
        }
      };
      facetOperatorObject = synObject;
      console.log(facetOperatorObject);
    } 
    
    if (operator!=='text'){
      ObjectCounter++;
      if (operator === 'near'){
          geoSearchObject = {
              "near":{
                     "origin":{
                        "type":"Point",
                        "coordinates": [ lng, lat ],
                      },
                    "pivot":1609,
                     path: "location" 
                   }
          };
        } else {
          geoSearchObject ={ 
            geoWithin:{
              circle:{
                center:{
                  type:"Point",
                 "coordinates": [ lng, lat ],
                  },
                  radius:distance
                  // radius:dist
                },
                path:"location"
            }
          };
        }
        facetOperatorObject = geoSearchObject;
    }
  
    if ((ObjectCounter > 1 ) || (stars>1)){     
        compoundObject = {
          compound:{
            must:[
              //  textObject, synObject, geoSearchObject
              ],
            filter:[
              // filterArray
              ]
          }
        };
        
        if (!isEmpty(textObject)){
          compoundObject.compound.must.push(textObject);
        }
        
        if (!isEmpty(synObject)) {
          compoundObject.compound.must.push(synObject);
        }
        
        if(!isEmpty(geoSearchObject)){
          compoundObject.compound.must.push(geoSearchObject);
        }
    
    
      filterArray = buildCompoundFilter(stars, cuisine, borough);
      if (filterArray.length>0){
        compoundObject.compound.filter = filterArray;
      }
        
      facetOperatorObject= compoundObject;
      }       // NOW I HAVE FINISHED BUILDING facetOperatorObject
      
   
        
      
      console.log("OPERATOR ", JSON.stringify(facetOperatorObject));
      const facetOperatorString = JSON.stringify(facetOperatorObject);
      const searchMetaStage = { 
        "$searchMeta": {
          index: 'facetIndex',
            "facet": {
              "operator": facetOperatorObject,
            "facets":{
              "cuisineFacet": {
                "type": "string",
                "path": "cuisine"
              },
              "boroughFacet" : {
                "type" : "string",
                "path" : "borough"
              }
            }}
          }
        };
        
      const searchMetaStageString = JSON.stringify(searchMetaStage);
     
      const results = await collection.aggregate([
        searchMetaStage
      ]).toArray();

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
            results: results,
            searchMetaStageString: searchMetaStageString,
            searchMetaStage: searchMetaStage,
            ok: true,
        }, 
       };      
  };
  
  
  // HELPER FUNCTION TO SEE IF OBJECTS ARE EMPTY
  function isEmpty(obj){
    for (var key in obj){
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
  
  function buildCompoundFilter(stars, cuisine, borough){
    console.log("IN BUILDCOMPOUNDFILTER FUNCTION");
    
    
    let UseCompoundFilterOperator = false;
    
     let starsObject ={};
     let cuisineObject ={};
     let boroughObject={};
     
     let filterArray=[];    // this array is what I will build and return
     
     if (stars>1){
          UseCompoundFilterOperator= true;		// because using filter
  
             starsObject ={
              range:{
                gte:stars,
                path:"stars"
              }
          };
            console.log("STARS OBJECT: " + stars);
        }
  
        if (cuisine && cuisine.length !==0){
            UseCompoundFilterOperator= true;		// because using filter
          cuisineObject = {
              text:{
                query:cuisine,
                path: "cuisine"
              }
          };
      }    
      
      if (borough){
          UseCompoundFilterOperator= true;		// because using filter
            boroughObject ={
              text:{
                query:borough,
                path:"borough"
              }
            };
      }
  
      if (UseCompoundFilterOperator){
          if (!isEmpty(starsObject)){
            filterArray.push(starsObject);
          }
            if (!isEmpty(cuisineObject)) {
            filterArray.push(cuisineObject);
          }
          
          if(!isEmpty(boroughObject)){
            filterArray.push(boroughObject);
          }
          
      }  
        
        console.log("FILTER ARRAY RETURNED FROM BUILDCOMPOUNDFILTER", JSON.stringify(filterArray));
        
    
    return filterArray;
   
  }
  