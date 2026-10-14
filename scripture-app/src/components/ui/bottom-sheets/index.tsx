import React from 'react';
import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import LogoutSheet, { LogoutSheetDefinition } from './logout';
import VersionSheet, { VersionSheetDefinition } from './version';
import NoteEditor, { NoteEditorDefinition } from './note-editor';
import ChapterPicker, { ChapterPickerDefinition } from './chapter-picker';

const sheets: Record<string, React.ElementType> = {
  'logout-sheet': LogoutSheet,
  'version-sheet': VersionSheet,
  'note-editor': NoteEditor,
  'chapter-picker': ChapterPicker,
};

(() => {
  Object.entries(sheets).forEach(([id, sheetComponent]) => {
    registerSheet(id, sheetComponent);
  });
})();

declare module 'react-native-actions-sheet' {
  interface Sheets {
    'logout-sheet': LogoutSheetDefinition;
    'version-sheet': VersionSheetDefinition;
    'note-editor': NoteEditorDefinition;
    'chapter-picker': ChapterPickerDefinition;
  }
}

export type { SheetDefinition };