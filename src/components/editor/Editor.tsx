// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react';

import { tagsState } from '@/store/tags-state';
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
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useDebouncedCallback } from 'use-debounce';
import { useOnClickOutside } from 'usehooks-ts';

import AutoLinkPlugin, { validateUrl } from '../../plugins/AutolinkPlugin';
import ClickableLinkPlugin from '../../plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from '../../plugins/CodeHighlightPlugin';
import FloatingMenuPlugin from '../../plugins/FloatingMenuPlugin';
import SlashCommandPickerPlugin from '../../plugins/SlashCommandPicker';
import TabFocusPlugin from '../../plugins/TabFocusPlugin';
import { theme } from '../../plugins/theme';
import { entriesStore } from '../../store/entries';
import { TagSelector } from '../tag-selector/TagSelector';

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

const EntryTitle = observer(() => {
  const entryStore = entriesStore;
  const { activeEntry } = entryStore;

  const [inputValue, setInputValue] = useState(activeEntry.title);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    entryStore.updateActiveEntireTitle(value);
  };

  return (
    <div className="entry-input">
      <input type="text" onChange={handleInputChange} value={inputValue} />
    </div>
  );
});

const TagEditor = observer(() => {
  const entryStore = entriesStore;
  const { activeEntry } = entryStore;
  const [showTags, setShowTags] = useState(true);
  const tagsRef = useRef(null);

  const tags = useMemo(() => {
    return activeEntry?.tags.map((t) => toJS(tagsState.tagsMap[t])).filter(Boolean);
  }, [activeEntry?.tags, tagsState.tagsMap]);

  const onTagSelectorBlur = () => {
    setShowTags(true);
  };

  const hasTags = tags.length > 0 && showTags;

  useOnClickOutside(tagsRef, onTagSelectorBlur);

  return (
    <div className="tags">
      {hasTags ? (
        <div onClick={() => setShowTags(false)} className="tags-container">
          {tags?.map((tag: any) => {
            return (
              <div key={tag.value} className="tag">
                <p>{tag.label}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <TagSelector
          onTagSelect={(selectedTags: string[]) => {
            entriesStore.updateActiveEntryTags(selectedTags);
          }}
          tags={tags}
          containerRef={tagsRef}
        />
      )}
    </div>
  );
});

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
