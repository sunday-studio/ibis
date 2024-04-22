import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { createHeadlessEditor } from '@lexical/headless';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

import { PageBreakNode } from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';

// const { createHeadlessEditor } = require('@lexical/headless');
// const { $convertToMarkdownString, TRANSFORMERS } = require('@lexical/markdown');
//
//
// CONST

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

async function convertLexicalJSONToMarkdown(content: string, item) {
  if (!content) return null;
  if (JSON.parse(content)?.root?.children?.length === 0) return false;

  const editor = createHeadlessEditor({
    nodes: [
      // HeadingNode,
      // ListNode,
      // ListItemNode,
      // QuoteNode,
      // CodeNode,
      // CodeHighlightNode,
      // TableNode,
      // TableCellNode,
      // TableRowNode,
      // AutoLinkNode,
      // LinkNode,
      // PageBreakNode,
    ],
    onError: () => {},
  });

  // let markdown: string;

  const editorState = editor.parseEditorState(content);

  editor.setEditorState(editorState);

  // editor.setEditorState(editor.parseEditorState(editorState));

  // if (editorState.isEmpty()) return false;

  // editor.setEditorState(editor.parseEditorState(editorState));

  // editor.update(() => {
  //   markdown = $convertToMarkdownString(TRANSFORMERS);
  // });

  // console.log('markdown ->', markdown);

  // return markdown;
}

export const migrateJSONTOMarkdown = ({ updatedVersion, data, indexFile }) => {
  const updatedData = data?.filter((file) => file.type === 'entries' || file.type === 'dailyNotes');

  const getContent = (item) => {
    if (item.type === 'entries') {
      return item?.content?.content;
    }

    if (item.type === 'dailyNotes') {
      return item?.content?.noteContent ?? '';
    }
  };

  for (let i = 0; i < updatedData?.length; i++) {
    const item = updatedData[i];

    const contentString = getContent(item);

    // console.log({ contentString, item });

    // console.log({ content: item?.content?.content, type: item?.type });

    const frontmatter = createFrontMatterData(item.type, item.content);
    const content = convertLexicalJSONToMarkdown(contentString, item);
  }

  // console.log('migration: migrating content from json to markdown');
};
