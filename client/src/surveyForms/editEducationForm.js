export const editEducationFormJson = {
    pages: [
      {
        name: "editPage",
        elements: [
          {
            type: "dropdown",
            name: "university",
            title: "Select your university",
            isRequired: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 20,
          },
          {
            type: "dropdown",
            name: "degree",
            title: "Select your degree",
            isRequired: true,
            choicesLazyLoadEnabled: true,
            choicesLazyLoadPageSize: 20,
          },
          {
            type: "text",
            name: "major",
            title: "Major",
            description: "Please enter your major.",
            isRequired: false,
          },
          {
            type: "text",
            name: "cgpa",
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
            name: "startDate",
            title: "Start Date",
            inputType: "date",
            isRequired: true
          },
          {
            type: "text",
            name: "endDate",
            title: "End Date",
            inputType: "date",
            isRequired: true
          }
        ]
      }
    ],
  };