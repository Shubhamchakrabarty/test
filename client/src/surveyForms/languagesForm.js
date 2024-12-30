export const languagesFormJson = {
    name: "languages",
    elements: [
      {
        type: "html",
        name: "customGreeting",
        html: `<div class='greeting-container'>
                 <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
                 <div class='greeting-bubble'>Tell us about the languages you speak.</div>
               </div>`
      },
      {
        type: "matrixdynamic",
        name: "languages",
        title: "Add the languages you speak",
        columns: [
          {
            name: "language",
            title: "Language",
            cellType: "dropdown",
            choicesByUrl: {
              url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/languages`,
              valueName: "id",
              titleName: "name"
            },
            isRequired: true
          },
          {
            name: "language_proficiency_user",
            title: "Your Rating",
            cellType: "rating",
            rateMin: 1,
            rateMax: 5,
            minRateDescription: "Poor",
            maxRateDescription: "Excellent",
            isRequired: true

          }
        ],
        rowCount: 1,
        minRowCount: 1,
        maxRowCount: 5,
        addRowText: "Add Language"
      }
    ],
    completedHtml: `
      <div class="greeting-container">
        <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
        <div class="greeting-bubble">
          <p>Thank you for sharing the languages you speak!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
  };