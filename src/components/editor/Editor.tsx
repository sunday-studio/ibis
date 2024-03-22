import { useEffect, useRef } from 'react';

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
import { observer } from 'mobx-react-lite';
import { useDebouncedCallback } from 'use-debounce';

import AutoLinkPlugin, { validateUrl } from '@/plugins/AutolinkPlugin';
import ClickableLinkPlugin from '@/plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from '@/plugins/CodeHighlightPlugin';
import FloatingMenuPlugin from '@/plugins/FloatingMenuPlugin';
import PageBreakPlugin from '@/plugins/PageBreakPlugin/PageBreakPlugin';
import { PageBreakNode } from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';
import SlashCommandPickerPlugin from '@/plugins/SlashCommandPicker';
import TabFocusPlugin from '@/plugins/TabFocusPlugin';
import { theme } from '@/plugins/theme';
import { entriesStore } from '@/store/entries';

import { EntryTitle } from './Editor.EntryTitle';
import { TagEditor } from './Editor.TagEditor';

function Placeholder() {
  return <div className="editor-placeholder">Write or type '/' for slash commands....</div>;
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

const EntryHeader = observer(() => {
  return (
    <div className="entry-header">
      <EntryTitle />
      <div className="tags">
        <TagEditor />
      </div>
    </div>
  );
});

export const Editor = ({ id, content }: { id: string; content: string }) => {
  const editorState = useRef();

  const initialConfig = {
    namespace: 'ContentEditor',
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
      PageBreakNode,
    ],
  };

  const debouncedUpdates = useDebouncedCallback(async () => {
    // @ts-ignore
    entriesStore.saveContent(editorState.current.toJSON());
  }, 750);

  return (
    <LexicalComposer initialConfig={initialConfig} key={id}>
      <RichTextPlugin
        contentEditable={
          <div className="editor-wrapper">
            <EntryHeader />
            <ContentEditable className="editor-input" />
          </div>
        }
        placeholder={Placeholder}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(state) => {
          // @ts-ignore
          editorState.current = state;
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
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <CodeHighlightPlugin />
      <PageBreakPlugin />
    </LexicalComposer>
  );
};
