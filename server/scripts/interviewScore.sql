SELECT "functionalSkills", "functionalSkillsScore"
FROM "HrInterviewScores"
WHERE "userId" = (SELECT "id" FROM "Users" WHERE "email" = 'ankitmiddha9828@gmail.com');