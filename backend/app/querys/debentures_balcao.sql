-- INSERT
INSERT INTO 
  debentures.balcao (
    codigo_identificacao, 
    data_do_negocio, 
    codigo_do_ativo, 
    quantidade, 
    preco_unitario, 
    volume_financeiro, 
    taxa
    )
VALUES 
  (%s, %s, %s, %s, %s, %s, %s)
ON CONFLICT
 (codigo_identificacao) 
DO 
  UPDATE SET
    data_do_negocio = EXCLUDED.data_do_negocio,
    codigo_do_ativo = EXCLUDED.codigo_do_ativo,
    quantidade = EXCLUDED.quantidade,
    preco_unitario = EXCLUDED.preco_unitario,
    volume_financeiro = EXCLUDED.volume_financeiro,
    taxa = EXCLUDED.taxa
RETURNING *;

-- SELECT
SELECT * FROM debentures.balcao;

-- LDATES
SELECT DISTINCT 
  data_do_negocio
FROM 
  debentures.balcao
ORDER BY 
  data_do_negocio ASC;
