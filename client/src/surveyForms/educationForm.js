// surveyForms/educationForm.js
export const educationFormJson = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "html",
            name: "customGreeting",
            html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please edit your education details </div></div>"
          },
          {
            type: "dropdown",
            name: "university1",
            title: "Select your university",
            isRequired: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 20,
          },
          {
            type: "dropdown",
            name: "degree1",
            title: "Select your degree",
            isRequired: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 20,
          },
          {
            type: "text",
            name: "major1",
            title: "Major",
            description: "Please enter your major.",
            isRequired: false,
          },
          {
            type: "text",
            name: "cgpa1",
            title: "CGPA",
            description: "Please enter your CGPA as a percentage (0-100).",
            inputType: "number",
            isRequired: true,
            validators: [
                {
                  type: "numeric",
                  minValue: 0,
                  maxValue: 100,
                  text: "CGPA must be between 0 and 100."
                }
              ]
          },
          {
            type: "text",
            name: "startDate1",
            title: "Start Date",
            inputType: "date",
            isRequired: true
          },
          {
            type: "text",
            name: "endDate1",
            title: "End Date",
            inputType: "date",
            isRequired: true
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
            "type": "html",
            "name": "customGreeting",
            "html": "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please share additional information about your education background </div></div>"
            },
          {
            type: "dropdown",
            name: `university${i + 2}`,
            title: "Select your university",
            isRequired: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 20,
          },
          {
            type: "dropdown",
            name: `degree${i + 2}`,
            title: "Select your degree",
            isRequired: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 20,
          },
          {
            type: "text",
            name: `major${i + 2}`,
            title: "Major",
            description: "Please enter your major.",
            isRequired: true
          },
          {
            type: "text",
            name: `cgpa${i + 2}`,
            title: "CGPA",
            description: "Please enter your CGPA as a percentage (0-100).",
            inputType: "number",
            isRequired: true,
            validators: [
                {
                  type: "numeric",
                  minValue: 0,
                  maxValue: 100,
                  text: "CGPA must be between 0 and 100."
                }
              ]
          },
          {
            type: "text",
            name: `startDate${i + 2}`,
            title: "Start Date",
            inputType: "date",
            isRequired: true
          },
          {
            type: "text",
            name: `endDate${i + 2}`,
            title: "End Date",
            inputType: "date",
            isRequired: true
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
          <p>Thank you for submitting your education details!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
  };