import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import {
  Chart as ChartJS,
  ChartOptions,
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
import { formatValue, formatNumberRS, safeValue, formatDate } from "../constants/AnalyticsConstants";

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

  const palette = [
    "rgba(0, 64, 96, 0.84)",    // azul escuro fosco
    "rgba(51, 102, 102, 0.84)", // verde-azulado fosco
    "rgba(102, 153, 102, 0.86)",// verde médio fosco
    "rgba(153, 204, 153, 0.81)",// verde suave pastel
    "rgba(192, 192, 192, 0.83)",// cinza neutro
    "rgba(255, 243, 204, 0.81)" // amarelo muito suave
  ];

  const labels = evolucao.volume.map((d: any) => formatDate(d.data_do_negocio));

  const datasets = ativos.map((codigo, idx) => ({
    type: "line" as const,
    label: codigo,
    data: evolucao.volume.map((d: any) => safeValue(d[codigo])),
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    yAxisID: "y",
    borderColor: palette[idx % palette.length],
    backgroundColor: palette[idx % palette.length], 
    borderWidth: 1.6,
    borderSkipped: false,
  }));

  const todosValores = evolucao.volume.flatMap((d) =>
    ativos.map((codigo) => safeValue(d[codigo]))
  );
  const maxValor = Math.max(...todosValores) * 1.2;

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false as const,
    layout: {
    padding: {
      left: 0,
      right: 0,
    }},
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
        display: false,
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
        title: {
        display: true,
        text: 'Volume Financeiro',
        font: {
          size: 14,
          weight: 'bold'
        }},
        beginAtZero: false,
        max: maxValor,
        position: "right" as const,
        ticks: {
          padding: 10, 
          callback: (value: any) => formatValue(Number(value)),
        },
      },
      x: {
        grid: {
          drawOnChartArea: false,
          drawTicks: true,  
          },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          padding: 0,
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
      <Box width="98%" height={openCollapseGraph1 ? "28vh" : "60vh"}>
        <Chart type="line" data={{ labels, datasets }} options={options} />
      </Box>
    </>
  );
};

export default AnalyticsGraphicVolume;
