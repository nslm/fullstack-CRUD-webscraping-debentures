export type Caracteristica = {
  codigo: string;
  emissor: string;
  vencimento?: string;
  indice: string;
  taxa?: number;
  acao: string;
  [key: string]: any;
};

export type BalcaoRow = {
  data_do_negocio: string;
  codigo_do_ativo: string;
  quantidade: number;
  preco_unitario?: number;
  volume_financeiro?: number;
  taxa?: number;
  [key: string]: any;
};

export type Evolucao = {
  volume: Array<Record<string, any>>;
  taxa: Array<Record<string, any>>;
};