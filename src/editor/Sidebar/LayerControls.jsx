import React from "react";
import { useEditor } from "../../state/EditorContext.jsx";
import { findParentAndIndex } from "../../core/tree.js";

export default function LayerControls() {
  const { state, moveSelected } = useEditor();
  const info = findParentAndIndex(state.doc.root, state.selectedId);
  const atTop = info && info.index === 0;
  const atBottom = info && info.parent?.children && info.index === info.parent.children.length - 1;

  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:12 }}>
      <div style={{ fontWeight:600, marginBottom:8 }}>Layer controls</div>
      <div style={{ display:"flex", gap:8 }}>
        <button
          onClick={() => moveSelected("up")}
          disabled={atTop}
          style={{ padding:"6px 10px", border:"1px solid #cbd5e1", borderRadius:6, background:"#fff" }}
        >↑ Up</button>
        <button
          onClick={() => moveSelected("down")}
          disabled={atBottom}
          style={{ padding:"6px 10px", border:"1px solid #cbd5e1", borderRadius:6, background:"#fff" }}
        >↓ Down</button>
      </div>
      <div style={{ fontSize:12, color:"#64748b", marginTop:8 }}>
        Sibling {info ? info.index + 1 : "—"} of {info?.parent?.children?.length ?? "—"}
      </div>
    </div>
  );
}
