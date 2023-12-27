// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::command;
use walkdir::{DirEntry, WalkDir};

#[derive(Serialize, Deserialize)]
struct FileList {
    files: Vec<String>,
}

#[derive(Serialize, Deserialize)]
struct ErrorResponse {
    error: String,
}

type CommandResult<T> = Result<T, ErrorResponse>;

#[command]

fn get_all_files(path: String) -> CommandResult<FileList> {
    let mut files = Vec::new();

    // Helper function to determine if an entry is a hidden directory or file
    fn is_hidden(entry: &DirEntry) -> bool {
        entry
            .file_name()
            .to_str()
            .map(|s| s.starts_with('.'))
            .unwrap_or(false)
    }

    for entry in WalkDir::new(&path)
        .into_iter()
        .filter_entry(|e| !is_hidden(e))
    {
        match entry {
            Ok(e) => {
                println!("Found: {}", e.path().display());
                if e.file_type().is_file() {
                    files.push(e.path().to_string_lossy().into_owned());
                }
            }
            Err(e) => println!("Error: {}", e),
        }
    }

    if files.is_empty() {
        println!("No files found in the given directory.");
    }

    Ok(FileList { files })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_all_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
