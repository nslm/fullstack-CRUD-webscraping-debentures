-- SELECT
SELECT 
    data_do_negocio, 
    codigo_do_ativo, 
    quantidade, 
    preco_unitario, 
    volume_financeiro, 
    taxa
FROM
    debentures.balcao 
WHERE 
    codigo_do_ativo = ANY(%s)
    AND data_do_negocio >= %s
    AND data_do_negocio <= %s;

-- SELECT2
SELECT DISTINCT
    array_agg(DISTINCT codigo_do_ativo) AS codigos
FROM
    debentures.balcao;
