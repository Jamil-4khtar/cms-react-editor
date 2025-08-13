import React from "react";

export default function Overlay({ rect }) {
  return (
    <div style={{ pointerEvents: "none", position: "absolute", inset: 0 }}>
      {rect && (
        <div
          style={{
            position: "absolute",
            left: rect.x,
            top: rect.y,
            width: rect.width,
            height: rect.height,
            outline: "2px solid #2563eb",
            borderRadius: 6,
            boxShadow: "0 0 0 4px rgba(37,99,235,0.15)",
          }}
        />
      )}
    </div>
  );
}
