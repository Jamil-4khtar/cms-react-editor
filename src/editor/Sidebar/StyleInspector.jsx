import React, { useMemo } from "react";
import { useEditor } from "../../state/EditorContext.jsx";
import { getBlockById } from "../../core/tree.js";

export default function StyleInspector() {
  const { state, patchStyles } = useEditor();

  const selectedBlock = useMemo(() => {
    if (!state.selectedId) return null;
    return getBlockById(state.doc.root, state.selectedId);
  }, [state.doc, state.selectedId]);

  const setStyle = (key, value) => {
    if (!selectedBlock) return;
    patchStyles(selectedBlock.id, { [key]: value || undefined });
  };

  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Styles</div>

      {!selectedBlock && <div style={{ fontSize:12, color:"#64748b" }}>Select an element</div>}

      {selectedBlock && (
        <>
          <Label>Font size (px)</Label>
          <InputNumber
            value={parseInt(selectedBlock.styles?.inline?.fontSize || "")}
            onChange={(n) => setStyle("fontSize", n ? n + "px" : "")}
          />

          <Label>Color</Label>
          <InputText
            value={selectedBlock.styles?.inline?.color || ""}
            placeholder="#111827 or rgb(...)"
            onChange={(v) => setStyle("color", v)}
          />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div>
              <Label>Width (px)</Label>
              <InputNumber
                value={parseInt(selectedBlock.styles?.inline?.width || "")}
                onChange={(n) => setStyle("width", n ? n + "px" : "")}
              />
            </div>
            <div>
              <Label>Height (px)</Label>
              <InputNumber
                value={parseInt(selectedBlock.styles?.inline?.height || "")}
                onChange={(n) => setStyle("height", n ? n + "px" : "")}
              />
            </div>
          </div>

          <Label>Padding (CSS)</Label>
          <InputText
            value={selectedBlock.styles?.inline?.padding || ""}
            placeholder="e.g. 12px 16px"
            onChange={(v) => setStyle("padding", v)}
          />
        </>
      )}
    </div>
  );
}

function Label({ children }) {
  return <label style={{ display:"block", fontSize:12, color:"#475569", marginTop:8 }}>{children}</label>;
}
function InputNumber({ value, onChange }) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : ""}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value, 10) : "")}
      style={{ width:"100%", marginTop:6, padding:8, border:"1px solid #e2e8f0", borderRadius:6 }}
    />
  );
}
function InputText({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width:"100%", marginTop:6, padding:8, border:"1px solid #e2e8f0", borderRadius:6 }}
    />
  );
}
