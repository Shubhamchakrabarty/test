export const hobbiesFormJson = {
    name: "hobbies",
    elements: [
      {
        type: "html",
        name: "customGreeting",
        html: `<div class='greeting-container'>
                 <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
                 <div class='greeting-bubble'>Tell us about your hobbies.</div>
               </div>`
      },
      {
        type: "matrixdynamic",
        name: "hobbies",
        title: "Add your hobbies",
        columns: [
          {
            name: "category",
            title: "Hobby Category",
            cellType: "dropdown",
            choicesByUrl: {
              url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/hobbies/categories`,
              valueName: "id",
              titleName: "name"
            },
            isRequired: true
          },
          {
            name: "hobby",
            title: "Hobby",
            cellType: "dropdown",
            choicesByUrl: {
              url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/hobbies/activities?categoryId={row.category}`,
              valueName: "id",
              titleName: "name"
            },
            visibleIf: "{row.category} notempty",
            isRequired: true
          },
          {
            name: "achievement",
            title: "Achievement",
            cellType: "comment",
            visibleIf: "{row.category} notempty",
            isRequired: true
          }
        ],
        rowCount: 1,
        minRowCount: 1,
        maxRowCount: 5,
        addRowText: "Add Hobby"
      }
    ],
    completedHtml: `
      <div class="greeting-container">
        <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
        <div class="greeting-bubble">
          <p>Thank you for sharing your hobbies!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
  };