import React, { useState, useEffect, useRef } from "react";
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
  TextField
} from "@mui/material";
import { DayPicker } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { v4 as uuidv4 } from 'uuid';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:8000';


const AUTOMATIONS = [
  { id: "caracteristicas", label: "Automação Características das Debêntures" },
  { id: "balcao", label: "Automação Dados de Negociação de Balcão" },
];


type LogEntry = {
  [key: string]: any;
};


const LOG_COLUMNS: Record<string, { field: string; label: string }[]> = {
  balcao: [
    { field: "data_exec", label: "Horário Execução" },
    { field: "data_inicio", label: "Data Inicial" },
    { field: "data_fim", label: "Data Final" },
    { field: "status_final", label: "Status" },
  ],
  caracteristicas: [
    { field: "data_exec", label: "Horário Execução" },
    { field: "duracao", label: "Duração" },
    { field: "volume", label: "Volume" },
    { field: "status_final", label: "Status" },
  ],
};


export default function AutomationsPage() {
  const [statuses, setStatuses] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [openLogs, setOpenLogs] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState<Record<string, number>>({});
  const [rowsPerPage, setRowsPerPage] = useState<Record<string, number>>({ caracteristicas: 5, balcao: 5 });
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState({ startDate: "", finalDate: "" });
  const [markedDates, setMarkedDates] = useState<string[]>([]);  
  const [lastWorkday, setLastWorkday] = useState<string>("");  
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const parseDate = (isoDate: string) => parseISO(isoDate);


  const toggleLogs = (id: string) => {
    setOpenLogs(prev => {
      const isCurrentlyOpen = !!prev[id];

      if (id === "balcao") {
        if (isCurrentlyOpen) {
          return { ...prev, [id]: false };
        } else {
          setOpenDateFilter(false);
          return { ...prev, [id]: true };
        }
      } else {
        return { ...prev, [id]: !isCurrentlyOpen };
      }
    });
  };


  const toggleDateFilter = () => {
    if (openDateFilter) {
      setOpenDateFilter(false);
    } else {
      setOpenDateFilter(true);
      setOpenLogs(prev => ({ ...prev, balcao: false }));
    }
  };

  

  const intervalsRef = useRef<Record<string, number>>({});

  async function startAutomation(id: string) {
    setLoading(prev => ({ ...prev, [id]: true }));
    const runId = uuidv4();
    
    try {
      let options = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ run_id: runId }) };
      if (id === "balcao") {
        options.body = JSON.stringify({
          run_id: runId,
          Start_Date: dateFilter.startDate,
          Final_Date: dateFilter.finalDate
        });
      }
      startPolling(id, runId);

      const res = await fetch(`${API_BASE}/api/coleta/${id}/start/`, options);
      const json = await res.json();

      if (!res.ok) {
        setStatuses(prev => ({ ...prev, [id]: "Status não disponível" }));
        setLoading(prev => ({ ...prev, [id]: false }));
        return;
      }

      fetchLogs(id);

    } catch {
      setStatuses(prev => ({ ...prev, [id]: "Status não disponível" }));
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  }


  function startPolling(id: string, storedRunId: string) {
    if (intervalsRef.current[id]) {
      clearInterval(intervalsRef.current[id]);
    }

    const finalStatuses = [
      "Dados atualizados com sucesso!",
      "Erro na coleta.",
      "Erro ao tentar salvar na base."
    ];

    const fetchStatus = async () => {
      try {
        console.log(`Buscando status para ${id} com runId ${storedRunId}`);
        const res = await fetch(`${API_BASE}/api/coleta/${id}/status/${storedRunId}/`);
        const data = await res.json();

        console.log(`Status recebido: ${data.status}`);
        setStatuses(prev => ({ ...prev, [id]: data.status || "Status não disponível" }));

        if (finalStatuses.includes(data.status)) {
          clearInterval(intervalsRef.current[id]);
          delete intervalsRef.current[id];
          setLoading(prev => ({ ...prev, [id]: false }));
          fetchLogs(id);
        }

      } catch {
        setStatuses(prev => ({ ...prev, [id]: "Status não disponível" }));
      }
    };

    fetchStatus();
    intervalsRef.current[id] = window.setInterval(fetchStatus, 10);
  }

  async function fetchLogs(id: string) {
    try {
      const res = await fetch(`${API_BASE}/api/coleta/${id}/logs/`);
      if (!res.ok) throw new Error("Erro ao carregar logs");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.logs ?? [];
      setLogs(prev => ({ ...prev, [id]: arr }));
    } catch (error) {
      console.error("Falha ao buscar logs:", error);
    }
  }

  useEffect(() => {
      const fetchDatesAndLastWorkday = async () => {
        try {
          const resDates = await fetch(`${API_BASE}/api/coleta/balcao/dates/`);
          if (!resDates.ok) throw new Error("Erro ao buscar datas");
          const datesData = await resDates.json();
          setMarkedDates(datesData.dates); 

          const resLastWorkday = await fetch(`${API_BASE}/api/coleta/balcao/lastworkday/`);
          if (!resLastWorkday.ok) throw new Error("Erro ao buscar último dia útil");
          const lastWorkdayData = await resLastWorkday.json();
          setLastWorkday(lastWorkdayData.last_workday)
          setDateFilter({
            startDate: lastWorkdayData.last_workday,
            finalDate: lastWorkdayData.last_workday
          });

        } catch (error) {
          console.error(error);
        }
      };

    fetchDatesAndLastWorkday();

    const fetchAllLogs = () => {
      AUTOMATIONS.forEach(({ id }) => {
        fetchLogs(id);
      });
    };

    fetchAllLogs();
    return () => {
      Object.values(intervalsRef.current).forEach((i) => window.clearInterval(i));
      intervalsRef.current = {};
    };
  }, []);


  const handleChangePage = (id: string, event: unknown, newPage: number) => {
    setPage(prev => ({ ...prev, [id]: newPage }));
  };

  const handleChangeRowsPerPage = (id: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(prev => ({ ...prev, [id]: value }));
    setPage(prev => ({ ...prev, [id]: 0 }));
  };

  return (

    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Controle de Automações</Typography>

      <Grid container spacing={4}>
        {AUTOMATIONS.map(({ id, label }) => {
          const logsForId: LogEntry[] = logs[id] ?? [];
          const currentPage = page[id] || 0;
          const currentRowsPerPage = rowsPerPage[id] || 5;
          const emptyRows = currentPage > 0
            ? Math.max(0, (1 + currentPage) * currentRowsPerPage - logsForId.length)
            : Math.max(0, currentRowsPerPage - Math.min(logsForId.length, currentRowsPerPage));
          const paginatedLogs = logsForId.slice(
            currentPage * currentRowsPerPage,
            currentPage * currentRowsPerPage + currentRowsPerPage
          );

          const columns = LOG_COLUMNS[id] ?? [{ field: "data_exec", label: "Horário Execução" }, { field: "status_final", label: "Status" }];

          return (
            <Grid item xs={12} md={6} key={id}>
              <Paper sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", mb: 4}}>
                  <Typography variant="h6">{label}</Typography>
                  <Button variant="contained" onClick={() => startAutomation(id)} disabled={!!loading[id]}>
                    {loading[id] ? <CircularProgress size={24} color="inherit" /> : "Start"}
                  </Button>                  
                </Box>

                <Typography sx={{ mb: 2 }}>
                  {statuses[id] ?? "\u00A0"}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Button variant="outlined" onClick={() => toggleLogs(id)} endIcon={openLogs[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
                    Logs de Execução
                  </Button>

                  {id === "balcao" && (
                    <Button
                      variant="outlined"
                      onClick={toggleDateFilter}
                      endIcon={openDateFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                      Filtrar por Datas
                    </Button>
                  )}
                </Box>

                <Collapse in={openLogs[id]} timeout="auto" unmountOnExit>
                  <Box sx={{ overflowX: "auto", mt: 1 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            {columns.map((col) => (
                              <TableCell key={col.field}>{col.label}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedLogs.map((log, index) => (
                            <TableRow key={index}>
                              {columns.map((col) => (
                                <TableCell key={col.field}>
                                  {log[col.field] ?? "-"}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                          {emptyRows > 0 && Array.from({ length: emptyRows }).map((_, i) => (
                            <TableRow key={`empty-${i}`} style={{ height: 33 }}>
                              <TableCell colSpan={columns.length} />
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={logsForId.length}
                    rowsPerPage={rowsPerPage[id] || 5}
                    page={currentPage}
                    onPageChange={(e, newPage) => handleChangePage(id, e, newPage)}
                    onRowsPerPageChange={(e) => handleChangeRowsPerPage(id, e)}
                  />
                </Collapse>

                {id === "balcao" && (
                  <Collapse in={openDateFilter} timeout="auto" unmountOnExit>
                    <Grid container spacing={2} justifyContent="space-between" sx={{ mb: 2 }}>
                      
                          <Grid item>
                            <Typography>Data Início</Typography>
                            <DayPicker
                              mode="single"
                              selected={parseDate(dateFilter.startDate)}
                              onSelect={(date) => {
                                if (date) setDateFilter(prev => ({ ...prev, startDate: format(date, 'yyyy-MM-dd') }));
                              }}
                              modifiers={{
                                marked: markedDates.map(parseDate),
                                lastWorkday: parseDate(lastWorkday)
                              }}
                              modifiersClassNames={{
                                marked: 'marked-day',
                                lastWorkday: 'lastworkday-day'
                              }}
                              modifiersStyles={{
                                marked: {
                                  backgroundColor: "green",
                                  color: "white",
                                },
                              }}
                            />
                          </Grid>
                          <Grid item>
                            <Typography>Data Fim</Typography>
                            <DayPicker
                              mode="single"
                              selected={parseDate(dateFilter.finalDate)}
                              onSelect={(date) => {
                                if (date) setDateFilter(prev => ({ ...prev, finalDate: format(date, 'yyyy-MM-dd') }));
                              }}
                              modifiers={{
                                marked: markedDates.map(parseDate),
                                lastWorkday: parseDate(lastWorkday)
                              }}
                              modifiersClassNames={{
                                marked: 'marked-day',
                                lastWorkday: 'lastworkday-day'
                              }}
                              modifiersStyles={{
                                marked: {
                                  backgroundColor: "green",
                                  color: "white",
                                },
                              }}
                              />
                          </Grid>
                        </Grid>
                  </Collapse>
                )}
                </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

<style>
{`
  .marked-day {
    background-color: #4caf50 !important;  /* verde */
    color: white !important;
  }
  .lastworkday-day {
    background-color: white !important;
    color: black !important;
    border: 2px solid #2196f3; /* azul para destacar */
  }
`}
</style>