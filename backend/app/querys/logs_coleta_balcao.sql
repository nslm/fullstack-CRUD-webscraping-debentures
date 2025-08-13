-- INSERT
INSERT INTO 
    automacoes.logs_balcao (
        data_exec, 
        data_inicio, 
        data_fim, 
        status_final
        )
VALUES 
    (%s, %s, %s, %s)
RETURNING *;

-- SELECT
SELECT * FROM 
    automacoes.logs_balcao 
ORDER BY 
    data_exec DESC;
