// @ts-nocheck
import { writeTextFile } from '@tauri-apps/api/fs';
import { nanoid } from 'nanoid';

import { generateEntryPath } from '@/lib/data-engine/syncing-helpers';

export const seedDefaultEntries = async (name: string) => {
  const welcomeTimestamp = new Date();

  const [_, s, welcomeFilename] = generateEntryPath(welcomeTimestamp.toISOString(), name);

  const welcomeMarkdown = `---
id: ${nanoid()}
createdAt: ${welcomeTimestamp.toISOString()}
updatedAt: ${welcomeTimestamp.toISOString()}
tags: ''
title: 'Intro to Markdown'
---

# Markdown: A Beginner's Guide

Markdown is a lightweight markup language with plain-text formatting syntax. It allows you to format text using simple symbols and conventions, making it easy to read and write.

## Why Markdown?

- **Simplicity**: Markdown syntax is straightforward and easy to learn.
- **Versatility**: Markdown supports various formatting options for creating rich text documents.
- **Portability**: Markdown documents can be easily converted to HTML, PDF, and other formats.

## Basic Syntax

### Headings

# Heading 1
## Heading 2
### Heading 3

### Emphasis

*Italic* or _Italic_
**Bold** or __Bold__

### Lists
#### Unordered List

- Item 1
- Item 2
- Item 3

#### Ordered List

1. First item
2. Second item
3. Third item

### Links

[Link Text](https://www.example.com)

### Blockquotes

> This is a blockquote.
`;

  await writeTextFile(welcomeFilename, welcomeMarkdown);
};

export const seedPinnedEntry = async (name: string) => {
  const timestamp = new Date();

  const id = `${nanoid()}`;
  const [_, s, filename] = generateEntryPath(timestamp.toISOString(), name);

  const markdown = `---
id: ${id}
createdAt: ${timestamp.toISOString()}
updatedAt: ${timestamp.toISOString()}
tags: ''
title: 'What is Ibis'
---


## What exactly is Ibis? 

Ibis a local-first writing tool. All your data is in markdown stored on your machine. Nothing goes out to anywhere. Total privacy. 


  `;

  try {
    await writeTextFile(filename, markdown);
  } catch (error) {
    console.error('mmore error', error);
  }

  return id;
};
