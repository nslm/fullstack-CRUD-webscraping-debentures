-- SELECT
SELECT
    data_do_negocio, codigo_do_ativo,
    AVG(volume_financeiro /10^2)AS volume_medio_diario,
    SUM(taxa /10^4 * volume_financeiro /10^2) / SUM(volume_financeiro /10^2) AS taxa_media_ponderada
FROM 
    debentures.balcao
WHERE 
    codigo_do_ativo = ANY(%s)
    AND data_do_negocio >= %s
    AND data_do_negocio <= %s
GROUP BY 
    data_do_negocio,
    codigo_do_ativo
ORDER BY 
    data_do_negocio,
    codigo_do_ativo;