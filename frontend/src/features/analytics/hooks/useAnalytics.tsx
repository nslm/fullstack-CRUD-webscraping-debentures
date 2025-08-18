import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../constants/AnalyticsConstants";


export function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const storageKey = "analytics_" + key;
  const [state, setState] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
    }
  }, [storageKey, state]);

  return [state, setState];
}

export function useAnalytics() {
  const [loading, setLoading] = useState<boolean>(false);
  const [openCollapse, setOpenCollapse] = usePersistedState<boolean>("openCollapse", true);
  const [openCollapseTables, setOpenCollapseTables] = usePersistedState<boolean>("openCollapseTables", true);
  const [openCollapseGraphPaper, setOpenCollapseGraphPaper] = usePersistedState<boolean>("openCollapseGraphPaper", true);
  const [openCollapseGraph1, setOpenCollapseGraph1] = usePersistedState<boolean>("openCollapseGraph1", true);
  const [openCollapseGraph2, setOpenCollapseGraph2] = usePersistedState<boolean>("openCollapseGraph2", true);
  const [ativos, setAtivos] = usePersistedState<string[]>("ativos", []);
  const [codigosUnicos, setCodigosUnicos] = usePersistedState<string[]>("codigosUnicos", []);
  const [ativosAutoComplete, setAtivosAutoComplete] = usePersistedState<string[]>("ativosAutoComplete", []);
  const [dataInicio, setDataInicio] = usePersistedState<string>("dataInicio", "2025-07-28");
  const [dataFim, setDataFim] = usePersistedState<string>("dataFim", "2025-08-08");
  const [caracteristicas, setCaracteristicas] = usePersistedState<any[]>("caracteristicas", []);
  const [balcao, setBalcao] = usePersistedState<any[]>("balcao", []);
  const [evolucao, setEvolucao] = usePersistedState<any>("evolucao", { volume: [], taxa: [] });
  const [tabIndex, setTabIndex] = usePersistedState<number>("tabIndex", 0);

  const [page, setPage] = usePersistedState<Record<string, number>>("page", { caracteristicas: 0, balcao: 0 });
  const [rowsPerPage] = usePersistedState<Record<string, number>>("rowsPerPage", { caracteristicas: 10, balcao: 12 });
  const [order, setOrder] = usePersistedState<"asc" | "desc">("order", "asc");
  const [orderBy, setOrderBy] = usePersistedState<string | null>("orderBy", null);

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
