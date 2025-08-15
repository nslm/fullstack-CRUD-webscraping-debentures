import React, { useEffect } from "react";
import axios from "axios";
import { Box, Grid, Paper, Collapse, IconButton, Tabs, Tab } from "@mui/material";
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


  return (
    <Grid mt={8} mb={8} ml={0} mr={0} container spacing={8}>
      <Grid container direction="row" ml={2} mt={4}>
        {openCollapse && (
        <Grid
          item
          container
          xs={openCollapseGraphPaper? 4.5:12}
          direction="column"
          sx={{ maxHeight: "30vh", minHeight: "30vh", maxWidth: "50vh", minWidth: "50vh" }}
        >
        <Collapse in={openCollapse}>
        <Paper sx={{ p: 2, boxShadow: 3 }}>
          <Collapse in={openCollapseGraphPaper}>
            <AnalyticsFilters   
              ativos={ativos}           
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
          </Collapse>
          <Box position="relative" display="flex" justifyContent="space-between" alignItems="center" sx={{mr:0}}>
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

          {/* Tables */}
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
      <Grid item xs={openCollapse ? 7.052:12} ml={openCollapse? 7.5:0} container direction="column">
        <Collapse in={openCollapseGraphPaper}>
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Collapse in={openCollapseGraph1}>

              {/* Charts */}
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

      </Grid>
    </Grid>
  );
};

export default AnalyticsPage;
