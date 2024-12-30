SELECT
    user_projects.id,
    user_projects.user_id,
    user_projects.project_name,
    user_projects.start_date,
    user_projects.end_date,
    user_projects.project_summary,
    project_levels.name AS project_level_name
FROM
    "UserProjects" user_projects
LEFT JOIN
    "ProjectLevels" project_levels ON user_projects.project_level_id = project_levels.id
WHERE
    user_projects.user_id = 1;