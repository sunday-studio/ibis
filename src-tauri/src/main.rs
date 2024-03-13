// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::Read;
use std::io::Write;
use std::path::Path;
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

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

#[command]
async fn read_file_content(path: String) -> Result<String, String> {
    let path = Path::new(&path);

    let mut file = match fs::File::open(&path) {
        Ok(file) => file,
        Err(e) => return Err(e.to_string()),
    };

    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(e) => Err(e.to_string()),
    }
}

#[command]
async fn write_to_file(path: String, content: String) -> Result<(), String> {
    let path = Path::new(&path);
    let mut file = match File::create(&path) {
        Ok(file) => file,
        Err(e) => return Err(e.to_string()),
    };

    match file.write_all(content.as_bytes()) {
        Ok(_) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[command]
async fn path_exists(path: String) -> bool {
    Path::new(&path).exists()
}

#[command]
async fn delete_file(path: String) -> Result<(), String> {
    let path = Path::new(&path);
    fs::remove_file(&path).map_err(|e| e.to_string())
}

#[command]
async fn rename_file(old_path: String, new_path: String) -> Result<(), String> {
    std::fs::rename(&old_path, &new_path).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(10.0))
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_all_files,
            read_file_content,
            write_to_file,
            path_exists,
            delete_file,
            rename_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
