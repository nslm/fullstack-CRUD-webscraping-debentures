import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Collapse,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Paper,
  TablePagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000'

const AUTOMATIONS = [
  { id: "caracteristicas", label: "Automação Características das Debêntures" },
  { id: "balcao", label: "Automação Dados de Negociação de Balcão" },
];

// Mock de logs para exemplo
const exampleLogs = {
  caracteristicas: [
    { data: "2025-08-10 10:00", duracao: "2m30s", status: "Sucesso" },
    { data: "2025-08-09 14:15", duracao: "3m10s", status: "Erro" },
    { data: "2025-08-08 11:00", duracao: "1m45s", status: "Sucesso" },
    { data: "2025-08-07 16:20", duracao: "2m00s", status: "Sucesso" },
    { data: "2025-08-06 09:30", duracao: "2m15s", status: "Erro" },
    { data: "2025-08-05 14:50", duracao: "2m40s", status: "Sucesso" },
    { data: "2025-08-04 10:10", duracao: "3m00s", status: "Sucesso" },
  ],
  balcao: [
    { data: "2025-08-10 09:45", duracao: "1m20s", status: "Sucesso" },
    { data: "2025-08-09 13:00", duracao: "1m30s", status: "Erro" },
  ],
};

export default function AutomationsPage() {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState({});
  const [openLogs, setOpenLogs] = useState({});
  const [page, setPage] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState({ caracteristicas: 5, balcao: 5 });


  async function startAutomation(id) {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await fetch(`${API_BASE}/api/coleta/${id}/start`, { method: "POST" });
      pollStatus(id);
    } catch (err) {
      setStatuses((prev) => ({ ...prev, [id]: "Erro ao iniciar automação" }));
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  }

  async function pollStatus(id) {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/coleta/${id}/status`);
        const data = await res.json();
        console.log(data)
        setStatuses((prev) => ({ ...prev, [id]: data.status }));

        if (
          data.status === "Dados atualizados com sucesso!" ||
          data.status === "Erro na coleta." ||
          data.status === "Sem status"
        ) {
          clearInterval(interval);
          setLoading((prev) => ({ ...prev, [id]: false }));
          // Aqui você pode atualizar os logs buscando do backend, se quiser
        }
      } catch {
        setStatuses((prev) => ({ ...prev, [id]: "Erro ao buscar status" }));
        clearInterval(interval);
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
    }, 2000);
  }

  useEffect(() => {
    AUTOMATIONS.forEach((auto) => pollStatus(auto.id));
  }, []);

  const toggleLogs = (id) => {
    setOpenLogs((prev) => ({ ...prev, [id]: !prev[id] }));
    // Resetar paginação ao abrir
    if (!openLogs[id]) {
      setPage((prev) => ({ ...prev, [id]: 0 }));
    }
  };

  const handleChangePage = (id, event, newPage) => {
    setPage((prev) => ({ ...prev, [id]: newPage }));
  };

  const handleChangeRowsPerPage = (id, event) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(prev => ({ ...prev, [id]: value }));
    setPage(prev => ({ ...prev, [id]: 0 }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Controle de Automações
      </Typography>
      <Grid container spacing={4}>
        {AUTOMATIONS.map(({ id, label }) => {
          const logs = exampleLogs[id] || [];
          const currentPage = page[id] || 0;
          const currentRowsPerPage = rowsPerPage[id] || 5;
          const emptyRows =
            currentPage > 0
              ? Math.max(0, (1 + currentPage) * currentRowsPerPage - logs.length)
              : 0;
          const paginatedLogs = logs.slice(
            currentPage * currentRowsPerPage,
            currentPage * currentRowsPerPage + currentRowsPerPage
          );
          return (
            <Grid item xs={12} md={6} key={id}>
              <Paper sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{label}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => startAutomation(id)}
                    disabled={loading[id]}
                  >
                    {loading[id] ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Start"
                    )}
                  </Button>
                </Box>
                <Typography sx={{ mb: 2 }}>
                  Status: {statuses[id] || "Status não disponível"}
                </Typography>
                <Button
                  onClick={() => toggleLogs(id)}
                  endIcon={openLogs[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  Logs de Execução
                </Button>
                <Collapse in={openLogs[id]} timeout="auto" unmountOnExit>
                  <Box sx={{overflowX: "auto", mt: 1, }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Data</TableCell>
                          <TableCell>Duração</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedLogs.map((log, index) => (
                          <TableRow key={index}>
                            <TableCell>{log.data}</TableCell>
                            <TableCell>{log.duracao}</TableCell>
                            <TableCell>{log.status}</TableCell>
                          </TableRow>
                        ))}
                        {emptyRows > 0 &&
                          Array.from(Array(emptyRows)).map((_, i) => (
                            <TableRow key={`empty-${i}`} style={{ height: 33 }}>
                              <TableCell colSpan={3} />
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={logs.length}
                    rowsPerPage={rowsPerPage[id] || 5}
                    page={currentPage}
                    onPageChange={(e, newPage) => handleChangePage(id, e, newPage)}
                    onRowsPerPageChange={(event) => handleChangeRowsPerPage(id, event)} 
                  />
                </Collapse>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
