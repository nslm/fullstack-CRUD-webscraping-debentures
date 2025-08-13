import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { API_BASE, AUTOMATIONS } from "../constants/AutomationsConstants";
import { LogEntry, DateFilterType } from "../types/AutomationsTypes";
import { parseISO } from "date-fns";

export function useAutomations() {
  const [statuses, setStatuses] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [openLogs, setOpenLogs] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState<Record<string, number>>({});
  const [rowsPerPage, setRowsPerPage] = useState<Record<string, number>>({ caracteristicas: 5, balcao: 5 });
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>({ startDate: "", finalDate: "" });
  const [lastWorkday, setLastWorkday] = useState<string>("");  
  const [markedDates, setMarkedDates] = useState<string[]>([]);  
  const [notWorkdayList, setNotWorkdayList] = useState<string[]>([]);
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});
  const [dateFilterLoading, setDateFilterLoading] = useState(true);

  const intervalsRef = useRef<Record<string, number>>({});

  const toggleLogs = (id: string) => {
    setOpenLogs(prev => {
      const isCurrentlyOpen = !!prev[id];
      if (id === "balcao") {
        if (isCurrentlyOpen) {
          return { ...prev, [id]: false };
        } else {
          setOpenDateFilter(false);
          return { ...prev, [id]: true };
        }
      } else {
        return { ...prev, [id]: !isCurrentlyOpen };
      }
    });
  };

  const toggleDateFilter = () => {
    setOpenDateFilter(prev => !prev);
    if (!openDateFilter) {
      setOpenLogs(prev => ({ ...prev, balcao: false }));
    }
  };

  const startPolling = (id: string, storedRunId: string) => {
    if (intervalsRef.current[id]) clearInterval(intervalsRef.current[id]);

    const finalStatuses = [
      "Dados atualizados com sucesso!",
      "Erro na coleta.",
      "Erro ao tentar salvar na base."
    ];

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/coleta/${id}/status/${storedRunId}/`);
        const data = await res.json();
        setStatuses(prev => ({ ...prev, [id]: data.status || "Status não disponível" }));

        if (finalStatuses.includes(data.status)) {
          clearInterval(intervalsRef.current[id]);
          delete intervalsRef.current[id];
          setLoading(prev => ({ ...prev, [id]: false }));
          fetchLogs(id);
          if (id === "balcao") fetchBalcaoDates();
        }

      } catch {
        setStatuses(prev => ({ ...prev, [id]: "Status não disponível" }));
      }
    };

    fetchStatus();
    intervalsRef.current[id] = window.setInterval(fetchStatus, 500);
  };

  const startAutomation = async (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    const runId = uuidv4();
    try {
      let options: any = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ run_id: runId }) };
      if (id === "balcao") {
        options.body = JSON.stringify({ run_id: runId, Start_Date: dateFilter.startDate, Final_Date: dateFilter.finalDate });
      }

      startPolling(id, runId);
      const res = await fetch(`${API_BASE}/api/coleta/${id}/start/`, options);
      const json = await res.json();
      if (!res.ok) {
        setStatuses(prev => ({ ...prev, [id]: "Status não disponível" }));
        setLoading(prev => ({ ...prev, [id]: false }));
        return;
      }

      fetchLogs(id);
      if (id === "balcao") fetchBalcaoDates();
    } catch {
      setStatuses(prev => ({ ...prev, [id]: "Status não disponível" }));
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const fetchLogs = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/coleta/${id}/logs/`);
      if (!res.ok) throw new Error("Erro ao carregar logs");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.logs ?? [];
      setLogs(prev => ({ ...prev, [id]: arr }));
    } catch (error) {
      console.error("Falha ao buscar logs:", error);
    }
  };

  const fetchBalcaoDates = async () => {
    try {
      const [lastWorkdayRes, datesRes, notWorkdayRes] = await Promise.all([
        fetch(`${API_BASE}/api/coleta/balcao/lastworkday/`),
        fetch(`${API_BASE}/api/coleta/balcao/dates/`),
        fetch(`${API_BASE}/api/coleta/balcao/notworkdaylist/`),
      ]);
      const lastWorkdayData = await lastWorkdayRes.json();
      const datesData = await datesRes.json();
      const notWorkdayData = await notWorkdayRes.json();

      setLastWorkday(lastWorkdayData.last_workday);
      setMarkedDates(datesData.dates);
      setNotWorkdayList(notWorkdayData.not_workday_list);
      setDateFilter(prev => ({
        ...prev,
        startDate: prev.startDate || lastWorkdayData.last_workday,
        finalDate: prev.finalDate || lastWorkdayData.last_workday
      }));
      setDateFilterLoading(false);
    } catch (error) {
      console.error("Falha ao buscar datas do balcao:", error);
    }
  };

  useEffect(() => {
    fetchBalcaoDates();
    AUTOMATIONS.forEach(({ id }) => fetchLogs(id));

    return () => {
      Object.values(intervalsRef.current).forEach((i) => window.clearInterval(i));
      intervalsRef.current = {};
    };
  }, []);

  const handleChangePage = (id: string, event: unknown, newPage: number) => {
    setPage(prev => ({ ...prev, [id]: newPage }));
  };

  const handleChangeRowsPerPage = (id: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(prev => ({ ...prev, [id]: value }));
    setPage(prev => ({ ...prev, [id]: 0 }));
  };

  const parseDate = (iso: string) => {
    const d = parseISO(iso);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  return {
    statuses, loading, openLogs, page, rowsPerPage, openDateFilter, dateFilter, setDateFilter,
    lastWorkday, markedDates, notWorkdayList, logs, dateFilterLoading,
    toggleLogs, toggleDateFilter, startAutomation,
    handleChangePage, handleChangeRowsPerPage, parseDate
  };
}
