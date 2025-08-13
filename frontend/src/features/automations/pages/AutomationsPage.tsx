import { Box, Typography, Grid, Paper, Button, CircularProgress, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAutomations } from "../hooks/useAutomations";
import AutomationsLogsTable from "../components/AutomationsLogsTable";
import AutomationsDateFilter from "../components/AutomationsDateFilter";
import { AUTOMATIONS, LOG_COLUMNS } from "../constants/AutomationsConstants";


export default function AutomationsPage() {
  const {
    statuses, loading, openLogs, page, rowsPerPage, openDateFilter, dateFilter, setDateFilter,
    lastWorkday, markedDates, notWorkdayList, logs, dateFilterLoading,
    toggleLogs, toggleDateFilter, startAutomation,
    handleChangePage, handleChangeRowsPerPage, parseDate
  } = useAutomations();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', mb: 2, px: 12, mt: 8 }}>
      <Typography variant="h4" gutterBottom>Controle de Automações</Typography>

      <Grid container spacing={8}>
        {AUTOMATIONS.map(({ id, label }) => {
          const logsForId = logs[id] ?? [];
          const currentPage = page[id] || 0;
          const currentRowsPerPage = rowsPerPage[id] || 5;
          const columns = LOG_COLUMNS[id] ?? [{ field: "data_exec", label: "Horário Execução" }, { field: "status_final", label: "Status" }];

          return (
            <Grid item xs={12} md={6} key={id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: "space-between", alignItems: "center", mb: 4}}>
                  <Typography variant="h6">{label}</Typography>
                  <Button variant="contained" onClick={() => startAutomation(id)} disabled={!!loading[id]} sx={{backgroundColor: '#0723c0ff', fontWeight: 'bold'}}>
                    {loading[id] ? <CircularProgress size={24} color="inherit" /> : "Start"}
                  </Button>                  
                </Box>

                <Typography sx={{ mb: 2 }}>{statuses[id] ?? "\u00A0"}</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Button variant="outlined" onClick={() => toggleLogs(id)} endIcon={openLogs[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}>Logs de Execução</Button>
                  {id === "balcao" && (
                    <Button variant="outlined" onClick={toggleDateFilter} endIcon={openDateFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}>
                      Selecionar Datas
                    </Button>
                  )}
                </Box>

                <Collapse in={openLogs[id]} timeout="auto" unmountOnExit>
                  <AutomationsLogsTable
                    logs={logsForId}
                    columns={columns}
                    page={currentPage}
                    rowsPerPage={currentRowsPerPage}
                    handleChangePage={(e, newPage) => handleChangePage(id, e, newPage)}
                    handleChangeRowsPerPage={(e) => handleChangeRowsPerPage(id, e)}
                  />
                </Collapse>

                {id === "balcao" && (
                  <Collapse in={openDateFilter} timeout="auto" unmountOnExit>
                    <AutomationsDateFilter
                      dateFilter={dateFilter}
                      setDateFilter={setDateFilter}
                      markedDates={markedDates}
                      notWorkdayList={notWorkdayList}
                      lastWorkday={lastWorkday}
                      loading={dateFilterLoading}
                      parseDate={parseDate}
                    />
                  </Collapse>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );}
