-- INSERT
INSERT INTO debentures.caracteristicas (codigo, situacao, emissor, vencimento, indice, taxa)
VALUES (%s, %s, %s, %s, %s, %s)
ON CONFLICT (codigo) DO UPDATE SET
  situacao = EXCLUDED.situacao,
  emissor = EXCLUDED.emissor,
  vencimento = EXCLUDED.vencimento,
  indice = EXCLUDED.indice,
  taxa = EXCLUDED.taxa
RETURNING *;

-- SELECT
SELECT codigo, emissor, vencimento, indice, taxa FROM debentures.caracteristicas WHERE situacao='Registrado';

-- UPDATE
UPDATE debentures.caracteristicas
SET emissor = %s, vencimento = %s, indice = %s, taxa = %s
WHERE codigo = %s;

-- DELETE
DELETE FROM debentures.caracteristicas
WHERE codigo = %s;
