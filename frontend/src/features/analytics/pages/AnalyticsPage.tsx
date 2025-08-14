import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Tooltip as Tooltip2,
  TableContainer,
  Autocomplete,
  IconButton,
  Paper,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { API_BASE } from "../constants/AnalyticsConstants";
import DeleteIcon from '@mui/icons-material/Delete'

const AnalyticsPage: React.FC = () => {
  function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    key = "analytics_" + key;
    const [state, setState] = useState<T>(() => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch {
        return defaultValue;
      }
    });

    useEffect(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (err) {
        console.warn(`Erro salvando ${key} no localStorage`, err);
      }
    }, [key, state]);

    return [state, setState];
  }



  const [loading, setLoading] = useState(false);  
  const [ativos, setAtivos] = usePersistedState<string[]>("ativos", []);
  const [codigosUnicos, setCodigosUnicos] = usePersistedState<string[]>("codigosUnicos", []);
  const [ativosAutoComplete, setAtivosAutoComplete] = usePersistedState<string[]>("ativosAutoComplete", []);
  const [dataInicio, setDataInicio] = usePersistedState<string>("dataInicio", "2025-07-28");
  const [dataFim, setDataFim] = usePersistedState<string>("dataFim", "2025-08-08");
  const [caracteristicas, setCaracteristicas] = usePersistedState<any[]>("caracteristicas", []);
  const [balcao, setBalcao] = usePersistedState<any[]>("balcao", []);
  const [evolucao, setEvolucao] = usePersistedState<any>("evolucao", { volume: [], taxa: [] });
  const [tabIndex, setTabIndex] = usePersistedState<number>("tabIndex", 0);


  const [page, setPage] = useState<Record<string, number>>({
    caracteristicas: 0,
    balcao: 0,
  });

  const [rowsPerPage] = useState<Record<string, number>>({
    caracteristicas: 10,
    balcao: 10,
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [codigosRes] = await Promise.all([
          axios.get(`${API_BASE}/api/analytics/balcao/codigos/`),
        ]);
        setCodigosUnicos(codigosRes.data[0]?.codigos ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAllData = async () => {
    if (!ativosAutoComplete.length || !dataInicio || !dataFim) return;
    setLoading(true);
    try {
      setAtivos(ativosAutoComplete);
      const ativosParam = ativosAutoComplete.join(",");
      const [caracRes, balcaoRes, evolRes] = await Promise.all([
        axios.get(`${API_BASE}/api/analytics/caracteristicas/`, {
          params: { codigos: ativosParam },
        }),
        axios.get(`${API_BASE}/api/analytics/balcao/`, {
          params: { codigos: ativosParam, data_inicio: dataInicio, data_fim: dataFim },
        }),
        axios.get(`${API_BASE}/api/analytics/evolucao/`, {
          params: { codigos: ativosParam, data_inicio: dataInicio, data_fim: dataFim },
        }),
      ]);
      setCaracteristicas(caracRes.data);
      setBalcao(balcaoRes.data);
      setEvolucao(evolRes.data);
      setPage({ caracteristicas: 0, balcao: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCaracteristicasData = async (ativosSelecionados: string[]) => {
    setLoading(true);
    try {      
      const ativosParam = ativosSelecionados.join(",");
      const [caracRes] = await Promise.all([
        axios.get(`${API_BASE}/api/analytics/caracteristicas/`, {
          params: { codigos: ativosParam },
        }),
      ]);

      setCaracteristicas(caracRes.data);
      setPage({ caracteristicas: 0, balcao: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleChangePage = (id: string, event: unknown, newPage: number) => {
    setPage((prev) => ({ ...prev, [id]: newPage }));
  };

  const handleChangeRowsPerPage = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPage((prev) => ({ ...prev, [id]: 0 }));
  };

  const caracPage = page["caracteristicas"] ?? 0;
  const caracRows = rowsPerPage["caracteristicas"] ?? 10;
  const balcaoPage = page["balcao"] ?? 0;
  const balcaoRows = rowsPerPage["balcao"] ?? 10;

  function getColor(idx: number, total: number) {
    const hue = (idx * 360) / total; // distribui o matiz no círculo de cores
    return `hsl(${hue}, 70%, 50%)`; // saturação e luminosidade fixas
  }

  function formatValue(value: number) {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "MI";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
  }

  function formatNumber(value: number) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Grid direction="column" mt={8} mb={8} ml={0} mr={0}>
      <Grid container direction="row" ml={2} mt={4}>
        <Grid
          xs={4}
          container
          direction="column"
          sx={{ maxHeight: "30vh", minHeight: "30vh", maxWidth: "50vh", minWidth: "50vh" }}
        >
          <Paper sx={{ p: 2, boxShadow: 3 }}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={9.3} mb={1}>
                <Autocomplete
                  multiple
                  options={codigosUnicos}
                  value={ativosAutoComplete}
                  onChange={(event, newValue) => {
                    setAtivosAutoComplete(newValue);
                    fetchCaracteristicasData(newValue);                    
                  }}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Ativos" placeholder="Selecione ativos" />
                  )}
                />
              </Grid>
              <Grid item xs={2} mt={0.3}>
                <Button
                  variant="contained"
                  onClick={fetchAllData}
                  disabled={loading}
                  sx={{ height: "50px", backgroundColor: "#0723c0ff", fontWeight: "bold" }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Filtrar"}
                </Button>
              </Grid>
            </Grid>

            <Grid container direction="row" spacing={2}>
              <Grid item xs={6} mt={1} mb={2}>
                <TextField
                  type="date"
                  label="Data Início"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} mt={1} mb={2}>
                <TextField
                  type="date"
                  label="Data Fim"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box>
              <Tabs value={tabIndex} onChange={handleChange} aria-label="abas das tabelas">
                <Tab label="Característica Debentures" />
                <Tab label="Negociação Balcão" />
              </Tabs>
              <Box sx={{ mt: 2 }}>
                {tabIndex === 0 && (
                  <Grid item alignItems="left">
                    <TableContainer
                      component={Paper}
                      style={{ maxHeight: "50vh", minHeight: "50vh", maxWidth: "55vh", minWidth: "55vh" }}
                    >
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            {["Código", "Emissor", "Vencimento", "Índice", "Taxa (%)", "Ação"].map((h) => (
                              <TableCell key={h} sx={{ fontSize: 12, fontWeight: "bold" }}>
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {caracteristicas
                            .slice(caracPage * caracRows, caracPage * caracRows + caracRows)
                            .map((row) => (
                              <TableRow key={row.codigo} sx={{ height: 48 }}>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{row.codigo}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>
                                  <Tooltip2 title={row.emissor} arrow>
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
                                  </Tooltip2>
                                </TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{row.vencimento}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{row.indice}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{(row.taxa / 10 ** 4).toFixed(2)}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>                
                                  <IconButton size="small" onClick={() => {
                                      setAtivosAutoComplete(prev => prev.filter(c => c !== row.codigo));
                                      setCaracteristicas(prev =>
                                        prev.filter(item => item.codigo !== row.codigo)
                                      );
                                    }} aria-label="excluir">
                                    <DeleteIcon/>
                                  </IconButton>
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
                  </Grid>
                )}

                {tabIndex === 1 && (
                  <Grid item>
                    <TableContainer
                      component={Paper}
                      sx={{ maxHeight: "50vh", minHeight: "50vh", maxWidth: "55vh", minWidth: "55vh" }}
                    >
                      <Table stickyHeader size="small">
                        <TableHead>
                          <TableRow>
                            {["Data", "Código", "Qtd.", "Preço Uni.", "Volume", "Taxa (%)"].map((h) => (
                              <TableCell key={h} sx={{ fontSize: 12, fontWeight: "bold" }}>
                                {h}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {balcao
                            .slice(balcaoPage * balcaoRows, balcaoPage * balcaoRows + balcaoRows)
                            .map((row, idx) => (
                              <TableRow key={row.data_do_negocio + row.codigo_do_ativo + idx}>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{row.data_do_negocio}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{row.codigo_do_ativo}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>{row.quantidade}</TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.59 }}>
                                  <Tooltip2 title={formatNumber(row.preco_unitario / 10 ** 6)}>
                                    <span>{formatValue(row.preco_unitario / 10 ** 6)}</span>
                                  </Tooltip2>
                                </TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.56 }}>
                                  <Tooltip2 title={formatNumber(row.volume_financeiro / 10 ** 2)}>
                                    <span>{formatValue(row.volume_financeiro / 10 ** 2)}</span>
                                  </Tooltip2>
                                </TableCell>
                                <TableCell sx={{ fontSize: 12, py: 1.56 }}>
                                  {(row.taxa / 10 ** 4).toFixed(2)}
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
                  </Grid>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={7.4} ml={7.5} container direction="column">
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Box mb={2}>
              <Typography variant="subtitle1" align="center">
                Taxa Média Diária
              </Typography>
            </Box>
            <Box width="98%" mb={4} height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={evolucao.taxa} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data_do_negocio" />
                  <YAxis orientation="right" tickFormatter={formatNumber} domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  {ativos.map((codigo, idx) => (
                    <Line
                      key={codigo}
                      type="monotone"
                      dataKey={codigo}
                      stroke={getColor(idx, ativos.length)}
                      dot={false}
                      name={codigo}
                    />
                  ))}
                  {ativos.map((codigo, idx) => (
                    <Bar
                      key={"bar-" + codigo}
                      dataKey={codigo}
                      fill={getColor(idx, ativos.length)}
                      name={`${codigo} Volume`}
                      barSize={20}
                      tooltipType="none"
                      label={{
                        position: "top",
                        style: { fontWeight: "bold", fontSize: 14 },
                        formatter: (label: any) => formatNumber(Number(label)),
                      }}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle1" align="center">
                Volume Financeiro Médio Diário
              </Typography>
            </Box>
            <Box width="98%" height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={evolucao.volume} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data_do_negocio" />
                  <YAxis orientation="right" tickFormatter={formatValue} />
                  <Tooltip formatter={(value: number) => formatNumber(value)} />
                  {ativos.map((codigo, idx) => (
                    <React.Fragment key={codigo}>
                      <Area
                        type="monotone"
                        dataKey={codigo}
                        stroke="none"
                        fill={getColor(idx, ativos.length)}
                        tooltipType="none"
                      />
                      <Line
                        type="monotone"
                        dataKey={codigo}
                        stroke={getColor(idx, ativos.length)}
                        dot={false}
                        name={codigo}
                        label={{
                          position: "top",
                          style: { fontWeight: "bold", fontSize: 12 },
                          formatter: (label: any) => formatValue(Number(label)),
                        }}
                      />
                    </React.Fragment>
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AnalyticsPage;
