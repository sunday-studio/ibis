import { useEffect, useRef, useState } from 'react';

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
import { useClickAway } from '@uidotdev/usehooks';
import { formatDistance } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useDebouncedCallback } from 'use-debounce';

import { formatDateString } from '../lib/utils';
import AutoLinkPlugin, { validateUrl } from '../plugins/AutolinkPlugin';
import ClickableLinkPlugin from '../plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from '../plugins/CodeHighlightPlugin';
import FloatingMenuPlugin from '../plugins/FloatingMenuPlugin';
import SlashCommandPickerPlugin from '../plugins/SlashCommandPicker';
import TabFocusPlugin from '../plugins/TabFocusPlugin';
import { theme } from '../plugins/theme';
import { entriesStore } from '../store/entries';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

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

const TagEditor = observer(() => {
  const entryStore = entriesStore;
  const { activeEntry } = entryStore;

  const [showInput, setShowInput] = useState(false);
  const [tags, setTags] = useState(activeEntry?.tags ?? '');

  const inputRef = useClickAway(() => {
    handleOnBlur();
  });

  useEffect(() => {
    if (tags.length <= 0) {
      setShowInput(true);
    }
  }, [tags]);

  const handleOnBlur = () => {
    setShowInput(false);
  };

  const tagsToRender = tags.replace(/\s/g, '').split(',');

  const showTags = !showInput && tags.length > 0;

  return (
    <div className="value tags">
      {showTags ? (
        <div style={{ display: 'flex', gap: 5 }} onClick={() => setShowInput(true)}>
          {tagsToRender.map((o, i) => (
            <p key={i}>#{o}</p>
          ))}
        </div>
      ) : null}

      {showInput && (
        <input
          type="text"
          value={tags}
          onBlur={handleOnBlur}
          ref={inputRef}
          className="tag-input"
          onChange={(e) => {
            setTags(e.target.value);
            entriesStore.updateActiveEntryTags(e.target.value);
          }}
          placeholder="add types with comma separated..."
        />
      )}
    </div>
  );
});

const EntryHeader = observer(() => {
  const entryStore = entriesStore;

  const { activeEntry } = entryStore;

  return (
    <div className="entry-header">
      <div className="row">
        <div className="label">
          <p>Title:</p>
        </div>
        <div className="value">
          <input
            value={entryStore.activeEntryTitle}
            onChange={(e) => entriesStore.updateActiveEntireTitle(e.target.value)}
            className="title-input"
            placeholder="Untitled"
          />
        </div>
      </div>

      <div className="row">
        <div className="label">
          <p>Tags:</p>
        </div>
        <TagEditor />
      </div>

      <div className="row">
        <div className="label">
          <p>Date created:</p>
        </div>
        <div className="value">
          <p>{formatDateString(new Date(activeEntry.createdAt), 'dd-MM-y')}</p>
        </div>
      </div>

      {activeEntry.updatedAt && (
        <div className="row">
          <div className="label">
            <p>Last edited:</p>
          </div>
          <div className="value">
            {/* <p>{formatDateString(new Date(activeEntry.updatedAt), 'dd-MM-y ')}</p> */}
            <p>
              {formatDistance(new Date(activeEntry.updatedAt), new Date(), { addSuffix: true })}
            </p>
          </div>
        </div>
      )}

      <div className="hr-divider"></div>
    </div>
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
