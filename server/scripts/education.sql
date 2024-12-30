SELECT
    e.id AS education_id,
    e.user_id,
    e.degree_id,
    deg.course AS degree_name,
    e.major,
    e.university_id,
    u.name AS university_name,
    e.start_date AS education_start_date,
    e.end_date AS education_end_date,
    e.cgpa
FROM
    "Educations" e
LEFT JOIN
    "Degrees" deg ON e.degree_id = deg.id
LEFT JOIN
    "Universities" u ON e.university_id = u.id
WHERE
    e.user_id = 1
ORDER BY
    e.start_date DESC;