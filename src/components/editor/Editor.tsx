import { useEffect, useRef } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
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
import { EditorState } from 'lexical';
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

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

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
  const editorState = useRef<EditorState>();
  const markdownRef = useRef<string>();

  // console.log('editor =>', JSON.stringify(content));

  const editorConfig = {
    namespace: 'ContentEditor',
    theme: {
      ...theme,
      ...extendTheme,
    },
    onError,
    editorState: content ? JSON.stringify(content) : null,

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

    console.log('test =>', JSON.stringify(editorState?.current?.toJSON?.()));
    onChange(editorState?.current?.toJSON?.());
  }, 750);

  return (
    <LexicalComposer initialConfig={editorConfig} key={id}>
      <RichTextPlugin
        contentEditable={
          <div className="editor-wrapper">
            <button
              onClick={() => {
                console.log('markdown =>', markdownRef.current);
              }}
            >
              convert to markdown
            </button>
            {page === EDITOR_PAGES.ENTRY && <EntryHeader />}
            <ContentEditable className="editor-input" />
          </div>
        }
        placeholder={<Placeholder className={placeholderClassName} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(state) => {
          editorState.current = state;
          state.read(() => {
            markdownRef.current = $convertToMarkdownString([
              ...TRANSFORMERS,
              PAGE_BREAK_NODE_TRANSFORMER,
            ]);
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
      <MyCustomAutoFocusPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <MarkdownShortcutPlugin transformers={[...TRANSFORMERS, PAGE_BREAK_NODE_TRANSFORMER]} />
      <CodeHighlightPlugin />
      <PageBreakPlugin />
      <SearchDialogPlugin />
    </LexicalComposer>
  );
};
