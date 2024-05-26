import React from "react";
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";
import Icon from "../images/whatscooking.png";
import DEVELOPERICON from "../images/Developer_hero_green.png";
import SEARCHPARAMETERS from "../images/SearchParameters.png";
import ATLASUI from "../images/AtlasUI.png";


const IndexPage = () => {
  // INDEX DEFINITIONS IN ATLAS SEARCH
  const AutocompleteIndex = {
    mappings: {
      dynamic: false,
      fields: {
        name: {
          foldDiacritics: false,
          maxGrams: 8,
          minGrams: 3,
          type: "autocomplete",
        },
      },
    },
  };

  const { t } = useTranslation();
  const DefaultIndex = {
    "analyzer": t('languageAnalyzer'),
    "searchAnalyzer": t('languageAnalyzer'),
    "mappings": {
      "dynamic": true,
      "fields": {
        "location": [
          {
            "dynamic": true,
            "type": "document"
          },
          {
            "type": "geo"
          }
        ]
      }
    },
    "synonyms": [
      {
        "analyzer": t('languageAnalyzer'),
        "name": "MenuSynonyms",
        "source": {
          "collection": "menu_synonyms_"+t('locale')
        }
      }
    ]
  };

  const FacetIndex = {
    "analyzer": t('languageAnalyzer'),
    "searchAnalyzer": t('languageAnalyzer'),
    mappings: {
      dynamic: false,
      fields: {
        borough: [
          {
            type: "stringFacet",
          },
          {
            type: "string",
          },
        ],
        cuisine: [
          {
            type: "stringFacet",
          },
          {
            type: "string",
          },
        ],
        location: {
          type: "geo",
        },
        menu: {
          type: "string",
        },
        name: {
          type: "string",
        },
        stars: {
          type: "number",
        },
      },
    },
    synonyms: [
      {
        analyzer: t('languageAnalyzer'),
        name: "MenuSynonyms",
        source: {
          collection: "menu_synonyms_"+t('locale'),
        },
      },
    ],
  };

  const defaultIndexString = JSON.stringify(DefaultIndex, null, 2);
  const autocompleteIndexString = JSON.stringify(AutocompleteIndex, null, 2);
  const facetIndexString = JSON.stringify(FacetIndex, null, 2);
  return (
    <>
      <div
        id="banner"
        className="flex py-10 mx-24 mb-10 rounded bg-gradient-to-r from-san-juan-500 via-san-juan-400 to-deep-cerulean-700"
      >
        <img
          src={Icon}
          alt="app logo"
          className="my-auto w-32 ml-20 pl-30"
        ></img>
        <div className="flex flex-col w-full">
          <div className="my-auto text-4xl font-bold text-white text-center font-body">
            {t('dataAndIndexes')}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-x-8 mx-16 text-2xl justify-center">
        <div className="flex justify-around mx-32">
          <div className="w-1/2 px-8 my-4 text-center text-2xl font-body">
            <span className="text-mongo font-bold">{t('AtlasSearch')}</span> {t('IndexPageStatement1')}
            <br></br>
            <br></br>
            {t('This')}{" "}
            <span className="text-mongo font-bold">
              {t('WhatsCookingRestaurantFinder')}
            </span>{" "}
            {t('IndexPageStatement2')}
            <br></br>
            <span className="w-1/2 mx-auto">
              <img
                src={SEARCHPARAMETERS}
                alt="ATLASUI"
                className="my-8 mx-auto h-24"
              ></img>
            </span>
            {t('IndexPageStatement3')}
          </div>
          <div className="w-1/3">
            <img
              src={ATLASUI}
              alt="ATLASUI"
              className="my-16 border-4 border-light-blue-500 border-opacity-25 shadow-2xl h-128"
            ></img>
          </div>
        </div>
        <div className="flex mx-auto w-full justify-center">
          <div className="text-4xl font-body my-auto text-center font-bold text-mongo-700 mr-10">
            whatscooking {t('data')}:
          </div>
          <SyntaxHighlighter language="javascript" style={okaidia}>
            mongodb+srv://mongodb:atlassearch@whatscooking.8u6sklg.mongodb.net/whatscooking
          </SyntaxHighlighter>
        </div>
        <div className="flex justify-around">
          <div className="w-1/4 ml-10 rounded text-base  p-4">
            <div className="text-2xl font-body text-center font-bold text-indigo-800 ">
              {t('DefaultIndexDefinition')}
            </div>
            <hr
              style={{
                color: "darkgreen",
                backgroundColor: "darkgreen",
                height: 1,
                margin: 24,
                borderColor: "darkgreen",
              }}
            />
            <SyntaxHighlighter language="javascript" style={okaidia}>
              {defaultIndexString}
            </SyntaxHighlighter>
          </div>
          <div className="w-1/4 ml-10 rounded text-base p-4">
            <div className="text-2xl font-body text-indigo-800 text-center font-bold">
              {t('AutocompleteIndexDefinition')}
            </div>
            <hr
              style={{
                color: "darkgreen",
                backgroundColor: "darkgreen",
                height: 1,
                margin: 24,
                borderColor: "darkgreen",
              }}
            />
            <SyntaxHighlighter language="javascript" style={okaidia}>
              {autocompleteIndexString}
            </SyntaxHighlighter>
            <hr
              style={{
                color: "darkgreen",
                backgroundColor: "darkgreen",
                height: 1,
                margin: 72,
                borderColor: "darkgreen",
              }}
            />
            <div className="w-full my-24 mx-auto">
              <img
                src={DEVELOPERICON}
                alt="thinking"
                className="my-auto h-96"
              ></img>
            </div>
          </div>

          <div className="w-1/4 ml-10 rounded text-base p-4">
            <div className="text-2xl font-body text-center font-bold text-indigo-800 ">
              {t('FacetIndexDefinition')}
            </div>
            <hr
              style={{
                color: "darkgreen",
                backgroundColor: "darkgreen",
                height: 1,
                margin: 24,
                borderColor: "darkgreen",
              }}
            />
            <SyntaxHighlighter language="javascript" style={okaidia}>
              {facetIndexString}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
