export const testFormJson = {
  title: "University Selection",
  description: "Please select your university",
  elements: [
    {
      type: "html",
      name: "customGreeting",
      html: "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Please share your university details</div></div>"
    },
    {
        "type": "dropdown",
        "name": "university",
        "title": "Select a university",
        "isRequired": true,
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 40
      }
  ],
};