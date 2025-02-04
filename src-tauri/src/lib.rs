// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
                CREATE TABLE IF NOT EXISTS entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT,
                    isPinned BOOLEAN DEFAULT FALSE,
                    isDuplicate BOOLEAN DEFAULT FALSE,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    tagsId TEXT
                );

                CREATE TABLE IF NOT EXISTS archived_entries (
                    entry_id INTEGER PRIMARY KEY,
                    archivedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS folders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    parent_id INTEGER DEFAULT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS folder_contents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    folder_id INTEGER NOT NULL,
                    entry_id INTEGER NULL,
                    subfolder_id INTEGER NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
                    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
                    FOREIGN KEY (subfolder_id) REFERENCES folders(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS bin (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entry_id INTEGER NULL,
                    folder_id INTEGER NULL,
                    deletedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    restoredAt DATETIME NULL,
                    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
                    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
                );
            ",
        kind: MigrationKind::Up,
    }, 
    Migration {
        version: 2,
        description: "add_icon_column_to_entries",
        sql: "
            ALTER TABLE entries ADD COLUMN icon TEXT DEFAULT NULL;
        ",
        kind: MigrationKind::Up,
    },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:ibis.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
