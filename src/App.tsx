import reactLogo from "./assets/react.svg";
import "./App.css";
import Database from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:ibis.db");

function App() {
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
