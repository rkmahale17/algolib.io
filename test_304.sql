.headers on
.mode list
.separator |_|_|
.nullvalue ___NULL___
CREATE TABLE Scores (
  id INT PRIMARY KEY,
  score DECIMAL(3, 2)
);
INSERT INTO Scores (id, score) VALUES (1, 3.5), (2, 4), (3, 3.5), (4, 2), (5, 4);
SELECT
    score,
    DENSE_RANK() OVER (ORDER BY score DESC) AS "rank"
FROM
    Scores
ORDER BY
    score DESC;