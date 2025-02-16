import { useEffect, useMemo, useRef, useState } from 'react';

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
// import { DraggableBlockPlugin } from './plugins/DraggableBlockPlugin/DraggableBlockPlugin';
import './_editor.css';
import { DraggableWrapper } from './plugins/DraggableBlockPlugin/components/DraggableWrapper';
import { DraggableBlockPluginTest } from './plugins/TestPlugin';
import { GripIcon } from 'lucide-react';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

const DraggableBlockPlugin = ({ anchorElem = document.body }: { anchorElem?: HTMLElement }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPluginTest
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className="draggable-block-menu">
          <GripIcon />
          {/* <div className="icon" /> */}
        </div>
      }
      targetLineComponent={<div ref={targetLineRef} className="draggable-block-target-line" />}
      isOnMenu={isOnMenu}
    />
  );
};

const MyOnChangePlugin = ({ onChange }: { onChange: (editorState: EditorState) => void }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
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
  const [floatingMenu, setFloatingMenu] = useState<HTMLDivElement | null>(null);
  const onRef = (_floatingMenu: HTMLDivElement) => {
    if (_floatingMenu !== null) {
      setFloatingMenu(_floatingMenu);
    }
  };

  const CustomContent = useMemo(() => {
    return (
      <div ref={onRef}>
        <ContentEditable />
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

        {floatingMenu && <DraggableBlockPlugin anchorElem={floatingMenu} />}

        <ClickableLinkPlugin />
        <MyOnChangePlugin onChange={debouncedUpdates} />
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
