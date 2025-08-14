-- SELECT
SELECT 
    codigo, 
    situacao, 
    emissor, 
    vencimento, 
    indice, 
    taxa
FROM
    debentures.caracteristicas 
WHERE 
    codigo = ANY(%s);
