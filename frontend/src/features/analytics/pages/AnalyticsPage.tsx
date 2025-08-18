import React, { useEffect } from "react";
import axios from "axios";
import { Box, Grid, Paper, Collapse, IconButton, Tabs, Tab, Backdrop, Typography } from "@mui/material";
import { API_BASE } from "../constants/AnalyticsConstants";
import { useAnalytics } from "../hooks/useAnalytics";
import AnalyticsFilters from "../components/AnalyticsFilters";
import AnalyticsTableCaracteristicas from "../components/AnalyticsTableCaracteristicas";
import AnalyticsTableBalcao from "../components/AnalyticsTableBalcao";
import AnalyticsGraphicTax from "../components/AnalyticsGraphicTax";
import AnalyticsGraphicVolume from "../components/AnalyticsGraphicVolume";

import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';


const AnalyticsPage: React.FC = () => {
  const states = useAnalytics();
  const {
    loading, setLoading,
    openCollapse, setOpenCollapse,
    openCollapseTables, setOpenCollapseTables,
    openCollapseGraphPaper, setOpenCollapseGraphPaper,
    openCollapseGraph1, setOpenCollapseGraph1,
    openCollapseGraph2, setOpenCollapseGraph2,
    ativos, setAtivos,
    codigosUnicos, setCodigosUnicos,
    ativosAutoComplete, setAtivosAutoComplete,
    dataInicio, setDataInicio,
    dataFim, setDataFim,
    caracteristicas, setCaracteristicas,
    balcao, setBalcao,
    evolucao, setEvolucao,
    tabIndex, setTabIndex,
    page, setPage,
    rowsPerPage,
    orderBy, setOrderBy,
    order, setOrder,
    handleChangePage, handleChange,
    handleChangeRowsPerPage,
    caracPage, caracRows,
    balcaoPage, balcaoRows,
    handleSort
  } = states;


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
  }, [setCodigosUnicos, setLoading]);

  const vazio =
    caracteristicas.length === 0 &&
    balcao.length === 0 &&
    evolucao.volume.length === 0 &&
    evolucao.taxa.length === 0;

  return (
    <Grid container sx={{mt:4, mb:8, ml:0, mr:0}}>
      {openCollapse && openCollapseGraphPaper && (
      <Paper sx={{ p: 2, boxShadow: 3, ml:2, zIndex: 3, width: "96.28%" }} >
          <AnalyticsFilters   
            ativos={ativos}           
            setAtivos={setAtivos}           
            ativosAutoComplete={ativosAutoComplete}
            setAtivosAutoComplete={setAtivosAutoComplete}
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            codigosUnicos={codigosUnicos}
            loading={loading}   
            setLoading={setLoading}
            setCaracteristicas={setCaracteristicas}
            setBalcao={setBalcao}
            setEvolucao={setEvolucao}
            setPage={setPage}            
            />
        </Paper>
      )}
      <Grid container direction="row" ml={2} mt={4}>
        {openCollapse && (
        <Grid
          item
          container
          xs={openCollapseGraphPaper? 4.4:11.47}
          direction="column"
        >
        <Collapse in={openCollapse}>
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Collapse in={openCollapseGraphPaper}>
          </Collapse>
          <Box position="relative" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton
              size="small"
              onClick={() => {
                setOpenCollapseTables((prev) => !prev);
                setOpenCollapseGraphPaper((prev) => !prev);
              }}
              sx={{ position: 'absolute', right: 0, borderRadius: 1, boxShadow: 1, bgcolor: "background.paper" }}
            >
              {openCollapseTables? <OpenInFullIcon/>:<CloseFullscreenIcon/>}
            </IconButton>
            <Tabs value={tabIndex} onChange={handleChange} aria-label="abas das tabelas">
              <Tab label="Característica Debentures" />
              <Tab label="Negociação Balcão" />
            </Tabs>
          </Box>

          {tabIndex === 0 && (
          <Grid item alignItems="left">
            <AnalyticsTableCaracteristicas
                caracteristicas={caracteristicas}
                openCollapseGraphPaper={openCollapseGraphPaper}
                caracPage={caracPage}
                caracRows={caracRows}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                orderBy={orderBy}
                order={order}
                handleSort={handleSort}
                setAtivosAutoComplete={setAtivosAutoComplete}
                setCaracteristicas={setCaracteristicas}
                />
          </Grid>
          )}

          {tabIndex === 1 && (
          <Grid item alignItems="left">
            <AnalyticsTableBalcao
                balcao={balcao}
                balcaoPage={balcaoPage}
                balcaoRows={balcaoRows}
                orderBy={orderBy}
                order={order}
                handleSort={handleSort}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                openCollapseGraphPaper={openCollapseGraphPaper}
              />
          </Grid>
          )}

        </Paper>
        </Collapse>
      </Grid>
        )}

      {openCollapseGraphPaper && (
      <Grid item xs={openCollapse ? 6.83:11.45} ml={openCollapse? 7.5:0} container direction="column">
        <Collapse in={openCollapseGraphPaper}>
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Collapse in={openCollapseGraph1}>

              <Grid item xs={12} mt={2}>
                <AnalyticsGraphicTax
                    ativos={ativos}
                    evolucao={evolucao}
                    openCollapse={openCollapse}
                    setOpenCollapse={setOpenCollapse}
                    openCollapseGraph2={openCollapseGraph2}
                    setOpenCollapseGraph2={setOpenCollapseGraph2}
                />
              </Grid>
              </Collapse>
              
              <Collapse in={openCollapseGraph2}>
              <Grid item xs={12} mt={2}>
                <AnalyticsGraphicVolume 
                    ativos={ativos}
                    evolucao={evolucao}
                    openCollapse={openCollapse}
                    setOpenCollapse={setOpenCollapse}
                    openCollapseGraph1={openCollapseGraph1}
                    setOpenCollapseGraph1={setOpenCollapseGraph1}
                  />
              </Grid>

            </Collapse>
          </Paper>
        </Collapse>
      </Grid>
      )}

      {vazio && (
        <Box
          sx={{
            position: "fixed",
            top: "0vh",
            left: "0vw",
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0, 0, 0, 0.32)", // cinza claro
            display: "flex",
            justifyContent: "center",
            borderRadius:1,
            alignItems: "center",
            zIndex: 2,
          }}
        >
          <Typography variant="h2" color="text.secondary">
            Insira algum ativo
          </Typography>
        </Box>
      )}
      </Grid>
    </Grid>
  );
};

export default AnalyticsPage;
