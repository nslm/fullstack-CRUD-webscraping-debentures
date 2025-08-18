import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Box } from "@mui/material";
import { LogEntry } from "../types/AutomationsTypes";
import { formattedDate } from "../constants/AutomationsConstants";

type Props = {
  logs: LogEntry[];
  columns: { field: string; label: string }[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AutomationsLogsTable({ logs, columns, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }: Props) {
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - logs.length)
    : Math.max(0, rowsPerPage - Math.min(logs.length, rowsPerPage));
  const paginatedLogs = logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ mt: 3.2 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col.field}>{col.label}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedLogs.map((log, index) => (
            <TableRow key={index}>
              {columns.map(col => {
                const value = log[col.field];

                // aplica formatação apenas se for string contendo data/hora
                const formattedValue =
                  typeof value === "string" && /\d{4}-\d{2}-\d{2}/.test(value)
                    ? formattedDate(value)
                    : value ?? "-";

                return <TableCell key={col.field}>{formattedValue}</TableCell>;
              })}
            </TableRow>
          ))}
          {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, i) => (
            <TableRow key={`empty-${i}`} style={{ height: 33 }}>
              <TableCell colSpan={columns.length} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
