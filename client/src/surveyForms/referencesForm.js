export const referencesFormJson = {
    name: "references",
    elements: [
        {
            type: "html",
            name: "customGreeting",
            html: `<div class='greeting-container'>
                     <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
                     <div class='greeting-bubble'>Please provide details for your references and upload the reference letters.</div>
                   </div>`
        },
        {
            type: "paneldynamic",
            name: "referencesPanel",
            title: "Add your references",
            panelAddText: "Add Reference",
            panelCount: 1,
            minPanelCount: 1,
            maxPanelCount: 5,
            templateElements: [
                {
                    type: "text",
                    name: "reference_from",
                    title: "Reference From",
                    isRequired: true
                },
                {
                    type: "text",
                    name: "reference_contact",
                    title: "Reference Contact",
                    isRequired: true
                },
                {
                    type: "file",
                    name: "file",
                    title: "Upload Reference Letter",
                    maxSize: 1024000, // Example max size in bytes
                    storeDataAsText: false,
                    allowMultiple: false,
                    waitForUpload: true,
                    showPreview: true,
                    isRequired: true
                }
            ]
        }
    ],
    completedHtml: `
      <div class="greeting-container">
        <img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/>
        <div class="greeting-bubble">
          <p>Thank you for providing your references!</p>
          <p>We are processing your responses and will take you to the next stage shortly.</p>
        </div>
      </div>`
};