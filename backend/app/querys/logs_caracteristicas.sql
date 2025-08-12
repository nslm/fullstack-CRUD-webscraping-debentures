-- INSERT
INSERT INTO automacoes.logs_caracteristicas (data_exec, duracao, volume, status_final)
VALUES (%s, %s, %s, %s)
RETURNING *;

-- SELECT
SELECT * FROM automacoes.logs_caracteristicas ORDER BY data_exec DESC;
