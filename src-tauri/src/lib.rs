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
    Migration {
        version: 3,
        description: "default_pinned_to_0", 
        sql: "
            UPDATE entries SET isPinned = 0 WHERE isPinned IS NULL;
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 4,
        description: "defaul_boolean_states_to_false", 
        sql: "
            UPDATE entries SET isPinned = false WHERE isPinned IS NULL;
            UPDATE entries SET isDuplicate = false WHERE isDuplicate IS NULL;
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 5,
        description: "default_boolean_states_to_false", 
        sql: "
        UPDATE entries SET isPinned = 0 WHERE isPinned IS NULL OR isPinned = 'false' OR isPinned = 0;
        UPDATE entries SET isDuplicate = 0 WHERE isDuplicate IS NULL OR isDuplicate = 'false' OR isDuplicate = 0;
    ",
    kind: MigrationKind::Up,
    },
    Migration {
        version: 6,
        description: "add_archived_column_to_entries",
        sql: "
            ALTER TABLE entries ADD COLUMN isArchived BOOLEAN DEFAULT 0;
            DROP TABLE IF EXISTS archived_entries;
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 7,
        description: "add_user_table",
        sql: "
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                recoveryToken TEXT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 8,
        description: "add_preferences_table",
        sql: "
            CREATE TABLE IF NOT EXISTS preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                appearance TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 9,
        description: "add_isLocked_column_to_entries",
        sql: "
            ALTER TABLE entries ADD COLUMN isLocked BOOLEAN DEFAULT 0;
        ",
        kind: MigrationKind::Up,
    }, 
    Migration {
        version: 10,
        description: "change_password_to_pin",
        sql: "
            ALTER TABLE users RENAME COLUMN password TO pin;
        ",
        kind: MigrationKind::Up,
    }];

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
