import { CHECK_LIST, TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin as LexicalMDShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';

import { PAGE_BREAK_NODE_TRANSFORMER } from './PageBreakPlugin/nodes/PageBreakNode';

export const CUSTOM_TRANSFORMERS = [CHECK_LIST, PAGE_BREAK_NODE_TRANSFORMER, ...TRANSFORMERS];

export const MarkdownShortcutPlugin = () => {
  return <LexicalMDShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />;
};
