import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';

import TabFocusPlugin from '../plugins/TabFocusPlugin';
import AutoLinkPlugin, { validateUrl } from '../plugins/AutolinkPlugin';
// import ToolbarPlugin from '../plugins/ToolbarPlugin';
import SlashCommandPickerPlugin from '../plugins/SlashCommandPicker';
import FloatingMenuPlugin from '../plugins/FloatingMenuPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import { theme } from '../plugins/theme';

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

export const Editor = ({ saveContent, content, onBackClick, lastEditDate }) => {
  const editorState = useRef();
  const [saveStatus, setSaveStatus] = useState('Saved');

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
    setSaveStatus('Saving...');
    // setContent(json);
    // Simulate a delay in saving.

    saveContent(editorState.current.toJSON());
    setTimeout(() => {
      setSaveStatus('Saved');
    }, 500);
  }, 750);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <div className="editor-container">
            <p className="last-edited">{saveStatus}</p>
            {/* <ToolbarPlugin /> */}
            <ContentEditable className="editor-input" />
            <div className="save-button">
              <button className="back-btn shadow-button" onClick={onBackClick}>
                Back
              </button>
              <button
                className="shadow-button"
                onClick={() => saveContent(editorState.current.toJSON())}
              >
                Save
              </button>
            </div>
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
