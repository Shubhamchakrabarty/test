SELECT
    internships.id,
    internships.user_id,
    internships.start_date,
    internships.end_date,
    internships.is_current,
    internships.experience_summary,
    companies.name AS company_name,
    internship_designations.name AS designation_name
FROM
    "Internships" internships
LEFT JOIN
    "Companies" companies ON internships.company_id = companies.id
LEFT JOIN
    "InternshipDesignations" internship_designations ON internships.designation_id = internship_designations.id
WHERE
    internships.user_id = 1;