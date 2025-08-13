import React from "react";
import EditorShell from "./editor/EditorShell";
import { EditorProvider } from "./state/EditorContext";
import { loadDoc } from "./storage/local";

function App() {
  const slug = "/demo";
  const initialDoc = loadDoc(slug);

  return (
    <EditorProvider slug={slug} initialDoc={initialDoc}>
      <EditorShell />
    </EditorProvider>
  );
}

export default App;
