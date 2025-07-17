import React from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

export default function SideToggle({ side, onChange }) {
    return (
        <ToggleButtonGroup
            value={side}
            exclusive
            onChange={(e, value) => value && onChange(value)}
            aria-label="side"
        >
            <ToggleButton value="anverso">Anverso</ToggleButton>
            <ToggleButton value="reverso">Reverso</ToggleButton>
        </ToggleButtonGroup>
    );
}
