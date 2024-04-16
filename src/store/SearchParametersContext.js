import React, { useState, createContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const SearchParametersContext = createContext();
// export SearchProvider and SearchContext

export const SearchParametersProvider = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [food, setFood] = useState("");
  const [operator, setOperator] = useState("text");
  const [distance, setDistance] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [functionScore, setFunctionScore] = useState(null);
  const [stars, setStars] = useState(1);
  const [borough, setBorough] = useState();
  const [cuisine, setCuisine] = useState([]);
  const [stages, setStages] = useState({
    searchStage: {},
    limitStage: {},
    projectStage: {},
  });
  const [facetStage, setFacetStage] = useState({});
  const [showDistanceInput, setShowDistanceInput] = useState(false); // USED IN SEARCH SIDE BAR FOR GEOWITHIN OPERATOR OPTION
  const [valid, setValid] = useState(false); // IF VALID SEARCH EXECUTED - WILL SHOW BUTTONS TO CLEAR/AGGREGATION/FUNCTION SCORE
  const [showSuggestions, setShowSuggestions] = useState(false); // FOR AUTOCOMPLETED RESTAURANT NAMES IN SEARCH BAR
  const [showMenu, setShowMenu] = useState(false); // POP UP FOR RESTAURANT MENU ITEMS
  const [index, setIndex] = useState(0);
  const [showAggregation, setShowAggregation] = useState(false); // TO SHOW MODAL FOR AGGREGATION CODE
  const [showFacetCode, setShowFacetCode] = useState(false); // TO SHOW MODAL FOR FACET CODE
  const [showSearchStage, setShowSearchStage] = useState(true);
  const [aggregationErrorMsg, setAggregationErrorMsg] = useState("");
  const [noResultsMsg, setNoResultsMsg] = useState("");
  const [cuisineBuckets, setCuisineBuckets] = useState([]);
  const [boroughBuckets, setBoroughBuckets] = useState([]);
  const [facetOverallCount, setFacetOverallCount] = useState(0);
  const [showFacets, setShowFacets] = useState(false);
  const [language, setLanguage] = useState('en');

  // Set default coordinates to MongoDB NYC Office
  const [lng, setLng] = useState(-73.98474);
  const [lat, setLat] = useState(40.76289);

  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(language).then(() => {
      switch (language) {
        case "en":
          // NYC
          setLng(-73.98474);
          setLat(40.76289);
          break;
        case "jp":
          // Tokyo
          setLng(139.7454);
          setLat(35.6586);
          break;
        case "th":
          // Bangkok
          setLng(100.5865);
          setLat(13.7365);
          break;
        case "id":
          // Jakarta
          setLng(106.823024);
          setLat(-6.193667);
          break;
        default:
          // NYC
          setLng(-73.98474);
          setLat(40.76289);
          break;
      }
    });
  }, [language]);

  const value = {
    restaurants,
    setRestaurants,
    searchTerm,
    setSearchTerm,
    food,
    setFood,
    operator,
    setOperator,
    distance,
    setDistance,
    submitted,
    setSubmitted,
    showAggregation,
    setShowAggregation,
    showFacetCode,
    setShowFacetCode,
    setShowSearchStage,
    showSearchStage,
    functionScore,
    setFunctionScore,
    stars,
    setStars,
    borough,
    setBorough,
    cuisine,
    setCuisine,
    stages,
    setStages,
    facetStage,
    setFacetStage,
    valid,
    setValid,
    showSuggestions,
    setShowSuggestions,
    showMenu,
    setShowMenu,
    index,
    setIndex,
    showDistanceInput,
    setShowDistanceInput,
    noResultsMsg,
    setNoResultsMsg,
    aggregationErrorMsg,
    setAggregationErrorMsg,
    cuisineBuckets,
    setCuisineBuckets,
    boroughBuckets,
    setBoroughBuckets,
    setFacetOverallCount,
    facetOverallCount,
    showFacets,
    setShowFacets,
    language,
    setLanguage,
    lng,
    setLng,
    lat,
    setLat,
  };

  return (
    <SearchParametersContext.Provider value={value}>
      {props.children}
    </SearchParametersContext.Provider>
  );
};

// the provider provides info to components
