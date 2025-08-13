import React, { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay.jsx";
import { useEditor } from "../state/EditorContext.jsx";
import { MSG } from "../core/protocol.js";
import cfg from "../editor.config.js";
import { mergeDocWithDomSnapshot } from "../core/tree.js";

export default function EditorCanvas() {
  const { state, select, patchText, setDoc } = useEditor();
  const iframeRef = useRef(null);
  const [rect, setRect] = useState(null);

  const slug = "/"; // make this selectable later
  const url  = `${cfg.siteOrigin}${slug}?edit=1`;

  useEffect(() => {
    function onMessage(e) {
      const msg = e.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === MSG.READY) {
        // 1) hydrate dev doc so Editable can render from it
        post({ type: MSG.HYDRATE, doc: state.doc }, cfg.siteOrigin);
        // 2) ask the page what IDs/types it currently has
        post({ type: MSG.LIST_BLOCKS }, cfg.siteOrigin);
      }

      if (msg.type === MSG.BLOCKS) {
        // Merge doc with real DOM IDs in the same order
        const merged = mergeDocWithDomSnapshot(state.doc, msg.blocks || []);
        setDoc(merged);
        // Re-hydrate page with merged doc so ids now match
        post({ type: MSG.HYDRATE, doc: merged }, cfg.siteOrigin);
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

  useEffect(() => {
    // keep preview synced when doc changes
    post({ type: MSG.HYDRATE, doc: state.doc }, cfg.siteOrigin);
    if (state.selectedId) requestRect(state.selectedId);
  }, [state.doc]);

  function post(message, targetOrigin) {
    const w = iframeRef.current?.contentWindow;
    if (w) w.postMessage(message, targetOrigin || "*");
  }
  function requestRect(id) {
    post({ type: MSG.GET_RECT, id }, cfg.siteOrigin);
  }

  return (
    <div style={{ position: "absolute", inset: 0, top: 44 }}>
      <iframe
        ref={iframeRef}
        title="preview"
        src={url}
        sandbox="allow-scripts allow-same-origin"
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        onLoad={() => {
          // Fire initial hydrate in case READY arrived before onLoad (race‑safe)
          post({ type: MSG.HYDRATE, doc: state.doc }, cfg.siteOrigin);
          post({ type: MSG.LIST_BLOCKS }, cfg.siteOrigin);
        }}
      />
      <Overlay rect={rect} />
    </div>
  );
}
