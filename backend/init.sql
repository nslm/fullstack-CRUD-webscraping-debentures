-- Criando schemas
CREATE SCHEMA IF NOT EXISTS debentures;
CREATE SCHEMA IF NOT EXISTS automacoes;


-- Tabela debentures caracteristicas
CREATE TABLE IF NOT EXISTS debentures.caracteristicas (
    codigo VARCHAR PRIMARY KEY,
    situacao VARCHAR NOT NULL,
    emissor VARCHAR NOT NULL,
    vencimento DATE,
    indice VARCHAR NOT NULL,
    taxa BIGINT 
);


-- Tabela debentures balcao
CREATE TABLE IF NOT EXISTS debentures.balcao (
    codigo_identificacao VARCHAR PRIMARY KEY,
    data_do_negocio DATE NOT NULL,
    codigo_do_ativo VARCHAR NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario BIGINT NOT NULL,
    volume_financeiro BIGINT NOT NULL,
    taxa BIGINT
);


-- Tabela Logs Automação Caracteristicas debentures
CREATE TABLE IF NOT EXISTS automacoes.logs_caracteristicas (
    data_exec TIMESTAMP NOT NULL,
    duracao INTEGER NOT NULL,
    volume INTEGER,
    status_final VARCHAR NOT NULL
);


-- Tabela Logs Automação Caracteristicas debentures
CREATE TABLE IF NOT EXISTS automacoes.logs_balcao (
    data_exec TIMESTAMP NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    status_final VARCHAR NOT NULL
);