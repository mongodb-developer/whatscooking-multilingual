import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div>
      <label htmlFor="language-select">Language:</label>
      <select id="language-select" onChange={changeLanguage} defaultValue={i18n.language}>
        <option value="en">English</option>
        <option value="jp">Japanese</option>
        <option value="th">Thai</option>
        <option value="id">Indonesian</option>
      </select>
    </div>
  );

}

export default LanguageSelector;
