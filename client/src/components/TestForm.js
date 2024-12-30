import React from 'react';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { testFormJson } from '../surveyForms/testForm';
import 'survey-core/defaultV2.min.css';
//import './TestForm.css'; // Create this CSS file if you need custom styles

const TestForm = () => {
  const survey = new Model(testFormJson);
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
});

  survey.onChoicesLazyLoad.add((_, options) => {
    if (options.question.getType() === "dropdown" && options.question.name === "university") {
      const url = `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/universities?skip=${options.skip}&take=${options.take}&filter=${options.filter || ''}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          options.setItems(data.map(university => ({ value: university.id, text: university.name })), data.length);
        })
        .catch(error => {
          console.error('Error fetching universities:', error);
        });
    }
  });

  survey.onGetChoiceDisplayValue.add((_, options) => {
    if (options.question.getType() === "dropdown" && options.question.name === "university") {
      const valuesStr = options.values.map(value => "values=" + value).join("&");
      const url = `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/getUniversityNames?${valuesStr}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          options.setItems(data.map(university => university.name));
        })
        .catch(error => {
          console.error('Error fetching university names:', error);
        });
    }
  });

  return <Survey model={survey} />;
};

export default TestForm;