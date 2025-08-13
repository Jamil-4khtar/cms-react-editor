import React, { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay.jsx";
import { useEditor } from "../state/EditorContext.jsx";
import { MSG } from "../core/protocol.js";

export default function EditorCanvas() {
  const { state, select, patchText } = useEditor();
  const iframeRef = useRef(null);
  const [rect, setRect] = useState(null);

  // messages from preview → parent
  useEffect(() => {
    function onMessage(e) {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === MSG.READY) {
        post({ type: MSG.HYDRATE, doc: state.doc });
      }
      if (msg.type === MSG.CLICKED) {
        select(msg.id);
        requestRect(msg.id);
      }
      if (msg.type === MSG.RECT) {
        if (msg.id === state.selectedId) setRect(msg.rect);
      }
      if (msg.type === MSG.LAYOUT_CHANGED) {
        if (state.selectedId) requestRect(state.selectedId);
      }
      if (msg.type === MSG.INLINE_EDIT_COMMIT) {
        patchText(msg.id, msg.text);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [state.selectedId, state.doc]);

  // keep preview synced when doc changes
  useEffect(() => {
    post({ type: MSG.HYDRATE, doc: state.doc });
    if (state.selectedId) requestRect(state.selectedId);
  }, [state.doc]);

  function post(message) {
    const w = iframeRef.current?.contentWindow;
    if (w) w.postMessage(message, "*");
  }
  function requestRect(id) {
    post({ type: MSG.GET_RECT, id });
  }

  return (
    <div style={{ position: "absolute", inset: 0, top: 44 /* under topbar */ }}>
      <iframe
        ref={iframeRef}
        title="preview"
        src="/preview.html"
        sandbox="allow-scripts allow-same-origin"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        onLoad={() => post({ type: MSG.HYDRATE, doc: state.doc })}
      />
      <Overlay rect={rect} />
    </div>
  );
}
