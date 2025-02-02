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

      <div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={getEntries}>
          Load Db
        </button>
      </div>
    </main>
  );
}

export default App;
