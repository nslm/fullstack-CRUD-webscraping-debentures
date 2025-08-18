import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip as ChartTooltip,
  Legend,
  Colors
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { formatPercent, formatNumber, formatDate } from "../constants/AnalyticsConstants";
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
    "rgba(0, 64, 96, 0.84)",    // azul escuro fosco
    "rgba(51, 102, 102, 0.84)", // verde-azulado fosco
    "rgba(102, 153, 102, 0.86)",// verde médio fosco
    "rgba(153, 204, 153, 0.81)",// verde suave pastel
    "rgba(192, 192, 192, 0.83)",// cinza neutro
    "rgba(255, 243, 204, 0.81)" // amarelo muito suave
  ];

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

  const labels = evolucao.taxa.map(d => formatDate(d.data_do_negocio));

  const datasets = ativos.map((codigo, idx) => ({
    type: "bar" as const,
    label: codigo,
    data: evolucao.taxa.map(d => d[codigo] ?? 0),
    yAxisID: "y",
    borderColor: palette[idx % palette.length],
    borderWidth: 1,
    borderSkipped: false,
    backgroundColor: palette[idx % palette.length], 
  }));

  const options: ChartOptions<"bar"> = {
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
          label: function (context: any) {
            return `${context.dataset.label}: ${formatPercent(context.raw)}`;
          },
        },
      },
      datalabels: {
        display: false,
        color: '#000',
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: (value: any) => formatPercent(value, 2),
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        title: {
        display: true,
        text: 'Taxa (%)',
        font: {
          size: 14,
          weight: 'bold'
        }},
        beginAtZero: false,
        max: maxValor,
        position: "right" as const,
        ticks: {
        padding: 10, 
        stepSize: 1, 
        callback: function (value) {
          if (Number.isInteger(value)) {
            return value.toString() + "\u00A0\u00A0\u00A0"
          }
          return null; 
        }
      }
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
      <Box width="94%" height={openCollapseGraph2 ? "28vh" : "60vh" } ml={3.6}>
        <Chart type="bar" data={{ labels, datasets }} options={options} />
      </Box>
    </>
  );
};

export default AnalyticsGraphicTax;
