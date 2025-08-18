import React from "react";
import axios from "axios";
import { Grid, Autocomplete, TextField, Button, CircularProgress, Chip } from "@mui/material";
import { API_BASE } from "../constants/AnalyticsConstants";

type Props = {
  ativos: string[];
  setAtivos: React.Dispatch<React.SetStateAction<any[]>>;
  ativosAutoComplete: string[];
  setAtivosAutoComplete: (a: string[]) => void;
  dataInicio: string;
  setDataInicio: (d: string) => void;
  dataFim: string;
  setDataFim: (d: string) => void;
  codigosUnicos: string[];
  loading: boolean;
  setLoading: (d: boolean) => void;
  setCaracteristicas: React.Dispatch<React.SetStateAction<any[]>>;
  setBalcao: React.Dispatch<React.SetStateAction<any[]>>;
  setEvolucao: React.Dispatch<React.SetStateAction<{ volume: any[]; taxa: any[] }>>;
  setPage: ({ caracteristicas, balcao }: { caracteristicas: number; balcao: number }) => void
};

export const AnalyticsFilters: React.FC<Props> = ({
  ativos,
  setAtivos,
  ativosAutoComplete,
  setAtivosAutoComplete,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  codigosUnicos,
  loading,
  setLoading,
  setCaracteristicas,
  setBalcao,
  setEvolucao,
  setPage

}) => {

  const fetchAllData = async () => {
    setAtivos(ativosAutoComplete);
    console.log(ativosAutoComplete);

    if (ativosAutoComplete.length === 0) {
      setCaracteristicas([]);
      setBalcao([]);
      setEvolucao({ volume: [], taxa: [] });
      setPage({ caracteristicas: 0, balcao: 0 });
      return;
    }

    setLoading(true);
    try {
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
    }
  };


  return (
    <>            
      <Grid container direction="row" spacing={2}>
        <Grid item xs={6.5} mt={0}>
          <Autocomplete
            multiple
            options={codigosUnicos}
            value={ativosAutoComplete}
            onChange={(event, newValue) => {
              setAtivosAutoComplete(newValue);                   
            }}
            renderTags={(value: string[], getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })} 
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Ativos" placeholder="Selecione ativos" />
            )}
          />
        </Grid>

        <Grid item xs={2} mt={0}>
          <TextField
            type="date"
            label="Data Início"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </Grid>

        <Grid item xs={2} mt={0}>
          <TextField
            type="date"
            label="Data Fim"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            />
        </Grid>

        <Grid item xs={1.5} mt={0.31}>
          <Button
            variant="contained"
            onClick={fetchAllData}
            disabled={loading}
            sx={{ height: "50px", backgroundColor: "#0723c0ff", fontWeight: "bold", width:"100%" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Gerar Report"}
          </Button>
        </Grid>

      </Grid>
    </>
  );
};

export default AnalyticsFilters;
