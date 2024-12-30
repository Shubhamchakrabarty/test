SELECT
    jobs.id,
    jobs.user_id,
    jobs.start_date,
    jobs.end_date,
    jobs.is_current,
    jobs.experience_summary,
    companies.name AS company_name,
    designations.name AS designation_name
FROM
    "Jobs" jobs
LEFT JOIN
    "Companies" companies ON jobs.company_id = companies.id
LEFT JOIN
    "Designations" designations ON jobs.designation_id = designations.id
WHERE
    jobs.user_id = 1;