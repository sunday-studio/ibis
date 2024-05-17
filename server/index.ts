import { Hono } from 'hono';
import { cors } from 'hono/cors';

const { createHeadlessEditor } = require('@lexical/headless');
const { $convertToMarkdownString, TRANSFORMERS } = require('@lexical/markdown');
const { CodeHighlightNode, CodeNode } = require('@lexical/code');
const { AutoLinkNode, LinkNode } = require('@lexical/link');
const { ListItemNode, ListNode } = require('@lexical/list');
const { HeadingNode, QuoteNode } = require('@lexical/rich-text');
const { TableCellNode, TableNode, TableRowNode } = require('@lexical/table');

const app = new Hono();

const test =
  '{"root":{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Landing page","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Feature set","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Release notes. ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"https://gather.do/releases/current","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"autolink","version":1,"rel":null,"target":null,"title":null,"url":"https://gather.do/releases/current"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Setup auto-updater ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Setup traffic icon","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"add pulsing anination ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"add popover info","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":3},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"when no update, show current data? ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"when update, show next update data ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Setup sentry","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":true,"value":4},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Error boundaries for entry pages ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"General boundary","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sidebar boundary ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Journal boundary ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Revamp safe loader page ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add description ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix initial app setup ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"setup better initial data","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"current day for journal","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"some default initial data entries ","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Default for folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Default tags ","type":"text","version":1}],"direction":"ltr","format":"","indent":3,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix traffic icons","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix checkbox pushing view ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Feature request dialog ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Rebuild datepicker ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":9},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Dot indicator for dates with content","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Revamp design ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":10},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix darkmode issues ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":true,"value":10},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Introduce new color set using radix colors ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Update tag selector and tags colors","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":11},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Switch content from json to markdown ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":11},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add migrator to fix all file namings. use a standard ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"migrator to add ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"folderIds","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" field to ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"Entry","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":12},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fix editor text spacing & line-heights ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":12},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"For base text ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"For checklist","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":13},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sidebar redesign ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":13},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Folder support ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Renaming folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Deleting folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Moving items between folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Adding to folders ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"On scroll, make a cut off on the actions bottom; either by a line or some fade in shadow ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add tooltips to all icons ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add shortcut to route action ","type":"text","version":1},{"detail":2,"format":0,"mode":"normal","style":"","text":"\\t","type":"tab","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":4},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Show shortcut","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":5}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":14},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Known bugs","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":14},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Deleting fucks up ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"index.json","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" file. ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":true,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Move entries from array to ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"Dict","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"checked":false,"value":2},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add getter to fix broken ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"entriestore.entries","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Update functions to not use loops ","type":"text","version":1}],"direction":"ltr","format":"","indent":2,"type":"listitem","version":1,"checked":false,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":15}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"check","start":1,"tag":"ul"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

app.use(
  '*',
  cors({
    origin: ['http://localhost:1420', 'tauri://localhost', 'http://localhost:3323'],
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  }),
);

app.post('/json', (c) => {
  let markdown;
  const editor = createHeadlessEditor({
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    onError: () => {},
  });

  const state = editor.parseEditorState(JSON.parse(test));

  editor.setEditorState(state);

  editor.update(() => {
    markdown = $convertToMarkdownString(TRANSFORMERS);
  });

  return c.json({ success: true, message: markdown });
});

export default {
  port: 3323,
  fetch: app.fetch,
};
