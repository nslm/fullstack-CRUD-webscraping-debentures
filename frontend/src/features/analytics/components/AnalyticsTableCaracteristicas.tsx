import React from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TableSortLabel, TablePagination, IconButton, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Caracteristica } from "../types/AnalyticsTypes";
import { formatDate } from "../constants/AnalyticsConstants";

type Props = {
  caracteristicas: Caracteristica[];
  caracPage: number;
  caracRows: number;
  orderBy: string | null;
  order: "asc" | "desc";
  handleSort: (col: string) => void;
  handleChangePage: (id: string, e: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  openCollapseGraphPaper: boolean;
  setAtivosAutoComplete: React.Dispatch<React.SetStateAction<string[]>>;
  setCaracteristicas: React.Dispatch<React.SetStateAction<Caracteristica[]>>;

};

export const AnalyticsTableCaracteristicas: React.FC<Props> = ({
  caracteristicas,
  caracPage,
  caracRows,
  orderBy,
  order,
  handleSort,
  handleChangePage,
  handleChangeRowsPerPage,
  openCollapseGraphPaper,
  setAtivosAutoComplete,
  setCaracteristicas
}) => {
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: openCollapseGraphPaper ? "58vh" : "58.6vh",
          minHeight: openCollapseGraphPaper ? "58vh" : "58.6vh",
          maxWidth: openCollapseGraphPaper ? "63vh" : "161vh",
          minWidth: openCollapseGraphPaper ? "63vh" : "161vh",
        }}
      >
        <Table stickyHeader size={openCollapseGraphPaper ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {[
                { label: "Código", field: "codigo" },
                { label: "Emissor", field: "emissor" },
                { label: "Vencimento", field: "vencimento" },
                { label: "Índice", field: "indice" },
                { label: "Taxa (%)", field: "taxa" },
              ].map((col) => (
                <TableCell
                  key={col.field}
                  sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, fontWeight: "bold" }}
                >
                  {col.field !== "acao" ? (
                    <TableSortLabel
                      active={orderBy === col.field}
                      direction={orderBy === col.field ? (order as 'asc' | 'desc') : undefined}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>

              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {([...caracteristicas].sort((a, b) => {
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
              .slice(caracPage * caracRows, caracPage * caracRows + caracRows)
              .map((row) => (
                <TableRow key={row.codigo} sx={{ height: 48 }}>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.839 }}>
                    {row.codigo}
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.839 }}>
                    <Tooltip title={row.emissor} arrow
                        componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: "0.8rem",  // aumenta o tamanho da fonte
                            padding: "10px 15px", // aumenta o padding
                          }
                        }
                      }}>
                      <span
                        style={{
                          display: "inline-block",
                          maxWidth: 80,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.emissor}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.839 }}>
                    {formatDate(row.vencimento)}
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.839 }}>
                    {row.indice}
                  </TableCell>
                  <TableCell sx={{ fontSize: openCollapseGraphPaper ? 11 : 16, py: 1.839 }}>
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
        count={caracteristicas.length}
        rowsPerPage={caracRows}
        page={caracPage}
        onPageChange={(e, newPage) => handleChangePage("caracteristicas", e, newPage)}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage("caracteristicas", e)}
        sx={{ position: "sticky", bottom: 0, backgroundColor: "white", zIndex: 1 }}
      />
    </>
  );
};

export default AnalyticsTableCaracteristicas;
