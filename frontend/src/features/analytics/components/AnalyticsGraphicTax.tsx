import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line } from "recharts";
import { formatNumber, formatPercent, getColor } from "../constants/AnalyticsConstants";


type Props = {
  ativos: string[];
  evolucao: { volume: [], taxa: [] };
  openCollapse: boolean;
  setOpenCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  openCollapseGraph2: boolean;
  setOpenCollapseGraph2: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AnalyticsGraphicTax: React.FC<Props> = ({ 
  ativos,
  evolucao,
  openCollapse, 
  setOpenCollapse,
  openCollapseGraph2, 
  setOpenCollapseGraph2,
  }) => {
  return (
    <>
      <Box position="relative" ml={2} mb={0} display="flex" justifyContent="center" alignItems="center">
        <IconButton
          size="small"
          onClick={() => {
            setOpenCollapse((prev) => !prev);
            setOpenCollapseGraph2((prev) => !prev);
          }}
          sx={{ position: 'absolute', right: 0, borderRadius: 1, boxShadow: 1, bgcolor: "background.paper" }}
        >
          {openCollapse? <OpenInFullIcon/>:<CloseFullscreenIcon/>}
        </IconButton>
        <Typography variant="subtitle1" align="center">
          Taxa Média Diária
        </Typography>
      </Box>
      <Box width="98%" mb={2} height={openCollapseGraph2? "30vh":"61vh"}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={evolucao.taxa} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data_do_negocio" />
            <YAxis orientation="right" tickFormatter={formatPercent} domain={["dataMin - 1", "dataMax + 1"]} width={68} />
            <Tooltip formatter={(value: number) => formatPercent(value)} />
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
    </>
  );
};

export default AnalyticsGraphicTax;
