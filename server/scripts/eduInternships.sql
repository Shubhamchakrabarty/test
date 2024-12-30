SELECT
    e.id AS education_id,
    e.user_id,
    e.degree_id,
    e.major,
    e.university_id,
    e.start_date AS education_start_date,
    e.end_date AS education_end_date,
    e.cgpa,
    i.id AS internship_id,
    i.company_id,
    c.name AS company_name,
    i.designation_id,
    d.name AS designation_name,
    i.start_date AS internship_start_date,
    i.end_date AS internship_end_date,
    i.is_current,
    i.experience_summary
FROM
    "Educations" e
LEFT JOIN
    "Internships" i ON e.user_id = i.user_id
LEFT JOIN
    "Companies" c ON i.company_id = c.id
LEFT JOIN
    "InternshipDesignations" d ON i.designation_id = d.id
WHERE
    e.user_id = 1
ORDER BY
    e.start_date DESC,
    i.start_date DESC;