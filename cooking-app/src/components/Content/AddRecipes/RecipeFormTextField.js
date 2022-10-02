import { TextField } from "@mui/material";
import React from "react";
import { variantType } from "../../../utils/styles/muiStyles";

export const RecipeFormTextField = ({ name, label, onChange, value }) => {
  return (
    <TextField
      sx={{ width: 900 }}
      label={label} //"Title"
      multiline
      required
      inputProps={{ maxLength: 500 }}
      variant={variantType.filled}
      name={name} //"name"
      // value={value}
      onChange={(e) => {
        onChange(e);
      }}
    />
  );
};
