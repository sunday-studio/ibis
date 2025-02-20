import { useEffect, useMemo, useState } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HashtagNode } from '@lexical/hashtag';
import { useDebouncedCallback } from 'use-debounce';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';

import AutoLinkPlugin, { validateUrl } from './plugins/AutolinkPlugin';
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import { MarkdownShortcutPlugin } from './plugins/MarkdownShortcut';
import PageBreakPlugin from './plugins/PageBreakPlugin/PageBreakPlugin';
import { PageBreakNode } from './plugins/PageBreakPlugin/nodes/PageBreakNode';
import SearchDialogPlugin from './plugins/SearchDialogPlugin';
import SlashCommandPickerPlugin from './plugins/SlashCommandPicker';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import { theme } from './plugins/theme';
import { EditorState } from 'lexical';
import DraggableBlockPlugin from './plugins/DraggableBlock';
import { setNodePlaceholderFromSelection } from './NodePlaceholder/utils';
import FloatingMenuPlugin from './FloatingMenuPlugin/FloatingMenuPlugin';

import './_editor.css';

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
  extendTheme?: {};
  placeholderClassName?: string;
}

export const Editor = ({
  id,
  content,
  onChange,
  extendTheme,
  placeholderClassName = 'editor-placeholder',
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
    theme: {
      ...theme,
      ...extendTheme,
    },
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

  const debouncedUpdates = useDebouncedCallback(async (editorState) => {
    const editorStateJSON = editorState.toJSON();
    onChange(JSON.stringify(editorStateJSON));
  }, 750);

  return (
    <LexicalComposer initialConfig={editorConfig} key={id}>
      <div className="editor-wrapper">
        <RichTextPlugin
          contentEditable={CustomContent}
          placeholder={<Placeholder className={placeholderClassName} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        {floatingAnchorElem && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <FloatingMenuPlugin anchorElem={floatingAnchorElem} setIsLinkEditMode={() => {}} />
          </>
        )}
        <ClickableLinkPlugin />
        <OnChangePlugin onChange={debouncedUpdates} />
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
        <SearchDialogPlugin />
        <HashtagPlugin />
      </div>
    </LexicalComposer>
  );
};
