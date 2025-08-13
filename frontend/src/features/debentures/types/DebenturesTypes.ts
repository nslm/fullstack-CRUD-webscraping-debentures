export interface Debenture {
  codigo: string
  emissor: string
  vencimento: string // ISO date string (yyyy-mm-dd)
  indice: string
  taxa: number
}
