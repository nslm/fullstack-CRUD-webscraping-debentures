import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Area,  Line, Tooltip } from "recharts";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { formatValue, formatValueRS, formatNumberRS, getColor } from "../constants/AnalyticsConstants";


type Props = {
  ativos: string[];
  evolucao: { volume: [], taxa: [] };
  openCollapse: boolean;
  setOpenCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  openCollapseGraph1: boolean;
  setOpenCollapseGraph1: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AnalyticsGraphicVolume: React.FC<Props> = ({ 
  ativos,
  evolucao,
  openCollapse,
  setOpenCollapse,
  openCollapseGraph1,
  setOpenCollapseGraph1,

  }) => {
  return (
    <>
      <Box position="relative" ml={2} mb={0} display="flex" justifyContent="center" alignItems="center">
        <IconButton
          size="small"
          onClick={() => {
            setOpenCollapse((prev) => !prev);
            setOpenCollapseGraph1((prev) => !prev);
          }}
          sx={{ position: 'absolute', right: 0, borderRadius: 1, boxShadow: 1, bgcolor: "background.paper" }}
        >
          {openCollapse? <OpenInFullIcon/>:<CloseFullscreenIcon/>}
        </IconButton>
        <Typography variant="subtitle1" align="center">
          Volume Financeiro Médio Diário
        </Typography>
      </Box>
      <Box width="98%" height={openCollapseGraph1? "31.5vh":"64.5vh"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={evolucao.volume} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data_do_negocio" />
            <YAxis orientation="right" tickFormatter={formatValue} width={60}/>
            <Tooltip formatter={(value: number) => formatNumberRS(value)} />
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
    </>
  );
};

export default AnalyticsGraphicVolume;
