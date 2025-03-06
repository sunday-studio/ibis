import { useEffect, useMemo, useState } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import clsx from 'clsx';
import { EditorState } from 'lexical';
import { useDebouncedCallback } from 'use-debounce';

import CodeActionPlugin from './CodeActionPlugin';
import { FloatingMenuPlugin } from './FloatingMenuPlugin/FloatingMenuPlugin';
import { setNodePlaceholderFromSelection } from './NodePlaceholder/utils';
import './_editor.css';
import AutoLinkPlugin, { validateUrl } from './plugins/AutolinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import DraggableBlockPlugin from './plugins/DraggableBlock';
import { FocusModePlugin } from './plugins/FocusModePlugin';
import { MarkdownShortcutPlugin } from './plugins/MarkdownShortcut';
import PageBreakPlugin from './plugins/PageBreakPlugin/PageBreakPlugin';
import { PageBreakNode } from './plugins/PageBreakPlugin/nodes/PageBreakNode';
import { ShortcutPlugin } from './plugins/ShortcutPlugin';
import SlashCommandPickerPlugin from './plugins/SlashCommandPicker';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import { theme } from './plugins/theme';
import { getFontFamily } from './utils';

const ONCHANGE_DEBOUNCE_TIME = 750;
const ONHISTORYCHANGE_DEBOUNCE_TIME = 600000; // 10 minutes in milliseconds

const OnChangePlugin = ({ onChange }: { onChange: (editorState: EditorState) => void }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      setNodePlaceholderFromSelection(editor);
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
};

function Placeholder({ className }: { className: string }) {
  return <div className={className}>Write or type '/' for slash commands....</div>;
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
  placeholderClassName?: string;
  onHistoryChange: (state: string) => void;
}

export const Editor = ({
  id,
  content,
  onChange,
  placeholderClassName = 'editor-placeholder',
  onHistoryChange,
}: EditorType) => {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const CustomContent = useMemo(() => {
    return (
      <div className="editor-inner" ref={onRef}>
        <ContentEditable className="editor-root" />
      </div>
    );
  }, []);

  const editorConfig = {
    editorState: content ?? null,
    namespace: 'ContentEditor',
    theme,
    onError,
    nodes: [
      HashtagNode,
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

  const parseEditorOnChange = (editorState: EditorState) => {
    return JSON.stringify(editorState.toJSON());
  };

  const debouncedOnChange = useDebouncedCallback(async (state: string) => {
    onChange(state);
  }, ONCHANGE_DEBOUNCE_TIME);

  const debouncedOnHistoryChange = useDebouncedCallback(async (state: string) => {
    onHistoryChange(state);
  }, ONHISTORYCHANGE_DEBOUNCE_TIME);

  const fontFamilyClass = getFontFamily();

  return (
    <LexicalComposer initialConfig={editorConfig} key={id}>
      <div className={clsx('editor-wrapper', fontFamilyClass)}>
        <RichTextPlugin
          contentEditable={CustomContent}
          placeholder={<Placeholder className={placeholderClassName} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {floatingAnchorElem && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <FloatingMenuPlugin anchorElem={floatingAnchorElem} />
            <CodeActionPlugin anchorElem={floatingAnchorElem} />
          </>
        )}
        <ClickableLinkPlugin />
        <OnChangePlugin
          onChange={(state) => {
            const editorStateJSON = parseEditorOnChange(state);
            debouncedOnChange(editorStateJSON);
            debouncedOnHistoryChange(editorStateJSON);
          }}
        />
        <SlashCommandPickerPlugin />
        <TabFocusPlugin />
        <LinkPlugin validateUrl={validateUrl} />
        <ListPlugin />
        <CheckListPlugin />
        <HistoryPlugin />
        <AutoLinkPlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin />
        <CodeHighlightPlugin />
        <PageBreakPlugin />
        <HashtagPlugin />
        <ShortcutPlugin />
        <FocusModePlugin />
      </div>
    </LexicalComposer>
  );
};
