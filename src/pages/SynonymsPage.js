import React, { useState, useEffect } from "react";
import SynonymForm from "../components/SynonymForm";
import SynonymCard from "../components/SynonymCard";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

import Icon from "../images/whatscooking.png";
import IdeasIcon from "../images/foodIdeas.png";
import SYNCOL from "../images/SynonymCol.png";
import DocHero from "../images/DocModelHero.JPG";
import { useTranslation } from 'react-i18next';

const { REACT_APP_GETSYNONYMS_SECRET } = process.env;

const SynonymsPage = () => {
  const [loadedSynonyms, setLoadedSynonyms] = useState([]);
  const [showSynForm, setShowSynForm] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  
  const { t, i18n } = useTranslation();

  const getSynonyms = async () => {
    let storedSynonyms = await (
      await fetch(
        `https://nqez7rq6c6hkbsydjsf3ktpfru0qkaan.lambda-url.ap-southeast-1.on.aws?locale=${t('locale')}`
      )
    ).json();
    setLoadedSynonyms(storedSynonyms.foodSynonyms);
    console.log(storedSynonyms);
  };
  useEffect(() => {
    getSynonyms();
    console.log("GETTING SYNONYMS");
  }, [deleteMessage, submissionMessage, i18n.language]); // add all external values your effect function depends on - none in this case

  const equivalentDocument = {
    mappingType: "equivalent",
    synonyms: ["pie", "cobbler", "tart"],
  };

  const explicitDocument = {
    mappingType: "explicit",
    input: ["baked goods"],
    synonyms: ["bread", "cake", "cookies", "rolls"],
  };

  const synonymIndex = {
    synonyms: [
      {
        analyzer: "lucene.standard",
        name: "MenuSynonyms",
        source: {
          collection: "menu_synonyms",
        },
      },
    ],
  };

  const equivalentString = JSON.stringify(equivalentDocument, null, 2);
  const explicitString = JSON.stringify(explicitDocument, null, 2);
  const synIndexString = JSON.stringify(synonymIndex, null, 2);

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
            {t('SynonymsInAtlasSearch')}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex mx-12 text-2xl justify-evenly">
          <div className="w-1/4 my-auto">
            <img src={IdeasIcon} alt="thinking" className="my-auto"></img>
          </div>

          <div className="my-auto w-1/4 text-center">
            <div className="text-center text-3xl">
              {t('YouSayPop')}  
              <span className="text-6xl">🥤</span>
            </div>
            <div className="text-center text-2xl">
              <br></br>{t("CallItWhatYouWill")}
            </div>

            <button
              type="button"
              className="flex justify-center my-auto mt-12 w-full mx-auto h-20 px-4 space-x-4 text-3xl text-white rounded bg-gradient-to-r from-mongo-500 to-green-700 font-body hover:shadow-2xl hover:bg-green-700 focus:outline-none"
              // onClick={() => {
              //   setShowSynForm(true);
              //   setSubmissionMessage("");
              // }}
            >
              <span className="my-auto">{t('OurCustomSynonyms')}</span>
              <div className="flex items-center justify-center w-14 mt-2 h-14 text-6xl rounded-full bg-white">
                🍽️
              </div>
            </button>
          </div>

          {showSynForm ? (
            <SynonymForm
              className="mx-auto justify-center"
              setShowSynForm={setShowSynForm}
              setSubmissionMessage={setSubmissionMessage}
              setDeleteMessage={setDeleteMessage}
            />
          ) : (
            <div className="w-1/4 my-auto">
              <img
                src={SYNCOL}
                alt="AtlasUI"
                className="my-auto border-4 border-light-blue-500 border-opacity-25 shadow-2xl h-128"
              ></img>
            </div>
          )}
        </div>
        <div className="mx-24 my-4">
          {" "}
          <hr
            style={{
              color: "darkgreen",
              backgroundColor: "darkgreen",
              height: 1,
              borderColor: "darkgreen",
            }}
          />
        </div>

        <div className="flex mx-16 text-2xl justify-around">
          <div className="w-1/4 ml-10 rounded text-base p-4">
            <div className="text-2xl font-body text-center font-bold text-indigo-800 ">
              {t('Equivalent')}
            </div>

            <div className="w-auto rounded text-base my-auto p-4">
              <SyntaxHighlighter language="javascript" style={okaidia}>
                {equivalentString}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="w-1/4  rounded text-base p-4">
            <div className="text-2xl font-body text-center font-bold text-indigo-800 ">
              {t('Explicit')}
            </div>

            <div className="w-auto rounded text-base my-auto p-4">
              <SyntaxHighlighter language="javascript" style={okaidia}>
                {explicitString}
              </SyntaxHighlighter>
            </div>
          </div>

          <div className="w-64 my-auto">
            <img src={DocHero} alt="thinking" className="my-auto"></img>
          </div>

          <div className="w-1/4  rounded text-base px-4">
            <div className="text-2xl font-body text-center font-bold text-indigo-800 ">
              {t('AddToSearchIndex')}
            </div>
            <div className="w-auto rounded text-base my-auto px-4">
              <SyntaxHighlighter language="javascript" style={okaidia}>
                {synIndexString}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 p-2 mt-10 px-20 md:grid-cols-3 md:gap-6">
          {loadedSynonyms.map((syndoc, index) => (
            <SynonymCard
              key={syndoc._id}
              syndoc={syndoc}
              setDeleteMessage={setDeleteMessage}
              setUpdateMessage={setUpdateMessage}
              setShowSynForm
              setSubmissionMessage={setSubmissionMessage}
              updateMessage={updateMessage}
              index={index}
            />
          ))}
        </div>
        {deleteMessage !== "" && (
          <div
            className="flex justify-center px-2 w-4/5 mt-4 py-4 text-2xl mx-auto bg-san-juan-400 text-white rounded"
            onClick={() => setDeleteMessage("")}
          >
            {deleteMessage}
          </div>
        )}
      </div>
    </>
  );
};

export default SynonymsPage;
/**<div className="flex justify-center items-center mt-10"> */
