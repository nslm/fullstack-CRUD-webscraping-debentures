import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, TablePagination, Box } from "@mui/material";
import { LogEntry } from "../types/AutomationsTypes";

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
    <Box sx={{ overflowX: "auto", mt: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map(col => <TableCell key={col.field}>{col.label}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedLogs.map((log, index) => (
            <TableRow key={index}>
              {columns.map(col => <TableCell key={col.field}>{log[col.field] ?? "-"}</TableCell>)}
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
        rowsPerPageOptions={[5, 10, 25]}
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
