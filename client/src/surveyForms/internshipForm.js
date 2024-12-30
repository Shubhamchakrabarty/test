export const internshipFormJson = {
    pages: [
        {
            name: "page1",
            elements: [
                {
                    type: "html",
                    name: "customGreeting",
                    html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please provide details for your current or latest internship.</div></div>",
                },
                {
                    type: "dropdown",
                    name: "designation1",
                    title: "Select your designation",
                    isRequired: true,
                    choicesLazyLoadEnabled: true,
                    choicesLazyLoadPageSize: 20,
                },
                {
                    type: "dropdown",
                    name: "company1",
                    title: "Select your company",
                    isRequired: true,
                    choicesLazyLoadEnabled: true,
                    choicesLazyLoadPageSize: 20,
                },
                {
                    type: "boolean",
                    name: "isCurrent1",
                    title: "Is this your current internship?",
                    isRequired: true
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
                    isRequired: true,
                    visibleIf: "{isCurrent1} = false" // Only show end date if not current internship
                },
                {
                    type: "comment",
                    name: "experienceSummary1",
                    title: "Experience Summary",
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
                    type: "html",
                    name: "customGreeting",
                    html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please provide details for one of your previous internships.</div></div>",
                },
                {
                    type: "dropdown",
                    name: `designation${i + 2}`,
                    title: "Select your designation",
                    isRequired: true,
                    choicesLazyLoadEnabled: true,
                    choicesLazyLoadPageSize: 20,
                },
                {
                    type: "dropdown",
                    name: `company${i + 2}`,
                    title: "Select your company",
                    isRequired: true,
                    choicesLazyLoadEnabled: true,
                    choicesLazyLoadPageSize: 20,
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
                    isRequired: true,
                },
                {
                    type: "comment",
                    name: `experienceSummary${i + 2}`,
                    title: "Experience Summary",
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
          <p>Thank you for submitting your internship details!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
};