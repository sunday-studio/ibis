import { TauriEvent, listen } from '@tauri-apps/api/event';
import { ResponseType, fetch } from '@tauri-apps/api/http';
import { Command } from '@tauri-apps/api/shell';

import { PageBreakNode } from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';

const cmd = Command.sidecar('binaries/ibis-server');

cmd.spawn().then((child) => {
  console.log('spawn =>', child);

  /**
   * Killing server process when window is closed. Probably won't
   * work for multi window application
   */
  listen(TauriEvent.WINDOW_DESTROYED, function () {
    child.kill();
  });
});

const createFrontMatterData = (type: 'dailyNotes' | 'entries', content: any) => {
  if (type === 'dailyNotes') {
    return `
    ---
    id: ${content?.id}
    date: ${content?.date}
    ---
    `;
  }

  if (type === 'entries') {
    return `
  ---
  id: ${content?.id}
  createdAt:${content?.createdAt}
  updatedAt: ${content?.updatedAt}
  tags: ${content?.tags}
  title: ${content?.title}
  ---

  `;
  }
};

async function convertLexicalJSONToMarkdown(content: string) {
  try {
    const response = await fetch('http://localhost:3323/json', {
      method: 'POST',
      timeout: 30,
      responseType: ResponseType.JSON,
    });

    console.log(response);
  } catch (error) {
    console.log('error =>', error);
  }
  // console.log('command =>', await command.execute());
}

export const migrateJSONTOMarkdown = ({ updatedVersion, data, indexFile }) => {
  // const command = Command.sidecar('binaries/ibis-server');
  // command.spawn().then((child) => {
  //   listen(TauriEvent.WINDOW_DESTROYED, function () {
  //     child.kill();
  //   });
  // });
  const updatedData = data?.filter((file) => file.type === 'entries' || file.type === 'dailyNotes');

  convertLexicalJSONToMarkdown(updatedData[0]);

  // const getContent = (item) => {
  //   if (item.type === 'entries') {
  //     return item?.content?.content;
  //   }
  //   if (item.type === 'dailyNotes') {
  //     return item?.content?.noteContent ?? '';
  //   }
  // };
  // console.log('s => ', getContent(updatedData[0]));
  // for (let i = 0; i < updatedData?.length; i++) {
  //   const item = updatedData[i];
  //   const contentString = getContent(item);
  //   const frontmatter = createFrontMatterData(item.type, item.content);
  //   const content = convertLexicalJSONToMarkdown(contentString, item);
  // }
};

// import { ResponseType, fetch } from '@tauri-apps/api/http';

// const asy = async () => {
//   try {
//     const response = await fetch('http://localhost:3323/json', {
//       method: 'GET',
//       timeout: 30, //seconds
//       responseType: ResponseType.JSON,
//     });
//     console.log(response);
//   } catch (error) {
//     console.log('error =>', error);
//   }
// };
