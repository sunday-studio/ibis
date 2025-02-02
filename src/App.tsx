import {useState} from "react";
import reactLogo from "./assets/react.svg";
import {invoke} from "@tauri-apps/api/core";
import "./App.css";
import Database from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:ibis.db");

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  // console.log(db);

  const entry = {
    id: 1,
    title: "Learn Tauri",
    content: "Learn Tauri",
    isPinned: false,
    isDuplicate: false,
    tagsId: null,
  };

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    // setGreetMsg(await invoke("greet", {name}));
    // const result = await db.execute(
    //   "INSERT INTO entries (title, content, isPinned, isDuplicate, createdAt, updatedAt, tagsId) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    //   [
    //     entry.title,
    //     entry.content,
    //     entry.isPinned ?? false, // Default to false if not provided
    //     entry.isDuplicate ?? false, // Default to false if not provided
    //     new Date().toISOString(), // Set createdAt timestamp
    //     new Date().toISOString(), // Set updatedAt timestamp
    //     entry.tagsId || null, // Allow null if no tags
    //   ]
    // );
    // console.log("result ===>", result);
  }

  async function getEntries() {
    const result = await db.select("SELECT * FROM entries");
    console.log("result ===>", result);
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <div>
        <button onClick={getEntries}>Load Db</button>
      </div>
    </main>
  );
}

export default App;
