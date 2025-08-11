-- criando schemas
CREATE SCHEMA IF NOT EXISTS debentures;
CREATE SCHEMA IF NOT EXISTS automacoes;



-- Tabela caracteristicas
CREATE TABLE IF NOT EXISTS debentures.caracteristicas (
    codigo VARCHAR PRIMARY KEY,
    emissor VARCHAR NOT NULL,
    vencimento DATE NOT NULL,
    indice VARCHAR NOT NULL,
    taxa INTEGER
);


-- Tabela balcao
CREATE TABLE IF NOT EXISTS debentures.balcao (
    codigo_identificacao VARCHAR PRIMARY KEY,
    data_do_negocio DATE NOT NULL,
    codigo_do_ativo VARCHAR NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario INTEGER  NOT NULL,
    volume_financeiro INTEGER  NOT NULL,
    taxa INTEGER,
    CONSTRAINT fk_caracteristica FOREIGN KEY (codigo_do_ativo)
        REFERENCES debentures.caracteristicas(codigo)
        ON DELETE CASCADE
        DEFERRABLE INITIALLY DEFERRED
);