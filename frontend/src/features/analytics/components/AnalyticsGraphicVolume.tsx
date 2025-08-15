import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { formatValue, formatNumberRS } from "../constants/AnalyticsConstants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend,
  ChartDataLabels
);

function safeValue(value: number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return value;
}

type Props = {
  ativos: string[];
  evolucao: { volume: any[]; taxa: any[] };
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
  // Paleta de 9 cores
const palette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22"
];

  const labels = evolucao.volume.map((d: any) => d.data_do_negocio);

  const datasets = ativos.map((codigo, idx) => ({
    type: "line" as const,
    label: codigo,
    data: evolucao.volume.map((d: any) => safeValue(d[codigo])),
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    yAxisID: "y",
    borderColor: palette[idx % palette.length],
    backgroundColor: palette[idx % palette.length] + "33", // 20% opacity
    borderWidth: 1.6,
    borderSkipped: false,
  }));

  const todosValores = evolucao.volume.flatMap((d) =>
    ativos.map((codigo) => safeValue(d[codigo]))
  );
  const maxValor = Math.max(...todosValores) * 1.2;

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `${context.dataset.label}: ${formatNumberRS(safeValue(context.raw))}`,
        },
      },
      datalabels: {
        display: true,
        color: "#000",
        anchor: "end" as const,
        align: "top" as const,
        formatter: (value: any) => formatValue(safeValue(value)),
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        max: maxValor,
        position: "right" as const,
        ticks: {
          callback: (value: any) => formatValue(Number(value)),
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 0,
        },
      },
    },
  };

  return (
    <>
      <Box
        position="relative"
        ml={2}
        mb={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <IconButton
          size="small"
          onClick={() => {
            setOpenCollapse((prev) => !prev);
            setOpenCollapseGraph1((prev) => !prev);
          }}
          sx={{
            position: "absolute",
            right: 0,
            borderRadius: 1,
            boxShadow: 1,
            bgcolor: "background.paper",
          }}
        >
          {openCollapse ? <OpenInFullIcon /> : <CloseFullscreenIcon />}
        </IconButton>
        <Typography variant="subtitle1" align="center">
          Volume Financeiro Médio Diário
        </Typography>
      </Box>
      <Box width="98%" height={openCollapseGraph1 ? "31.5vh" : "64.5vh"}>
        <Chart type="line" data={{ labels, datasets }} options={options} />
      </Box>
    </>
  );
};

export default AnalyticsGraphicVolume;
