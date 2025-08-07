-- Renomeando schema
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_namespace WHERE nspname = 'public'
  ) THEN
    EXECUTE 'ALTER SCHEMA public RENAME TO debentures';
  END IF;
END
$$;



-- Tabela caracteristicas
CREATE TABLE IF NOT EXISTS debentures.caracteristicas (
    codigo VARCHAR PRIMARY KEY,
    emissor VARCHAR NOT NULL,
    vencimento DATE NOT NULL,
    indice VARCHAR NOT NULL,
    taxa INTEGER NOT NULL
);


-- Tabela balcao
CREATE TABLE IF NOT EXISTS debentures.balcao (
    data_do_negocio DATE NOT NULL,
    codigo_do_ativo VARCHAR NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario INTEGER  NOT NULL,
    volume_financeiro INTEGER  NOT NULL,
    taxa INTEGER  NOT NULL,
    codigo_caracteristica VARCHAR NOT NULL,
    CONSTRAINT pk_balcao PRIMARY KEY (data_do_negocio, codigo_do_ativo),
    CONSTRAINT fk_caracteristica FOREIGN KEY (codigo_caracteristica)
        REFERENCES debentures.caracteristicas(codigo)
        ON DELETE CASCADE
);