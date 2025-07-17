import React from "react";
import { TextField, Stack } from "@mui/material";

export default function DateRangeFilter({ startDate, endDate, onChange }) {
    return (
        <Stack direction="row" spacing={2}>
            <TextField
                label="Fecha inicio"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                onChange={e => onChange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
            />
            <TextField
                label="Fecha fin"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                onChange={e => onChange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
            />
        </Stack>
    );
}
