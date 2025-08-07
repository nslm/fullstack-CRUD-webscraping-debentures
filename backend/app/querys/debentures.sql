-- INSERT
INSERT INTO debentures.caracteristicas (codigo, emissor, vencimento, indice, taxa)
VALUES (%s, %s, %s, %s, %s)
RETURNING *;

-- SELECT
SELECT * FROM debentures.caracteristicas;

-- UPDATE
UPDATE debentures.caracteristicas
SET emissor = %s, vencimento = %s, indice = %s, taxa = %s
WHERE codigo = %s;

-- DELETE
DELETE FROM debentures.caracteristicas
WHERE codigo = %s;
