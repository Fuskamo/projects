#Q1A: Drop down menu for pet type:
SELECT type_id, type_animal FROM type;

#Q2B: Lists all pets by animal type
SELECT pet_name, pet_breed, pet_color, pet_gender 
FROM pet 
JOIN type USING(type_id) 
WHERE type_id = ?;

#Q2A: Counts the number of treatments each pet has received
SELECT temp.Pet, count(temp.Treatment) AS Records
FROM (SELECT p.pet_name AS Pet, t.treatment_desc AS Treatment, ht.treatment_date AS Date
FROM home_treatment AS ht
JOIN treatment AS t ON ht.treatment_id = t.treatment_id
JOIN pet AS p ON ht.pet_id = p.pet_id
UNION ALL
SELECT p.pet_name, t.treatment_desc AS Treatment, vv.visit_date AS Date
FROM vet_treatment AS vt
JOIN treatment AS t ON vt.treatment_id = t.treatment_id
JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
JOIN pet AS p ON vv.pet_id = p.pet_id) as temp
GROUP BY temp.Pet
ORDER BY Records DESC;

#Q2B: Lists all vet or home treatments received for a specific pet
SELECT p.pet_name AS Pet, t.treatment_desc AS Treatment, t.treatment_type, ht.treatment_date AS Date
FROM home_treatment AS ht
JOIN treatment AS t ON ht.treatment_id = t.treatment_id
JOIN pet AS p ON ht.pet_id = p.pet_id
WHERE p.pet_name = ?
UNION
SELECT p.pet_name, t.treatment_desc AS Treatment, t.treatment_type, vv.visit_date AS Date
FROM vet_treatment AS vt
JOIN treatment AS t ON vt.treatment_id = t.treatment_id
JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
JOIN pet AS p ON vv.pet_id = p.pet_id
WHERE p.pet_name = ?
ORDER BY Date DESC;

#Q3A: List of required treatments that ARE implemented
SELECT t.treatment_desc, j.treatment_type, i.Date
FROM (SELECT p.pet_id, t.treatment_id, t.treatment_type
	FROM req_treatment AS r 
	JOIN treatment AS t ON r.treatment_id = t.treatment_id
	JOIN type ON r.type_id = type.type_id
	JOIN pet AS p ON type.type_id = p.type_id
    UNION
    SELECT p.pet_id, t.treatment_id, t.treatment_type
    FROM atypical_treatment AS a
    JOIN pet AS p ON a.pet_id = p.pet_id
    JOIN treatment AS t ON a.treatment_id = t.treatment_id) AS j
JOIN (SELECT p.pet_id, t.treatment_id, t.treatment_type, ht.treatment_date AS Date
	FROM home_treatment AS ht
	JOIN treatment AS t ON ht.treatment_id = t.treatment_id
	JOIN pet AS p ON ht.pet_id = p.pet_id
	UNION
	SELECT p.pet_id, t.treatment_id, t.treatment_type, vv.visit_date AS Date
	FROM vet_treatment AS vt
	JOIN treatment AS t ON vt.treatment_id = t.treatment_id
	JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
	JOIN pet AS p ON vv.pet_id = p.pet_id) AS i
ON i.treatment_id = j.treatment_id
AND i.pet_id = j.pet_id
JOIN treatment AS t ON j.treatment_id = t.treatment_id
JOIN pet AS p ON j.pet_id = p.pet_id
WHERE p.pet_name = ?;

#Q3B: List of required treatments that are NOT implemented
SELECT t.treatment_desc, j.treatment_type
FROM (SELECT p.pet_id, t.treatment_id, t.treatment_type
	FROM req_treatment AS r 
	JOIN treatment AS t ON r.treatment_id = t.treatment_id
	JOIN type ON r.type_id = type.type_id
	JOIN pet AS p ON type.type_id = p.type_id
    UNION
    SELECT p.pet_id, t.treatment_id, t.treatment_type
    FROM atypical_treatment AS a
    JOIN pet AS p ON a.pet_id = p.pet_id
    JOIN treatment AS t ON a.treatment_id = t.treatment_id) AS j
LEFT JOIN (SELECT p.pet_id, t.treatment_id, t.treatment_type, ht.treatment_date AS Date
	FROM home_treatment AS ht
	JOIN treatment AS t ON ht.treatment_id = t.treatment_id
	JOIN pet AS p ON ht.pet_id = p.pet_id
	UNION
	SELECT p.pet_id, t.treatment_id, t.treatment_type, vv.visit_date AS Date
	FROM vet_treatment AS vt
	JOIN treatment AS t ON vt.treatment_id = t.treatment_id
	JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
	JOIN pet AS p ON vv.pet_id = p.pet_id) AS i
ON i.treatment_id = j.treatment_id
AND i.pet_id = j.pet_id
JOIN treatment AS t ON j.treatment_id = t.treatment_id
JOIN pet AS p ON j.pet_id = p.pet_id
WHERE i.Date IS NULL
AND p.pet_name = ?;

#Q4A: List of required treatments that are NOT implemented (similiar to Q3B)
SELECT t.treatment_desc, j.treatment_type
FROM (SELECT p.pet_id, t.treatment_id, t.treatment_type
	FROM req_treatment AS r 
	JOIN treatment AS t ON r.treatment_id = t.treatment_id
	JOIN type ON r.type_id = type.type_id
	JOIN pet AS p ON type.type_id = p.type_id
    UNION
    SELECT p.pet_id, t.treatment_id, t.treatment_type
    FROM atypical_treatment AS a
    JOIN pet AS p ON a.pet_id = p.pet_id
    JOIN treatment AS t ON a.treatment_id = t.treatment_id) AS j
