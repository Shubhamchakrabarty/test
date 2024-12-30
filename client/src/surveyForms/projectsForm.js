export const projectsFormJson = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "html",
            name: "customGreeting",
            html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please provide details of your projects.</div></div>",
          },
          {
            type: "dropdown",
            name: "project_level_id1",
            title: "Select your project level",
            isRequired: true,
            choicesByUrl: {
              url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/projects/levels`,
              valueName: "id",
              titleName: "name"
            },
          },
          {
            type: "text",
            name: "project_name1",
            title: "Project Name",
            isRequired: true,
          },
          {
            type: "text",
            name: "start_date1",
            title: "Start Date",
            inputType: "date",
            isRequired: true,
          },
          {
            type: "text",
            name: "end_date1",
            title: "End Date",
            inputType: "date",
            isRequired: true,
          },
          {
            type: "comment",
            name: "project_summary1",
            title: "Project Summary",
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
            html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please provide details for one of your previous projects.</div></div>",
          },
          {
            type: "dropdown",
            name: `project_level_id${i + 2}`,
            title: "Select your project level",
            isRequired: true,
            choicesByUrl: {
              url: `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${process.env.NODE_ENV === 'development' ? 'localhost:5000' : 'pehchaan.me'}/api/projects/levels`,
              valueName: "id",
              titleName: "name"
            },
          },
          {
            type: "text",
            name: `project_name${i + 2}`,
            title: "Project Name",
            isRequired: true,
          },
          {
            type: "text",
            name: `start_date${i + 2}`,
            title: "Start Date",
            inputType: "date",
            isRequired: true,
          },
          {
            type: "text",
            name: `end_date${i + 2}`,
            title: "End Date",
            inputType: "date",
            isRequired: true,
          },
          {
            type: "comment",
            name: `project_summary${i + 2}`,
            title: "Project Summary",
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
          <p>Thank you for submitting your project details!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
  };