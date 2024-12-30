// surveyForms/customSectionsForm.js
export const customSectionsFormJson = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "html",
            name: "customGreeting",
            html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please provide details for your custom section.</div></div>",
          },
          {
            type: "text",
            name: "section_title1",
            title: "Section Title",
            isRequired: true,
          },
          {
            type: "comment",
            name: "details1",
            title: "Details",
            isRequired: true,
          },
          {
            type: "html",
            name: "addMoreButton1",
            html: "<button type='button' class='btn btn-primary' id='addMoreButton1'>Add more</button>"
          },
          {
            type: "text",
            name: "triggerNextPage",
            visible: false
          }
        ]
      },
      ...Array.from({ length: 9 }, (_, i) => ({
        name: `page${i + 2}`,
        elements: [
          {
            type: "html",
            name: "customGreeting",
            html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please provide details for another custom section.</div></div>",
          },
          {
            type: "text",
            name: `section_title${i + 2}`,
            title: "Section Title",
            isRequired: true,
          },
          {
            type: "comment",
            name: `details${i + 2}`,
            title: "Details",
            isRequired: true,
          },
          {
            type: "html",
            name: `addMoreButton${i + 2}`,
            html: `<button type='button' class='btn btn-primary' id='addMoreButton${i + 2}'>Add more</button>`
          },
          {
            type: "text",
            name: `triggerNextPage${i + 2}`,
            visible: false
          }
        ],
        visibleIf: `{triggerNextPage} >= ${i + 1}`
      }))
    ],
    completedHtml: `
      <div class="greeting-container">
        <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
        <div class="greeting-bubble">
          <p>Thank you for submitting your custom section details!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
  };