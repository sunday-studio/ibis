// TODO: clean this file later; too much weird stuff going on here
import { Body, ResponseType, fetch } from '@tauri-apps/api/http';
import { Command } from '@tauri-apps/api/shell';
import { invoke } from '@tauri-apps/api/tauri';
import gm from 'gray-matter';

import { MigrationReturnType } from '.';

// TODO: move this into a migration util file
export function getNewId(oldId: string) {
  const datePattern = /^[0-2]\d:[0-5]\d:[0-5]\d GMT[+-]\d{4} \(.+\)-/;

  if (typeof oldId === 'string' && datePattern.test(oldId)) {
    return oldId?.replace(datePattern, '')?.trim();
  } else {
    return oldId?.trim();
  }
}

const createFrontMatterData = (type: 'journalNotes' | 'entries', content: any) => {
  if (type === 'journalNotes') {
    return `---
id: ${getNewId(content?.id)}
date: ${content?.date}
---
    `;
  }

  if (type === 'entries') {
    return `---
id: ${getNewId(content?.id)}
createdAt: ${content?.createdAt}
updatedAt: ${content?.updatedAt ?? content?.createdAt ?? ''}
tags: ${content?.tags || []}
title: ${content?.title || 'Untitled'}
---
  `;
  }
};

async function convertLexicalJSONToMarkdown(content: string) {
  try {
    const response = await fetch<{ content: any }>('http://localhost:3323/json', {
      method: 'POST',
      timeout: 30,
      body: Body.text(content),
      responseType: ResponseType.JSON,
    });

    if (response.status === 500) {
      return '';
    }

    return response?.data?.content;
  } catch (error) {
    console.log('convertLexicalJSONToMarkdown =>', error);
  }
}

export const migrateJSONTOMarkdown = async ({ data }): Promise<MigrationReturnType> => {
  const getContent = (item) => {
    if (item.type === 'entries') {
      return item?.fileContent?.content;
    }
    if (item.type === 'journalNotes') {
      return item?.fileContent?.noteContent;
    }
  };

  const updatedData = data.map(async (item) => {
    if (item.type === 'index.json' || item.type === 'tags.json') {
      return item;
    }

    const contentString = getContent(item);
    const frontmatter = createFrontMatterData(item.type, item.fileContent);

    const content =
      contentString?.length === 0 || contentString === null
        ? ''
        : (await convertLexicalJSONToMarkdown(contentString)) ?? '';

    const id = getNewId(item?.fileContent.id);

    const url = `${item.url.split('.')[0]}.${id}.md`;

    console.log('url =>', url);

    const data = `${frontmatter}
${content}
        `;

    try {
      await invoke('write_to_file', {
        path: url,
        content: data,
      });
    } catch (error) {
      console.error('error >', error);
    }

    await invoke('delete_file', { path: item.url });

    const markdown = gm(data);

    return {
      type: item.type,
      url,
      fileContent: {
        markdown: markdown?.content,
        data: markdown?.data,
      },
    };
  });

  return {
    data: await Promise.all(updatedData),
  };
};
