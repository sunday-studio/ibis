import { useEffect, useRef } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $createListItemNode, $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ElementTransformer,
  TRANSFORMERS,
} from '@lexical/markdown';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { $createParagraphNode, $createTextNode, $getRoot, ParagraphNode } from 'lexical';
import { useDebouncedCallback } from 'use-debounce';

import AutoLinkPlugin, { validateUrl } from '@/plugins/AutolinkPlugin';
import ClickableLinkPlugin from '@/plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from '@/plugins/CodeHighlightPlugin';
import FloatingMenuPlugin from '@/plugins/FloatingMenuPlugin';
import PageBreakPlugin from '@/plugins/PageBreakPlugin/PageBreakPlugin';
import {
  PAGE_BREAK_NODE_TRANSFORMER,
  PageBreakNode,
} from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';
import SearchDialogPlugin from '@/plugins/SearchDialogPlugin';
import SlashCommandPickerPlugin from '@/plugins/SlashCommandPicker';
import TabFocusPlugin from '@/plugins/TabFocusPlugin';
import { theme } from '@/plugins/theme';

import { EntryHeader } from './Editor.EntryHeader';

function Placeholder({ className }) {
  return <div className={className}>Write or type '/' for slash commands....</div>;
}

export const LINE_BREAK_FIX: ElementTransformer = {
  dependencies: [ParagraphNode],
  export: (node) => {
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
  ...TRANSFORMERS,
  PAGE_BREAK_NODE_TRANSFORMER,
  CHECK_LIST,
  // LINE_BREAK_FIX,
];

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function MarkdownContentPlugin({ markdown }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (markdown) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        $convertFromMarkdownString(markdown, CUSTOM_TRANSFORMERS);
      });
    }
  }, [editor, markdown]);

  return null;
}

function onError(error: any) {
  console.error(error);
}

export const EDITOR_PAGES = {
  ENTRY: 'ENTRY',
  JOURNAL: 'JOURNAL',
} as const;

interface EditorType {
  id: string;
  content: string | null;
  onChange: (state: any) => void;
  page: keyof typeof EDITOR_PAGES;
  extendTheme?: {};
  placeholderClassName?: string;
}

export const Editor = ({
  id,
  content,
  onChange,
  page,
  extendTheme,
  placeholderClassName = 'editor-placeholder',
}: EditorType) => {
  const markdownRef = useRef<string>();

  const editorConfig = {
    namespace: 'ContentEditor',
    theme: {
      ...theme,
      ...extendTheme,
    },
    onError,
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
  };

  const debouncedUpdates = useDebouncedCallback(async () => {
    // @ts-ignore
    onChange(markdownRef.current);
  }, 750);

  return (
    <LexicalComposer initialConfig={editorConfig} key={id}>
      <RichTextPlugin
        contentEditable={
          <div className="editor-wrapper">
            {page === EDITOR_PAGES.ENTRY && <EntryHeader />}
            <ContentEditable className="editor-input" />
          </div>
        }
        placeholder={<Placeholder className={placeholderClassName} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(state) => {
          state.read(() => {
            markdownRef.current = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
            // .replaceAll(
            //   /\n{2}/gm,
            //   '\n',
            // );
          });

          debouncedUpdates();
        }}
      />
      {/* @ts-ignore */}
      <ClickableLinkPlugin newTap />
      <FloatingMenuPlugin />
      <SlashCommandPickerPlugin />
      <TabFocusPlugin />
      <ListPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <HistoryPlugin />
      <AutoLinkPlugin />
      <AutoFocusPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <MarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />
      <CodeHighlightPlugin />
      <PageBreakPlugin />
      <SearchDialogPlugin />
      <MarkdownContentPlugin markdown={content} />
    </LexicalComposer>
  );
};
