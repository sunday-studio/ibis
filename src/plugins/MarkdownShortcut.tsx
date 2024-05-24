import { CHECK_LIST, ElementTransformer, TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin as LexicalMDShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { $createParagraphNode, ParagraphNode } from 'lexical';

import { PAGE_BREAK_NODE_TRANSFORMER } from './PageBreakPlugin/nodes/PageBreakNode';

export const LINE_BREAK_FIX: ElementTransformer = {
  dependencies: [ParagraphNode],
  export: () => {
    return null;
  },
  regExp: /^$/,
  replace: (textNode, nodes, _, isImport) => {
    if (isImport && nodes.length === 1) {
      nodes[0].replace($createParagraphNode());
    }
  },
  type: 'element',
};

export const CUSTOM_TRANSFORMERS = [
  CHECK_LIST,
  ...TRANSFORMERS,
  PAGE_BREAK_NODE_TRANSFORMER,
  LINE_BREAK_FIX,
];

export const MarkdownShortcutPlugin = () => {
  return <LexicalMDShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />;
};
