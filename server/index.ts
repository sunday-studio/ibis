import { Hono } from 'hono';
import { cors } from 'hono/cors';

const { createHeadlessEditor } = require('@lexical/headless');
const { $convertToMarkdownString, TRANSFORMERS, CHECK_LIST } = require('@lexical/markdown');
const { CodeHighlightNode, CodeNode } = require('@lexical/code');
const { AutoLinkNode, LinkNode } = require('@lexical/link');
const { ListItemNode, ListNode } = require('@lexical/list');
const { HeadingNode, QuoteNode } = require('@lexical/rich-text');
const { TableCellNode, TableNode, TableRowNode } = require('@lexical/table');
const {
  $applyNodeReplacement,
  $createParagraphNode,
  $createTextNode,
  LexicalNode,
  ElementNode,
} = require('lexical');
const Prism = require('prismjs');

// @ts-ignore
global.window = {};
// @ts-ignore
global.window.Prism = Prism;

type SerializedPageBreakNode = {
  type: 'page-break';
  version: 1;
};

class PageBreakNode extends ElementNode {
  static getType(): string {
    return 'page-break';
  }
  constructor() {
    super();
    this.type = 'page-break';
    this.version = 1;
  }

  createDOM() {
    return null;
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode();
  }

  static importJSON(_serializedNode: SerializedPageBreakNode): typeof LexicalNode {
    return $createPageBreakNode();
  }

  serialize() {
    return { type: this.type, version: this.version };
  }

  exportJSON(): SerializedPageBreakNode {
    return {
      type: 'page-break',
      version: 1,
    };
  }
}

export function $isPageBreakNode(
  node: typeof LexicalNode | null | undefined,
): node is PageBreakNode {
  return node instanceof PageBreakNode;
}

export function $createPageBreakNode(): PageBreakNode {
  return $applyNodeReplacement(new PageBreakNode());
}

const PAGE_BREAK_NODE_TRANSFORMER: Transformer = {
  // @ts-ignore
  export: (node) => {
    if ($isPageBreakNode(node) || node.getType() === 'page-break') {
      return '---\n';
    }
  },
  regExp: /^---\s*$/,
  // @ts-ignore
  replace: (parentNode, _, match) => {
    const [allMatch] = match;
    const paragraphNode = $createParagraphNode();
    const textNode = $createTextNode(allMatch);
    paragraphNode.append(textNode);
    parentNode.replace($createPageBreakNode());
  },
  type: 'element',
  dependencies: [],
};

const app = new Hono();

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

app.post('/json', async (c) => {
  const body = await c.req.text();

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
      PageBreakNode,
    ],
    // @ts-ignore
    onError: (e) => {
      return c.json({ success: false, message: e.message, e });
    },
  });

  const state = editor.parseEditorState(JSON.parse(body));
  editor.setEditorState(state);

  editor.update(() => {
    markdown = $convertToMarkdownString(
      [CHECK_LIST, PAGE_BREAK_NODE_TRANSFORMER, ...TRANSFORMERS],
      undefined,
      true,
    );
  });

  return c.json({ success: true, content: markdown });
});

export default {
  port: 3323,
  fetch: app.fetch,
};
