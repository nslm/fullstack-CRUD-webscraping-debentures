import React from "react";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import { DayPicker, DayPickerProps, Matcher } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isAfter, parseISO } from "date-fns";
import { DateFilterType } from "../types/AutomationsTypes";

type Props = {
  dateFilter: DateFilterType;
  setDateFilter: React.Dispatch<React.SetStateAction<DateFilterType>>;
  markedDates: string[];
  notWorkdayList: string[]; 
  lastWorkday: string; 
  loading: boolean;
  parseDate: (iso: string) => Date; 
};

export default function AutomationsDateFilter({
  dateFilter,
  setDateFilter,
  markedDates,
  notWorkdayList,
  lastWorkday,
  loading,
  parseDate,
}: Props) {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );


  const buildDayPickerProps = (
    selectedDate: string,
    field: "startDate" | "finalDate"
  ): DayPickerProps => {
    const modifiers: Record<string, Matcher | Matcher[]> = {
      marked: markedDates.map(parseDate),
      startSelected: parseDate(selectedDate),
      notWorkdayPassed: notWorkdayList.map(parseDate),
      lastWorkday: parseDate(lastWorkday),
      pastWorkdays: (date) => {
        const lw = parseDate(lastWorkday);
        const dISO = format(date, 'yyyy-MM-dd');                                    
        if (isAfter(date, lw)) return false;                                  
        if (markedDates.includes(dISO)) return false;                                    
        if (notWorkdayList.includes(dISO)) return false;                                    
        return true; 
      },
      disabledFromLastWorkdayOnwards: (date) => {
        const lw = parseDate(lastWorkday);
        return isAfter(date, lw);
      }
};

    return {
      mode: "single", 
      selected: parseDate(dateFilter[field]), 
      onSelect: (date) => { if (date) 
          setDateFilter(prev => ({ ...prev, [field]: format(date, 'yyyy-MM-dd') }));
        },
      modifiers,
      modifiersClassNames: {
        marked: "marked-day",
        startSelected: 'start-selected-day',
        notWorkdayPassed: "notworkday-day",
        lastWorkday: "lastworkday-day",
        pastWorkdays: "past-workday-day",
      },
      disabled: (date) => { const lw = parseDate(lastWorkday); return isAfter(date, lw); },
      modifiersStyles: {
          pastWorkdays: ((date: Date) => {
            if (format(date, 'yyyy-MM-dd') === dateFilter.startDate) return {};
            return { backgroundColor: "#e7e6e7ff", color: "black" };
          }) as any,

          notWorkdayPassed: ((date: Date) => {
            if (format(date, 'yyyy-MM-dd') === dateFilter.startDate) return {};
            return { backgroundColor: "#f4f5f8ff", color: "black" };
          }) as any,

          startSelected: { backgroundColor: '#0823bbff', color: 'white' },
          marked: { backgroundColor: "#1e8d22ff", color: "white" },
        },

    };
  };

  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item>
        <Grid sx={{ px: 2, mt: 2 }}>
        <Typography fontWeight="bold">Data Início {dateFilter.startDate}</Typography>
        </Grid>
        <Grid sx={{ px: 2, mt: 2 }}>
        <DayPicker {...buildDayPickerProps(dateFilter.startDate, "startDate")} />
        </Grid>
      </Grid>
      <Grid item>
        <Grid sx={{ px: 2, mt: 2 }}>
        <Typography fontWeight="bold">Data Fim {dateFilter.finalDate}</Typography>
        </Grid>
        <Grid sx={{ px: 2, mt: 2 }}>
        <DayPicker {...buildDayPickerProps(dateFilter.finalDate, "finalDate")} />
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ ml:4,  mr:4, mt:2 }}  justifyContent="space-between"  alignItems="center">
        <Grid item display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 20, height: 20, bgcolor: "#f4f5f8ff", border: "1px solid #ccc" }} />
          <Typography variant="body2">Dias não úteis</Typography>
        </Grid>
        <Grid item display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 20, height: 20, bgcolor: "#e7e6e7ff", border: "1px solid #ccc" }} />
          <Typography variant="body2">Dias úteis</Typography>
        </Grid>
        <Grid item display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 20, height: 20, bgcolor: "#1e8d22ff", border: "1px solid #ccc" }} />
          <Typography variant="body2">Datas coletadas</Typography>
        </Grid>
        <Grid item display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 20, height: 20, bgcolor: "#0823bbff", border: "1px solid #ccc" }} />
          <Typography variant="body2">Data selecionada</Typography>
        </Grid>
      </Grid>
    </Grid>
    
  );
}
