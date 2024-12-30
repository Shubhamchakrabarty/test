// surveyForms/skillsForm.js
export const skillsFormJson = {
  pages: [
    {
      name: "skillsPage",
      elements: [
        {
          type: "html",
          name: "skillsGreeting",
          html: `<div class='greeting-container'>
                  <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
                  <div class='greeting-bubble'>Select up to 5 skills and rate them.</div>
                 </div>`
        },
        {
          name: "skills",
          type: "matrixdynamic",
          title: "Skills",
          addRowText: "Add Skill",
          columns: [
            {
              name: "skill",
              title: "Skill",
              cellType: "dropdown",
              choicesByUrl: {
                url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/skills?filter=&skip=0&take=1000`,
                valueName: "id",
                titleName: "name"
              }
            },
            {
              name: "rating",
              title: "Your Rating",
              cellType: "rating",
              rateMin: 1,
              rateMax: 5,
              minRateDescription: "Poor",
              maxRateDescription: "Excellent"
            }
          ],
          rowCount: 1,
          minRowCount: 1,
          maxRowCount: 5,
          allowAddRows: true,
          allowRemoveRows: true
        }
      ]
    }
  ],
  completedHtml: `
    <div class="greeting-container">
      <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
      <div class="greeting-bubble">
        <p>Thank you for submitting your skills!</p>
        <p>We are processing your responses and will take you to the next stage shortly.</p>
      </div>
    </div>`,
  showQuestionNumbers: "off",
  pageNextText: "Forward",
  completeText: "Submit",
  showPrevButton: false,
  firstPageIsStarted: true,
  startSurveyText: "Start",
};