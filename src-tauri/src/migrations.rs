
use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
  vec![Migration {
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
    }, 
    Migration {
        version: 11,
        description: "add_entries_history_table",
        sql: "
            CREATE TABLE IF NOT EXISTS entries_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT,
                version INTEGER NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
            );

            -- Indexes for entries history
            CREATE INDEX idx_entries_history_entry_id ON entries_history(entry_id);
            CREATE INDEX idx_entries_history_version ON entries_history(entry_id, version);
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 12,
        description: "add_performance_indexes",
        sql: "
            -- Index for searching entries by title
            -- This speeds up text searches and sorting by title
            -- Example: SELECT * FROM entries WHERE title LIKE '%search%';
            CREATE INDEX idx_entries_title ON entries(title);

            -- Index for filtering pinned entries
            -- Improves performance when getting pinned entries, which appears to be a common operation
            -- Example: SELECT * FROM entries WHERE isPinned = 1;
            CREATE INDEX idx_entries_pinned ON entries(isPinned);

            -- Index for folder name searches
            -- Speeds up folder lookups by name, useful for navigation and search
            -- Example: SELECT * FROM folders WHERE name LIKE '%search%';
            CREATE INDEX idx_folders_name ON folders(name);

            -- Index for folder hierarchy navigation
            -- Critical for efficiently retrieving subfolders of a parent folder
            -- Example: SELECT * FROM folders WHERE parent_id = ?;
            CREATE INDEX idx_folders_parent ON folders(parent_id);

            -- Index for retrieving folder contents
            -- Essential for quickly listing all items in a folder
            -- Example: SELECT * FROM folder_contents WHERE folder_id = ?;
            CREATE INDEX idx_folder_contents ON folder_contents(folder_id);

            -- Index for entry location lookup
            -- Helps quickly find which folder contains a specific entry
            -- Example: SELECT * FROM folder_contents WHERE entry_id = ?;
            CREATE INDEX idx_entry_location ON folder_contents(entry_id);

            -- Index for trash management
            -- Optimizes queries for showing recently deleted items
            -- Example: SELECT * FROM bin WHERE restoredAt IS NULL ORDER BY deletedAt DESC;
            CREATE INDEX idx_bin_deleted ON bin(deletedAt DESC) WHERE restoredAt IS NULL;

            -- Index for archived entries filtering
            -- Improves performance when showing/hiding archived entries
            -- Example: SELECT * FROM entries WHERE isArchived = 1;
            CREATE INDEX idx_entries_archived ON entries(isArchived);

            -- Index for user preferences lookup
            -- Optimizes fetching user preferences on app startup
            -- Example: SELECT * FROM preferences WHERE userId = ?;
            CREATE INDEX idx_preferences_user ON preferences(userId);
        ",
        kind: MigrationKind::Up,
    },
    Migration {
        version: 13,
        description: "remove_version_column_from_entries_history",
        sql: "
            DROP INDEX IF EXISTS idx_entries_history_version;
            ALTER TABLE entries_history DROP COLUMN version;
        ",
        kind: MigrationKind::Up,
    },
    ]
}