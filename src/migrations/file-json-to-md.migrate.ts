import { TauriEvent, listen } from '@tauri-apps/api/event';
import { Body, ResponseType, fetch } from '@tauri-apps/api/http';
import { Command } from '@tauri-apps/api/shell';
import { invoke } from '@tauri-apps/api/tauri';
import * as gm from 'gray-matter';

import { PageBreakNode } from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';

import { addVersionToFileSystem } from './add-version.migrate';

// const cmd = Command.sidecar('binaries/ibis-server');

// cmd.spawn().then((child) => {
//   console.log('spawn =>', child);

//   /**
//    * Killing server process when window is closed. Probably won't
//    * work for multi window application
//    */
//   listen(TauriEvent.WINDOW_DESTROYED, function () {
//     child.kill();
//   });
// });

const createFrontMatterData = (type: 'dailyNotes' | 'entries', content: any) => {
  if (type === 'dailyNotes') {
    return `---
id: ${content?.id}
date: ${content?.date}
---
    `;
  }

  if (type === 'entries') {
    return `---
id: ${content?.id}
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

export const migrateJSONTOMarkdown = async ({ data }) => {
  console.log('about to run this => migrateJSONTOMarkdown');

  // const command = Command.sidecar('binaries/ibis-server');
  // command.spawn().then((child) => {
  //   listen(TauriEvent.WINDOW_DESTROYED, function () {
  //     child.kill();
  //   });
  // });

  const getContent = (item) => {
    if (item.type === 'entries') {
      return item?.fileContent?.content;
    }
    if (item.type === 'dailyNotes') {
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

    const url = item.url.replace('json', 'md');

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

  return await Promise.all(updatedData);
};
