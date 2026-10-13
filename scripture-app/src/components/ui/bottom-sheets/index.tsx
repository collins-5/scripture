import React from "react";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";
import IndexSheet, { IndexSheetDefinition } from "./sheet";
import LogoutSheet, { LogoutSheetDefinition } from "./logout";

const sheets: Record<string, React.ElementType> = {
  "index-sheet": IndexSheet,
  "logout-sheet": LogoutSheet,
};

(() => {
  Object.entries(sheets).forEach(([id, sheetComponent]) => {
    registerSheet(id, sheetComponent);
  });
})();

declare module "react-native-actions-sheet" {
  interface Sheets {
    "index-sheet": IndexSheetDefinition;
    "logout-sheet": LogoutSheetDefinition;
  }
}

export type { SheetDefinition };