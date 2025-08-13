import React, { createContext, useContext, useEffect, useReducer } from "react";
import { saveDoc } from "../storage/local.js";
import { moveSelectedUpOrDown, patchBlockStyles, patchBlockText } from "../core/tree.js";
import useDebouncedEffect from "../storage/useDebouncedEffect.js";

const EditorCtx = createContext(null);

const initialState = (slug, initialDoc) => ({
  slug,
  doc: initialDoc,
  selectedId: null,
  saveStatus: "Saved",
  dirty: false,
});

function reducer(state, action) {
  switch (action.type) {
    case "select":
      return { ...state, selectedId: action.id };
    case "setDoc":
      return { ...state, doc: action.doc, dirty: true, saveStatus: "Unsaved changes" };
    case "patchStyles":
      return {
        ...state,
        doc: patchBlockStyles(state.doc, action.id, action.stylesDelta),
        dirty: true,
        saveStatus: "Unsaved changes",
      };
    case "patchText":
      return {
        ...state,
        doc: patchBlockText(state.doc, action.id, action.text),
        dirty: true,
        saveStatus: "Unsaved changes",
      };
    case "moveSelected":
      return {
        ...state,
        doc: moveSelectedUpOrDown(state.doc, state.selectedId, action.direction),
        dirty: true,
        saveStatus: "Unsaved changes",
      };
    case "saved":
      return { ...state, dirty: false, saveStatus: `Saved` };
    default:
      return state;
  }
}

export function EditorProvider({ slug, initialDoc, children }) {
  const [state, dispatch] = useReducer(reducer, initialState(slug, initialDoc));

  // autosave to localStorage (debounced)
  useDebouncedEffect(
    () => {
      if (state.dirty) {
        saveDoc(state.slug, state.doc);
        dispatch({ type: "saved" });
      }
    },
    600,
    [state.doc, state.dirty]
  );

  const api = {
    state,
    select: (id) => dispatch({ type: "select", id }),
    patchStyles: (id, stylesDelta) => dispatch({ type: "patchStyles", id, stylesDelta }),
    patchText: (id, text) => dispatch({ type: "patchText", id, text }),
    moveSelected: (direction) => dispatch({ type: "moveSelected", direction }),
    setDoc: (doc) => dispatch({ type: "setDoc", doc }),
  };

  return <EditorCtx.Provider value={api}>{children}</EditorCtx.Provider>;
}

export const useEditor = () => {
  const ctx = useContext(EditorCtx);
  if (!ctx) {
    throw new Error("useEditor must be used within <EditorProvider> (check imports and wrapper).");
  }
  return ctx;
};


/* 

EditorContext.jsx → Provides global state via React Context
├── selectedElement (currently selected DOM element)
├── documentTree (JSON representation of page structure)  
├── styles (CSS properties for elements)
└── Action dispatchers (selectElement, updateStyles, etc.)

*/