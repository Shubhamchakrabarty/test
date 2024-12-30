export const surveyJson = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "html",
            "name": "customGreeting",
            "html": "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Hey! We would love to get to know you. </div></div>"
          },
          {
            "type": "text",
            "name": "firstName",
            "title": "First Name",
            "isRequired": true
          },
          {
            "type": "text",
            "name": "lastName",
            "title": "Last Name",
            "isRequired": true
          }
        ]
      },
      {
        "name": "page2",
        "elements": [
          {
            "type": "html",
            "name": "customGreeting",
            "html": "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>Hi {firstName}!<br>I'd love to keep you updated with latest tips and opportunities.<br>Could you please share your contact details?</div></div>"
          },
          {
            "type": "text",
            "name": "phoneNumber",
            "title": "Phone Number",
            "inputType": "tel",
            "isRequired": true
          },
          {
            "type": "text",
            "name": "email",
            "title": "Email",
            "inputType": "email",
            "isRequired": true
          },
          {
            "type": "text",
            "name": "address",
            "title": "Address"
          },
          {
            "type": "text",
            "name": "state",
            "title": "State",
            "isRequired": true
          },
          {
            "type": "text",
            "name": "city",
            "title": "City",
            "isRequired": true
          }
        ]
      },
      {
        "name": "page3",
        "elements": [
          {
            "type": "html",
            "name": "customGreeting",
            "html": "<div class='greeting-container'><img src='./assets/avatar_image.png' alt='Person' class='greeting-image'/><div class='greeting-bubble'>So you live in {city}!<br>That's great! We can catch up sometime.<br>But first, can you tell me about your work experience?</div></div>"
          },
          {
            "type": "imagepicker",
            "name": "experienceLevel",
            "title": "Experience Level",
            "isRequired": true,
            "choices": [
              {
                "value": "Student",
                "imageLink": "./assets/student_icon.png",
                "text": "Student"
              },
              {
                "value": "Graduate",
                "imageLink": "./assets/graduate_icon.png",
                "text": "Graduate"
              },
              {
                "value": "Post Graduate",
                "imageLink": "./assets/post_graduate_icon.png",
                "text": "Post graduate"
              },
              {
                "value": "Intern",
                "imageLink": "./assets/intern_icon.png",
                "text": "Intern"
              },
              {
                "value": "Entry Level Job",
                "imageLink": "./assets/entry_level_job_icon.png",
                "text": "Entry Level Job"
              },
              {
                "value": "Senior Level Job",
                "imageLink": "./assets/senior_level_job_icon.png",
                "text": "Senior Level Job"
              }
            ],
            "multiSelect": false,
            "showLabel": true,
            "imageWidth": 150,
            "imageHeight": 150,
            "colCount": 2
          }
        ]
      }
    ]
  };