LEFT JOIN (SELECT p.pet_id, t.treatment_id, t.treatment_type, ht.treatment_date AS Date
	FROM home_treatment AS ht
	JOIN treatment AS t ON ht.treatment_id = t.treatment_id
	JOIN pet AS p ON ht.pet_id = p.pet_id
	UNION
	SELECT p.pet_id, t.treatment_id, t.treatment_type, vv.visit_date AS Date
	FROM vet_treatment AS vt
	JOIN treatment AS t ON vt.treatment_id = t.treatment_id
	JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
	JOIN pet AS p ON vv.pet_id = p.pet_id) AS i
ON i.treatment_id = j.treatment_id
AND i.pet_id = j.pet_id
JOIN treatment AS t ON j.treatment_id = t.treatment_id
JOIN pet AS p ON j.pet_id = p.pet_id
WHERE i.Date IS NULL
AND p.pet_name = ?;

#Q4B: Vaccine and flea medication due dates (where a treatment has been applied)
SELECT t.treatment_desc AS Treatment, (CASE WHEN t.treatment_type LIKE '%flea%' THEN 'flea' WHEN t.treatment_type = 'vaccine' THEN 'vaccine' ELSE 'misc' END) AS Type, treat_done.Due
FROM (SELECT p.pet_id, t.treatment_id, MAX(DATE_ADD(ht.treatment_date, INTERVAL t.treatment_freq DAY)) AS Due
	FROM home_treatment AS ht
	JOIN pet AS p ON ht.pet_id = p.pet_id
	JOIN treatment AS t ON ht.treatment_id = t.treatment_id
	GROUP BY treatment_id, pet_id
    UNION 
    SELECT p.pet_id, t.treatment_id, MAX(DATE_ADD(vv.visit_date, INTERVAL t.treatment_freq DAY)) AS Due
    FROM vet_treatment AS vt
    JOIN vet_visit AS vv ON vt.visit_id = vv.visit_id
    JOIN pet AS p ON vv.pet_id = p.pet_id
    JOIN treatment AS t ON vt.treatment_id = t.treatment_id
    GROUP BY treatment_id, pet_id) AS treat_done
JOIN pet AS p ON p.pet_id = treat_done.pet_id
JOIN treatment AS t USING(treatment_id)
WHERE pet_name = ?
GROUP BY Type, Treatment, Due
HAVING Type = 'flea' OR Type = 'vaccine'
ORDER BY Due ASC;

#Q5A: Weight counts per pet
SELECT p.pet_name, t.type_animal, COUNT(w.weight_amt) AS counts
FROM weight AS w
JOIN pet AS p ON w.pet_id = p.pet_id
JOIN type AS t ON p.type_id = t.type_id
GROUP BY pet_name, type_animal
ORDER BY counts DESC;

#Q5B: Weight history per pet 
SELECT SELECT p.pet_name, w.weight_date, CONCAT(FORMAT(w.weight_amt, 2), ' ', 
	(CASE WHEN t.type_id = 1 THEN 'pounds' WHEN t.type_id = 2 THEN 'pounds' WHEN t.type_id = 5 THEN 'pounds' ELSE 'grams' END)) AS amt
FROM weight AS w
JOIN pet AS p USING(pet_id)
JOIN type AS t USING(type_id)
WHERE pet_name = ?
ORDER BY weight_date DESC;

#Q6A: A list of microchip numbers
SELECT m.micro_number 
FROM microchip AS m;

#Q6B Lookup owner information by microchip number
SELECT p.pet_name, CONCAT(o.owner_fname, ' ', o.owner_lname) AS Owner, CONCAT(SUBSTR(o.owner_phone,1,3), '-', SUBSTR(o.owner_phone,4,3), '-XXXX') AS Telephone, m.micro_manu, m.micro_number
FROM microchip AS m
JOIN pet AS p ON m.micro_id = p.micro_id
LEFT JOIN owner AS o ON p.owner_id = o.owner_id
WHERE m.micro_number = ?;

#Q7A: Returns the total number of pet adoptions
SELECT COUNT(adoption.pet_id) AS count FROM adoption;

#Q7B: Returns a list of pet adoptions
SELECT o.owner_fname AS Adopter, p.pet_name, p.pet_breed, p.pet_gender, a.adoption_date
FROM adoption AS a
JOIN pet AS p ON a.pet_id = p.pet_id
JOIN owner AS o ON p.owner_id = o.owner_id;

#Q8A: Returns a count of pets owned by an owner
SELECT t.type_animal, COUNT(p.pet_id) AS counts
FROM type AS t
JOIN pet AS p ON t.type_id = p.type_id
JOIN owner AS o ON o.owner_id = p.owner_id
WHERE o.owner_fname LIKE ?
OR o.owner_lname LIKE ?
GROUP BY type_animal
ORDER BY counts DESC;

#Q8B: Returns a list of owners and their respective pets
SELECT p.pet_name, t.type_animal, p.pet_breed, p.pet_gender
FROM pet AS p
JOIN owner AS o ON p.owner_id = o.owner_id
JOIN type AS t ON p.type_id = t.type_id
WHERE o.owner_fname LIKE ?
OR o.owner_lname LIKE ?
ORDER BY pet_name;
