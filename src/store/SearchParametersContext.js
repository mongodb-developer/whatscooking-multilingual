import React, { useState, createContext, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export const SearchParametersContext = createContext();
// export SearchProvider and SearchContext

export const SearchParametersProvider = (props) => {

  const defaultCuisines = {
    en: [
      { _id: 'American', count: 0 },
      { _id: 'Chinese', count: 0 },
      { _id: 'French', count: 0 },
      { _id: 'Hamburgers', count: 0 },
      { _id: 'Italian', count: 0 },
      { _id: 'Japanese', count: 0 },
      { _id: 'Mexican', count: 0 },
      { _id: 'Pizza', count: 0 },
      { _id: 'Bakery', count: 0 },
    ],
    jp: [
      { _id: 'イタリアン', count: 0 },
      { _id: 'カフェ', count: 0 },
      { _id: 'フレンチ', count: 0 },
      { _id: 'ベーカリー', count: 0 },
      { _id: 'ラーメン', count: 0 },
      { _id: '中華料理', count: 0 },
      { _id: '寿司', count: 0 },
      { _id: '居酒屋', count: 0 },
      { _id: '焼肉', count: 0 },
    ],
    th: [
      { _id: 'TODO', count: 0 },
    ],
    id: [
      { _id: 'Kopi', count: 0 },
      { _id: 'Meksiko', count: 0 },
      { _id: 'Cina', count: 0 },
      { _id: 'Es Krim', count: 0 },
      { _id: 'Perancis', count: 0 },
      { _id: 'Thailand', count: 0 },
      { _id: 'Vietnam', count: 0 },
      { _id: 'Timur Tengah', count: 0 },
      { _id: 'Roti', count: 0 },
      { _id: 'Italia', count: 0 },
      { _id: 'Korea', count: 0 },
      { _id: 'Indonesia', count: 0 },
      { _id: 'India', count: 0 },
      { _id: 'Jepang', count: 0 },
      { _id: 'Amerika', count: 0 }
    ]
  }

  const defaultBoroughs = {
    en: [
      { _id: 'Manhattan', count: 0 },
      { _id: 'Brooklyn', count: 0 },
      { _id: 'Queens', count: 0 },
      { _id: 'Bronx', count: 0 },
      { _id: 'Staten Island', count: 0 },
    ],
    jp: [
      { _id: '世田谷区', count: 0 },
      { _id: '中央区', count: 0 },
      { _id: '八王子市', count: 0 },
      { _id: '千代田区', count: 0 },
      { _id: '台東区', count: 0 },
      { _id: '品川区', count: 0 },
      { _id: '新宿区', count: 0 },
      { _id: '渋谷区', count: 0 },
      { _id: '港区', count: 0 },
      { _id: '町田市', count: 0 },
      { _id: '目黒区', count: 0 },
      { _id: '豊島区', count: 0 },
    ],
    th: [
      { _id: 'TODO', count: 0 },
    ],
    id: [
      { _id: 'Kebon Sirih', count: 0 },
      { _id: 'Kebon Kacang', count: 0 },
      { _id: 'Kebon Melati', count: 0 },
      { _id: 'Gondangdia', count: 0 },
      { _id: 'Menteng', count: 0 },
      { _id: 'Kampung Bali', count: 0 },
      { _id: 'Gambir', count: 0 }
    ]
  }

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
  const [cuisineBuckets, setCuisineBuckets] = useState(defaultCuisines["en"]);
  const [boroughBuckets, setBoroughBuckets] = useState(defaultBoroughs["en"]);
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
    setCuisineBuckets(defaultCuisines[language]);
    setBoroughBuckets(defaultBoroughs[language]);
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
