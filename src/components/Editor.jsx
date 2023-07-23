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

import AutoLinkPlugin, { validateUrl } from '../plugins/AutolinkPlugin';
import ClickableLinkPlugin from '../plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import FloatingMenuPlugin from '../plugins/FloatingMenuPlugin';
import SlashCommandPickerPlugin from '../plugins/SlashCommandPicker';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
import { theme } from '../plugins/theme';
import { entriesStore } from '../store/entries';

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function onError(error) {
  console.error(error);
}

const EntryHeader = observer(() => {
  const entryStore = entriesStore;
  return (
    <input
      value={entryStore.activeEntryTitle}
      onChange={(e) => entriesStore.updateActiveEntireTitle(e.target.value)}
      className="title-input"
      placeholder="Untitled"
    />
  );
});

export const Editor = ({ id, content }) => {
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
    ],
  };

  const debouncedUpdates = useDebouncedCallback(async () => {
    // setSaveStatus('Saving...');
    entriesStore.saveContent(editorState.current.toJSON());
    // setTimeout(() => {
    //   setSaveStatus('Saved');
    // }, 300);
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
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(state) => {
          editorState.current = state;
          debouncedUpdates();
        }}
      />

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
    </LexicalComposer>
  );
};
