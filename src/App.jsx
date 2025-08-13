import React from "react";
import EditorShell from "./editor/EditorShell";
import { EditorProvider } from "./state/EditorContext";
import { loadDoc } from "./storage/local";

function App() {
  // const slug = "/demo";
  const slug = "/"; // later you’ll make this user-selectable

  const initialDoc = loadDoc(slug);

  return (
    <EditorProvider slug={slug} initialDoc={initialDoc}>
      <EditorShell />
    </EditorProvider>
  );
}

export default App;

/* 
Okay, Lets do one thing, lets take this wire-it-today playbook, in bite-sized lessons, its difficult for me to consume all at once, I got ADHD. THis is the next.js website I told you about: https://github.com/adminloopmethods/Azure/tree/main/website - I downloaded the website folder as a zip to work on it locally as you tell me.

Till Lesson E5, I think everything is okay. I can successfully display the next.js homepage in the editor's iframe. Clicking the Editable sub-components of Homepage, selects it (blue outline in editor). But I am having difficulty following through Lesson E6, you have suggested me to add:
  const slug = "/";
  const url = `${cfg.siteOrigin}${slug}?edit=1`;

  - in EditorCanvas which is bypassing the slug and initialDoc passed in EditorProvider from App.jsx, hence bypassing the entire state management and localStorage I think.
  So, the outcome of Lesson E6, i.e., Text and styles change live in the iframe and persist across refresh is not working.


  I think there is a slight confusion about how the doc how update, because doesnot matter what changes I would make, doc would always be saved from the initialdoc in the state. regardless of my slug update 
*/


//! todo: keep this change - till state sync of poorly updated webpages - commit it before anything
//! todo: change branch from previous commit(modular structure) and start interacting with Next.js website all over again from the start.