import React from "react";
import { useEditor } from "../../state/EditorContext.jsx";
import StyleInspector from "./StyleInspector.jsx";
import LayerControls from "./LayerControls.jsx";

export default function Inspector() {
  const { state } = useEditor();
  const selected = state.selectedId;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
        <div style={{ fontSize: 12, color: "#64748b" }}>Selected</div>
        <div style={{ fontWeight: 600 }}>{selected || "—"}</div>
      </div>

      {selected && <LayerControls />}

      <StyleInspector />
    </div>
  );
}
