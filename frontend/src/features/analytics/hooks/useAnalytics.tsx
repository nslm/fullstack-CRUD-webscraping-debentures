import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../constants/AnalyticsConstants";


export function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = "analytics_" + key;
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [storageKey, state]);

  return [state, setState];
}

export function useAnalytics() {
  const [loading, setLoading] = usePersistedState<boolean>("loading", false);
  const [openCollapse, setOpenCollapse] = usePersistedState<boolean>("openCollapse", true);
  const [openCollapseTables, setOpenCollapseTables] = usePersistedState<boolean>("openCollapseTables", true);
  const [openCollapseGraphPaper, setOpenCollapseGraphPaper] = usePersistedState<boolean>("openCollapseGraphPaper", true);
  const [openCollapseGraph1, setOpenCollapseGraph1] = usePersistedState<boolean>("openCollapseGraph1", true);
  const [openCollapseGraph2, setOpenCollapseGraph2] = usePersistedState<boolean>("openCollapseGraph2", true);
  const [ativos, setAtivos] = usePersistedState<string[]>("ativos", ["PETR17", "RIS424", "SBSPE9"]);
  const [codigosUnicos, setCodigosUnicos] = usePersistedState<string[]>("codigosUnicos", []);
  const [ativosAutoComplete, setAtivosAutoComplete] = usePersistedState<string[]>("ativosAutoComplete", []);
  const [dataInicio, setDataInicio] = usePersistedState<string>("dataInicio", "2025-07-28");
  const [dataFim, setDataFim] = usePersistedState<string>("dataFim", "2025-08-08");
  const [caracteristicas, setCaracteristicas] = usePersistedState<any[]>("caracteristicas", []);
  const [balcao, setBalcao] = usePersistedState<any[]>("balcao", []);
  const [evolucao, setEvolucao] = usePersistedState<any>("evolucao", { volume: [], taxa: [] });
  const [tabIndex, setTabIndex] = usePersistedState<number>("tabIndex", 0);

  const [page, setPage] = useState<Record<string, number>>({ caracteristicas: 0, balcao: 0 });
  const [rowsPerPage] = useState<Record<string, number>>({ caracteristicas: 8, balcao: 10 });
  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
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

  const handleSort = (column: string) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };


  function getColor(idx: number, total: number) {
    const startHue = 140; // verde-azulado
    const endHue = 200;   // azul mais puro
    const hue = startHue + ((endHue - startHue) * idx) / (total - 1);
    const saturation = 40; 
    const lightness = 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

   function formatValue(value: number) {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "MI";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
  }

  function formatValueRS(value: number) {
    if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}MI`;
    if (value >= 1_000)     return `R$ ${(value / 1_000).toFixed(1)}K`;
    return `R$ ${value.toString()}`;
  }

  function formatNumber(value: number) {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function formatNumberRS(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatPercent(value: number) {
    return `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;
  }

  return {
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
  };
}

export default useAnalytics;
