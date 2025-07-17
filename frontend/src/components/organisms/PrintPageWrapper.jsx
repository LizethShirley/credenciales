import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

export default function PrintPageWrapper({
    cargos,
    selectedCargo,
    setSelectedCargo,
    selectedRecinto,
    setSelectedRecinto
}) {
    return (
        <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
                <InputLabel>Cargo</InputLabel>
                <Select
                    value={selectedCargo ? selectedCargo.id : ""}
                    label="Cargo"
                    onChange={e => {
                        const cargo = cargos.find(c => c.id === e.target.value);
                        setSelectedCargo(cargo || null);
                        setSelectedRecinto(""); // Reset recinto if cargo changes
                    }}
                >
                    {cargos.map(c => (
                        <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedCargo?.nombre === "NOTARIO ELECTORAL" && (
                    <Select
                        size="small"
                        value={selectedRecinto}
                        onChange={(e) => setSelectedRecinto(e.target.value)}
                        displayEmpty
                        sx={{ width: 200, mt: 1 }}
                    >
                        <MenuItem value="" disabled>Seleccione circunscripción</MenuItem>
                        {["C-2", "C-20", "C-21", "C-22", "C-23", "C-24", "C-25", "C-26", "C-27", "C-28"].map((circun) => (
                            <MenuItem key={circun} value={circun.split("-")[1]}>{circun}</MenuItem>
                        ))}
                    </Select>
                )}
        </Box>
    );
}