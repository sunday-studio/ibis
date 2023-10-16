// @ts-nocheck
import { FunctionComponent, useEffect, useRef } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { TRANSFORMERS } from '@lexical/markdown';
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
import { useDebouncedCallback } from 'use-debounce';

import AutoLinkPlugin, { validateUrl } from '../../plugins/AutolinkPlugin';
import FloatingMenuPlugin from '../../plugins/FloatingMenuPlugin';
import SlashCommandPickerPlugin from '../../plugins/SlashCommandPicker';
import { theme } from '../../plugins/theme';

function placeholder() {
  return <div className="daily-note-placeholder">Start your day right, start by writing....</div>;
}

const CustomAutoFocusPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.focus();
  }, []);

  return null;
};

function onError(error) {
  console.error(error);
}

type DailyNoteEditorProps = {
  id: string;
  content: {} | null;
  onChange: (state: any) => void;
};

export const DailyNoteEditor: FunctionComponent<DailyNoteEditorProps> = ({
  id,
  content,
  onChange,
}) => {
  const editorState = useRef();

  const initialConfig = {
    namespace: 'DailyNoteEditor',
    theme,
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
    ],
  };

  const debouncedUpdates = useDebouncedCallback(async () => {
    onChange(editorState.current.toJSON());
  }, 750);

  return (
    <LexicalComposer initialConfig={initialConfig} key={id}>
      <RichTextPlugin
        contentEditable={
          <div className="daily-editor-wrapper">
            <ContentEditable className="daily-editor-input" />
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={placeholder}
      />
      <OnChangePlugin
        onChange={(state) => {
          editorState.current = state;
          debouncedUpdates();
        }}
      />
      <CustomAutoFocusPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <TabIndentationPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <AutoLinkPlugin />
      <SlashCommandPickerPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <FloatingMenuPlugin />
      <HistoryPlugin />
    </LexicalComposer>
  );
};
