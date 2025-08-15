import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip as ChartTooltip,
  Legend,
  Colors
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { formatPercent, formatValue, formatNumberRS } from "../constants/AnalyticsConstants";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTooltip,
  Legend,
  Colors,
  ChartDataLabels
);

const palette = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22"
];


function safePercent(value: number | null | undefined, decimal: number = 2) {
  if (value === null || value === undefined) return "-";
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  })}%`;
}

function safeNumber(value: number | null | undefined, decimal: number = 2) {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
}

type Props = {
  ativos: string[];
  evolucao: { volume: any[]; taxa: any[]; precoMedio?: any[] };
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

  const todosValores = evolucao.taxa.flatMap(d =>
    ativos.map(codigo => d[codigo])
  );
  const maxValor = Math.max(...todosValores.filter(v => v !== undefined)) * 1.2;

  const labels = evolucao.taxa.map(d => d.data_do_negocio);

  const datasets = ativos.map((codigo, idx) => ({
    type: "bar" as const,
    label: codigo,
    data: evolucao.taxa.map(d => d[codigo] ?? 0),
    yAxisID: "y",
    borderColor: palette[idx % palette.length],
    borderWidth: 1,
    borderSkipped: false,
    backgroundColor: palette[idx % palette.length] + "33", // Opacidade
  }));

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
          label: function (context: any) {
            return `${context.dataset.label}: ${safePercent(context.raw)}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: '#000',
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: any) => safePercent(value, 2),
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
          callback: function (value: any) {
            return safePercent(Number(value), 0);
          },
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
            setOpenCollapse(prev => !prev);
            setOpenCollapseGraph2(prev => !prev);
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
          Taxa Média Diária
        </Typography>
      </Box>
      <Box width="98%" mb={2} height={openCollapseGraph2 ? "30vh" : "61vh"}>
        <Chart type="bar" data={{ labels, datasets }} options={options} />
      </Box>
    </>
  );
};

export default AnalyticsGraphicTax;
