import React, { useEffect, useContext } from "react";
import ReactStars from "react-rating-stars-component";

import { SearchStageContext } from "../store/SearchStageContext";
import { SearchParametersContext } from '../store/SearchParametersContext';
import FACETICON from "../images/filterfacet.png";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTranslation } from 'react-i18next';

const SearchSideBar = ({
  setOperator,
  operator,
  distance,
  setDistance,
  setShowDistanceInput,
  showDistanceInput,
  setStars,
  stars,
  borough,
  setBorough,
  cuisine,
  setCuisine,
  boroughBuckets,
  cuisineBuckets,
  facetOverallCount,
  showFacets,
  setShowFacetCode,
  defaultCuisineBuckets,
  defaultBoroughBuckets,
}) => {
  const {
    showStars,
    setShowStars,
    showCuisine,
    setShowCuisine,
    showBorough,
    setShowBorough,
    showGeo,
    setShowGeo,
    geoString,
    setGeoString,
    setGeoObject,
    setBoroughObject,
    boroughObject,
    cuisineObject,
    setCuisineObject,
    setStarsObject,
    starsObject,
  } = useContext(SearchStageContext);

  const {
    lng, lat,
  } = useContext(SearchParametersContext);

  const { t } = useTranslation();

  //------------------------CUISINE FACETS----------------------------------------------
  const updatedCuisineBuckets = defaultCuisineBuckets.map(defaultCuisine => {
      const matchedCuisine = cuisineBuckets.find(cuisine => cuisine._id === defaultCuisine._id);
      return {
          ...defaultCuisine,
          count: matchedCuisine ? matchedCuisine.count : defaultCuisine.count
      };
  });

  // Add the "Others" category if it doesn't exist in defaultCuisineBucket
  let otherCuisineBucket = updatedCuisineBuckets.find(cuisine => cuisine._id === t("Other"));
  if (!otherCuisineBucket) {
      otherCuisineBucket = { "_id": t("Other"), "count": 0 };
      updatedCuisineBuckets.push(otherCuisineBucket);
  }

  // Add counts from cuisineBuckets that don't match any defaultCuisineBucket
  cuisineBuckets.forEach(cuisine => {
      const isMatched = defaultCuisineBuckets.some(defaultCuisine => defaultCuisine._id === cuisine._id);
      if (!isMatched) {
          otherCuisineBucket.count += cuisine.count;
      }
  });

  let cuisines = {};
  updatedCuisineBuckets.forEach(updatedCuisine => {
    cuisines[updatedCuisine._id] = updatedCuisine.count
  });

  //------------------------BOROUGH FACETS----------------------------------------------
  const updatedBoroughBuckets = defaultBoroughBuckets.map(defaultBorough => {
      const matchedBorough = boroughBuckets.find(borough => borough._id === defaultBorough._id);
      return {
          ...defaultBorough,
          count: matchedBorough ? matchedBorough.count : defaultBorough.count
      };
  });

  // Add the "Others" category if it doesn't exist in defaultCuisineBucket
  let otherBoroughBucket = updatedBoroughBuckets.find(borough => borough._id === t("Other"));
  if (!otherBoroughBucket) {
      otherBoroughBucket = { "_id": t("Other"), "count": 0 };
      updatedBoroughBuckets.push(otherBoroughBucket);
  }

  // Add counts from cuisineBuckets that don't match any defaultCuisineBucket
  boroughBuckets.forEach(borough => {
      const isMatched = defaultBoroughBuckets.some(defaultBorough => defaultBorough._id === borough._id);
      if (!isMatched) {
          otherBoroughBucket.count += borough.count;
      }
  });

  let boroughs = {};
  updatedBoroughBuckets.forEach(updatedBorough => {
    boroughs[updatedBorough._id] = updatedBorough.count
  });

  const ratingChanged = (rating) => {
    setStars(rating);
  };

  useEffect(() => {
    if (operator === "text") {
      setShowGeo(false);
      return;
    }
    if (operator === "geoWithin") {
      setGeoString(geoWithinString);
      setGeoObject(geoWithinObject);
    } else if (operator === "near") {
      setGeoString(nearString);
      setGeoObject(nearObject);
    }

    setShowGeo(true);

    // eslint-disable-next-line
  }, [operator, distance]);

  useEffect(() => {
    if (stars === 1) {
      return;
    }
    setStarsObject({
      range: {
        gte: stars,
        path: "stars",
      },
    });

    setShowStars(true);

    // eslint-disable-next-line
  }, [stars]);

  useEffect(() => {
    if (cuisine.length === 0) {
      setShowCuisine(false);
      return;
    }
    setCuisineObject({
      text: {
        query: cuisine,
        path: "cuisine",
      },
    });
    setShowCuisine(true);
    // eslint-disable-next-line
  }, [cuisine]);

  useEffect(() => {
    if (!borough) {
      setShowBorough(false);
      return;
    }
    setBoroughObject({
      text: {
        query: borough,
        path: "borough",
      },
    });

    setShowBorough(true);

    // eslint-disable-next-line
  }, [borough]);

  const onChangeBorough = (e) => {
    setBorough(e.target.value);
  };

  const onChangeCuisine = (e) => {
    let { name, checked } = e.target;
    if (checked) {
      setCuisine((prevCuisine) => [...prevCuisine, name]);
    }
    if (checked === false) {
      let cuisineArray = cuisine.filter((item) => item !== name);
      setCuisine(cuisineArray);
    }
  };

  const starString = JSON.stringify(starsObject, null, 2);

  const boroughString = JSON.stringify(boroughObject, null, 2);

  const cuisineString = JSON.stringify(cuisineObject, null, 2);

  let active =
    "w-1/2 h-12 my-auto text-white bg-gradient-to-r from-mongo-700 to-mongo-600 border border-green-700 rounded hover:shadow-2xl hover:bg-green-700 transform hover:scale-110 focus:outline-none";
  let inactive =
    "w-1/2 h-12 my-auto text-white bg-gray-700 border border-black rounded hover:shadow-2xl hover:bg-green-800 transform hover:scale-110 focus:outline-none";

  const METERS_PER_MILE = 1609.0;

  let dist = parseFloat(distance) * METERS_PER_MILE;

  const geoWithinObject = {
    geoWithin: {
      circle: {
        center: {
          type: "Point",
          coordinates: [lng, lat],
        },
        radius: dist,
      },
      path: "location",
    },
  };

  const geoWithinString = JSON.stringify(geoWithinObject, null, 2);

  const nearObject = {
    near: {
      origin: {
        type: "Point",
        coordinates: [lng, lat],
      },
      pivot: 1609,
      path: "location",
    },
  };
  const nearString = JSON.stringify(nearObject, null, 2);

  return (
    <>
      <div className="flex flex-col bg-white border border-gray-300 rounded w-1/5">
        {/************* SEARCH OPERATOR SECTION ******************/}
        <label className="font-bold text-tolopea-500 text-center mt-2">
          {t('geospatialSearchOptions')}
        </label>
        <div className="flex h-12 px-1 ">
          {operator === "near" ? (
            <button
              type="button"
              className={active}
              onClick={() => setOperator("text")}
            >
              near
            </button>
          ) : (
            <button
              type="button"
              className={inactive}
              onClick={() => setOperator("near")}
            >
              near
            </button>
          )}
          {operator === "geoWithin" ? (
            <button
              type="button"
              className={active}
              onClick={() => {
                setOperator("text");
                setShowDistanceInput(false);
              }}
            >
              geoWithin
            </button>
          ) : (
            <button
              type="button"
              className={inactive}
              onClick={() => {
                setOperator("geoWithin");
                setShowDistanceInput(true);
              }}
            >
              geoWithin
            </button>
          )}
        </div>
        {showDistanceInput && (
          <div className="flex items-center pb-2 mx-4">
            <label className="font-bold text-san-juan-800">Distance: </label>
            <input
              type="text"
              placeholder={distance}
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              className="w-16 mx-auto leading-10 text-center bg-transparent rounded outline-none"
            ></input>
          </div>
        )}
        {showGeo && (
          <div
            onClick={() => {
              setShowGeo(false);
            }}
          >
            <SyntaxHighlighter language="javascript" style={atomDark}>
              {geoString}
            </SyntaxHighlighter>
          </div>
        )}

        <br />

        {/************* STAR RATING SECTION ******************/}

        <div className="mx-auto">
          <label className="font-bold text-tolopea-500">
            {t('averageStarRating')}:{" "}
          </label>
          <ReactStars
            size={36}
            activeColor="#ffd700"
            onChange={ratingChanged}
            count={5}
            color="black"
            isHalf="true"
            value={stars}
          />
        </div>

        {showStars && (
          <div
            onClick={() => {
              setShowStars(false);
            }}
          >
            <SyntaxHighlighter language="javascript" style={atomDark}>
              {starString}
            </SyntaxHighlighter>
          </div>
        )}

        <hr
          style={{
            color: "darkgreen",
            backgroundColor: "darkgreen",
            height: 1,
            margin: 4,
            borderColor: "darkgreen",
          }}
        />
        <br />

        {/************* CUISINE TYPE SECTION ******************/}
        {showFacets && (
          <div className="text-deep-cerulean-600 text-xl ml-10 mb-4">
            Overall Count: {facetOverallCount}
          </div>
        )}

        <div className="" onChange={onChangeCuisine}>
            {Object.keys(cuisines).map((cuisineKey) => (
              <div key={cuisineKey} className="flex mb-2 ml-10 space-x-6 cursor-pointer">
                <input
                  type="checkbox"
                  name={cuisineKey}
                  defaultChecked={cuisine.includes(cuisineKey)}
                />
                <label htmlFor={cuisineKey}>{cuisineKey}</label>
                {showFacets && (
                  <div className="text-deep-cerulean-600">({cuisines[cuisineKey]})</div>
                )}
              </div>
            ))}
        </div>

        {showCuisine && (
          <div
            onClick={() => {
              setShowCuisine(false);
            }}
          >
            <SyntaxHighlighter language="javascript" style={atomDark}>
              {cuisineString}
            </SyntaxHighlighter>
          </div>
        )}

        <hr
          style={{
            color: "darkgreen",
            backgroundColor: "darkgreen",
            height: 1,
            margin: 4,
            borderColor: "darkgreen",
          }}
        />
        <br />

        {/************* BOROUGH SECTION ******************/}

        <div className="" onChange={onChangeBorough}>
            {Object.keys(boroughs).map((boroughKey) => (
              <div key={boroughKey} className="flex mb-2 ml-10 space-x-6 cursor-pointer borough">
                <input
                  type="radio"
                  name="borough"
                  value={boroughKey}
                  defaultChecked={borough === boroughKey}
                />
                <label htmlFor={boroughKey}>{boroughKey}</label>
                {showFacets && (
                  <div className="text-deep-cerulean-600">({boroughs[boroughKey]})</div>
                )}
              </div>
            ))}
            {Object.keys(boroughs).length > 0 && (
              <div className="mb-2 ml-10 space-x-6 cursor-pointer checkbox-borough">
                <input
                  type="radio"
                  name="borough"
                  value={null}
                  defaultChecked={borough === null}
                />
                <label>All</label>
              </div>
            )}
        </div>

        {showBorough && (
          <div
            onClick={() => {
              setShowBorough(false);
            }}
          >
            <SyntaxHighlighter language="javascript" style={atomDark}>
              {boroughString}
            </SyntaxHighlighter>
          </div>
        )}
        <button
          onClick={() => setShowFacetCode(true)}
          type="button"
          className="mx-auto relative w-2/3 flex space-x-4 my-10 font-body font-bold shadow-lg bg-gradient-to-r from-mongo-500 to-mongo-600 border-b-4 border-r-2 border-solid border-mongo-700 rounded-lg"
        >
          <img
            src={FACETICON}
            alt="app logo"
            className="absolute -left-6 -bottom-4 my-auto w-20 h-20 rounded-full mx-auto bg-white border-t-2 border-l-2 border-b-4 border-r-4 border-solid border-mongo-600"
          ></img>
          <div className="relative text-2xl my-auto text-white  font-extrabold font-body pr-4 pl-12 py-2">
            facet
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -right-0  h-12 w-12 my-auto text-white bg-black rounded-lg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </>
  );
};
export default SearchSideBar;
