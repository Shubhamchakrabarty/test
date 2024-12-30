export const extraCurricularsFormJson = {
  name: "extraCurriculars",
  elements: [
    {
      type: "html",
      name: "customGreeting",
      html: `<div class='greeting-container'>
               <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
               <div class='greeting-bubble'>Tell us about your extracurricular activities.</div>
             </div>`
    },
    {
      type: "matrixdynamic",
      name: "activities",
      title: "Add your extracurricular activities",
      columns: [
        {
          name: "category",
          title: "Category",
          cellType: "dropdown",
          choicesByUrl: {
            url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/extracurriculars/categories`,
            valueName: "id",
            titleName: "name"
          },
          isRequired: true
        },
        {
          name: "extracurricular",
          title: "Activity",
          cellType: "dropdown",
          choicesByUrl: {
            url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/extracurriculars/activities?categoryId={row.category}`,
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
      addRowText: "Add Activity"
    }
  ],
  completedHtml: `
    <div class="greeting-container">
      <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
      <div class="greeting-bubble">
        <p>Thank you for sharing your extracurricular activities!</p>
        <p>We are processing your responses and will take you to the next stage shortly.</p>
      </div>
    </div>`
};