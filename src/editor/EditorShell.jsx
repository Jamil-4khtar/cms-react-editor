import React from "react";
import EditorCanvas from "./EditorCanvas.jsx";
import Inspector from "./Sidebar/Inspector.jsx";
import { useEditor } from "../state/EditorContext.jsx";

export default function EditorShell() {
  const { state } = useEditor();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", height: "100vh" }}>
      {/* Canvas (iframe + overlay) */}
      <div style={{ position: "relative", borderRight: "1px solid #e5e7eb" }}>
        <TopBar />
        <EditorCanvas />
      </div>

      {/* Sidebar */}
      <div style={{ padding: 12, background: "#f8fafc" }}>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          {state.saveStatus}
        </div>
        <Inspector />
      </div>
    </div>
  );
}

function TopBar() {
  const { state } = useEditor();
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 44,
      display: "flex", alignItems: "center", gap: 12, padding: "0 12px",
      background: "rgba(255,255,255,0.9)", borderBottom: "1px solid #e5e7eb", zIndex: 2
    }}>
      <strong style={{ fontSize: 14 }}>Editing: {state.slug}</strong>
      <span style={{ fontSize: 12, color: "#64748b" }}>(local draft)</span>
    </div>
  );
}
