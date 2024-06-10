import {
  CHECK_LIST,
  TRANSFORMERS,
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown';
import { MarkdownShortcutPlugin as LexicalMDShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';

import { PAGE_BREAK_NODE_TRANSFORMER } from './PageBreakPlugin/nodes/PageBreakNode';

export const CUSTOM_TRANSFORMERS = [
  CHECK_LIST,
  PAGE_BREAK_NODE_TRANSFORMER,
  ...TRANSFORMERS,
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export const MarkdownShortcutPlugin = () => {
  return <LexicalMDShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />;
};
