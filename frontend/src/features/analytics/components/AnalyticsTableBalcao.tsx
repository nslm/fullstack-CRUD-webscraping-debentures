import React from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TablePagination, IconButton, TableSortLabel, Tooltip
} from "@mui/material";
import type { BalcaoRow } from "../types/AnalyticsTypes";
import { formatValue, formatNumber, formatDate } from "../constants/AnalyticsConstants";

type Props = {
  balcao: BalcaoRow[];
  balcaoPage: number;
  balcaoRows: number;
  orderBy: string | null;
  order: "asc" | "desc";
  handleSort: (col: string) => void;
  handleChangePage: (id: string, e: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  openCollapseGraphPaper: boolean;
};

export const AnalyticsTableBalcao: React.FC<Props> = ({
  balcao,
  balcaoPage,
  balcaoRows,
  orderBy,
  order,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  openCollapseGraphPaper,
}) => {
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: openCollapseGraphPaper ? "58vh" : "58.6vh",
          minHeight: openCollapseGraphPaper ? "58vh" : "58.6vh",
          maxWidth: openCollapseGraphPaper ? "63vh" : "168vh",
          minWidth: openCollapseGraphPaper ? "63vh" : "168vh",
        }}
      >
        <Table stickyHeader size={openCollapseGraphPaper ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {[
                { label: "Data\u00A0\u00A0\u00A0", field: "data_do_negocio" },
                { label: "Código", field: "codigo_do_ativo" },
                { label: "Quantidade", field: "quantidade" },
                { label: "Preço Unitario", field: "preco_unitario" },
                { label: "Volume", field: "volume_financeiro" },
                { label: "Taxa (%)", field: "taxa" },
              ].map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    fontSize: openCollapseGraphPaper ? 11 : 16,
                    fontWeight: "bold",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.field}
                    direction={orderBy === col.field ? (order as 'asc' | 'desc') : undefined}
                    onClick={() => handleSort(col.field)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {([...balcao].sort((a, b) => {
              if (!orderBy || !(orderBy in a)) return 0;
              const valA = a[orderBy];
              const valB = b[orderBy];

              if (typeof valA === "number" && typeof valB === "number") {
                return order === "asc" ? valA - valB : valB - valA;
              }
              return order === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
            }))
              .slice(balcaoPage * balcaoRows, balcaoPage * balcaoRows + balcaoRows)
              .map((row, idx) => (
                <TableRow key={row.data_do_negocio + row.codigo_do_ativo + idx}>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.4915 }}>
                    {formatDate(row.data_do_negocio)}
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.4915 }}>
                    {row.codigo_do_ativo}
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.4915 }}>
                    {row.quantidade}
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.4915 }}>
                     <Tooltip title={row.preco_unitario != null ? formatValue(row.preco_unitario / 10 ** 6): "-"} 
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "0.8rem",  // aumenta o tamanho da fonte
                            padding: "10px 15px", // aumenta o padding
                          }
                        }
                      }}>
                      <span>{row.preco_unitario != null ? formatValue(row.preco_unitario / 10 ** 6): "-"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.4915 }}>
                    <Tooltip title={row.volume_financeiro != null ? formatValue(row.volume_financeiro / 10 ** 2): "-"}
                        componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "0.8rem",  // aumenta o tamanho da fonte
                            padding: "10px 15px", // aumenta o padding
                          }
                        }
                      }}>
                      <span>{ row.volume_financeiro != null ? formatValue(row.volume_financeiro / 10 ** 2): "-"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 12 : 16, py: 1.34}}>
                    {row.taxa != null ? (row.taxa / 10 ** 4).toFixed(2) : "-"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={balcao.length}
          rowsPerPage={balcaoRows}
          page={balcaoPage}
          onPageChange={(e, newPage) => handleChangePage("balcao", e, newPage)}
          onRowsPerPageChange={(e) => handleChangeRowsPerPage("balcao", e)}
        />
    </>
  );
};

export default AnalyticsTableBalcao;
