import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { createHeadlessEditor } from '@lexical/headless';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { TauriEvent, listen } from '@tauri-apps/api/event';
import { Command } from '@tauri-apps/api/shell';

import { PageBreakNode } from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';

const test2 =
  '{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Landing page","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Feature set","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Release notes. ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"https://gather.do/releases/current","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"autolink","version":1,"rel":null,"target":null,"title":null,"url":"https://gather.do/releases/current"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Setup auto-updater ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Setup traffic icon","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"add pulsing anination ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"add popover info","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"when no update, show current data? ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"when update, show next update data ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Setup sentry","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":true,"value":4},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Error boundaries for entry pages ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"General boundary","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sidebar boundary ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Journal boundary ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Revamp safe loader page ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add description ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix initial app setup ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"setup better initial data","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"current day for journal","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"some default initial data entries ","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Default for folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Default tags ","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix traffic icons","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix checkbox pushing view ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Feature request dialog ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Rebuild datepicker ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":9},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Dot indicator for dates with content","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Revamp design ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":10},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix darkmode issues ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":true,"value":10},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Introduce new color set using radix colors ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Update tag selector and tags colors","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":11},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Switch content from json to markdown ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":11},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add migrator to fix all file namings. use a standard ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"migrator to add ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"folderIds","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" field to ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"Entry","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":12},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix editor text spacing & line-heights ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":12},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"For base text ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"For checklist","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":13},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sidebar redesign ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":13},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Folder support ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Renaming folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Deleting folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Moving items between folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Adding to folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"On scroll, make a cut off on the actions bottom; either by a line or some fade in shadow ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add tooltips to all icons ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add shortcut to route action ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":4},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Show shortcut","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":5}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":14},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Known bugs","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":14},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Deleting fucks up ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"index.json","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" file. ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Move entries from array to ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"Dict","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add getter to fix broken ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"entriestore.entries","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Update functions to not use loops ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":15}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

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

async function convertLexicalJSONToMarkdown() {
  // content: string, item

  try {
    const se = await fetch('http://localhost:3000/json', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    //  await command.spawn();
    console.log('se =>', se);
  } catch (error) {
    console.log('error =>', error);
  }

  // console.log('command =>', await command.execute());
}

export const migrateJSONTOMarkdown = ({ updatedVersion, data, indexFile }) => {
  const command = Command.sidecar('binaries/ibis-server');
  command.spawn().then((child) => {
    listen(TauriEvent.WINDOW_DESTROYED, function () {
      child.kill();
    });
  });

  // convertLexicalJSONToMarkdown();
  // const updatedData = data?.filter((file) => file.type === 'entries' || file.type === 'dailyNotes');
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
//     try {
//       const response = await fetch('http://localhost:3323/json', {
//         method: 'GET',
//         timeout: 30, //seconds
//         responseType: ResponseType.JSON,
//       });
//       console.log(response);
//     } catch (error) {
//       console.log('error =>', error);
//     }
//   };
