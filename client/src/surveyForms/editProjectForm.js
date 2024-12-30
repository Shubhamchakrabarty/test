export const editProjectFormJson = {
    elements: [
      {
        type: "dropdown",
        name: "project_level_id",
        title: "Select your project level",
        isRequired: true,
        choicesLazyLoadEnabled: true,
        choicesLazyLoadPageSize: 20,
      },
      {
        type: "text",
        name: "project_name",
        title: "Project Name",
        isRequired: true,
      },
      {
        type: "text",
        name: "start_date",
        title: "Start Date",
        inputType: "date",
        isRequired: true,
      },
      {
        type: "text",
        name: "end_date",
        title: "End Date",
        inputType: "date",
        isRequired: true,
      },
      {
        type: "comment",
        name: "project_summary",
        title: "Project Summary",
        isRequired: true,
      }
    ]
  };