// @ts-nocheck
import { FunctionComponent, useEffect, useRef } from 'react';

import { TRANSFORMERS } from '@lexical/markdown';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { observer } from 'mobx-react-lite';
import { useDebouncedCallback } from 'use-debounce';

import { theme } from '../../plugins/theme';

function placeholder() {
  return <div className="daily-note-placeholder">Start your day right, start by writing....</div>;
}

const CustomAutoFocusPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    console.log('editor => ', editor);
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
    </LexicalComposer>
  );
};
