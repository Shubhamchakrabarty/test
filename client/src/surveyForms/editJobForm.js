// surveyForms/editJobForm.js
export const editJobFormJson = {
    elements: [
      {
        type: "dropdown",
        name: "designation",
        title: "Select your designation",
        isRequired: true,
        choicesLazyLoadEnabled: true,
        choicesLazyLoadPageSize: 20,
      },
      {
        type: "dropdown",
        name: "company",
        title: "Select your company",
        isRequired: true,
        choicesLazyLoadEnabled: true,
        choicesLazyLoadPageSize: 20,
      },
      {
        type: "boolean",
        name: "isCurrent",
        title: "Is this your current job?",
        isRequired: true
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
        isRequired: true,
        visibleIf: "{isCurrent} = false"
      },
      {
        type: "comment",
        name: "experienceSummary",
        title: "Experience Summary",
        isRequired: false
      }
    ]
  };