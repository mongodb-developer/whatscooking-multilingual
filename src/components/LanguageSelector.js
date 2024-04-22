import React, { useContext } from 'react';
import { SearchParametersContext } from '../store/SearchParametersContext';

function LanguageSelector() {

  const { language, setLanguage, } = useContext(SearchParametersContext);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <label htmlFor="language-select">Language:</label>
      <select id="language-select" onChange={handleLanguageChange} defaultValue={language}>
        <option value="en">English</option>
        <option value="jp">Japanese</option>
        <option value="th">Thai</option>
        <option value="id">Indonesian</option>
      </select>
    </div>
  );

}

export default LanguageSelector;
