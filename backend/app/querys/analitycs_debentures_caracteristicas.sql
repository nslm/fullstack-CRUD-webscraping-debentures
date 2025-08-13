-- SELECT
SELECT 
    codigo, 
    emissor, 
    vencimento, 
    indice, 
    taxa 
FROM
    debentures.caracteristicas 
WHERE 
    codigo = ANY(%s);
