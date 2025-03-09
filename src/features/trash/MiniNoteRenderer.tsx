import { useMemo } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
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

import '@/components/editor/_editor.css';
import AutoLinkPlugin, { validateUrl } from '@/components/editor/plugins/AutolinkPlugin';
import CodeHighlightPlugin from '@/components/editor/plugins/CodeHighlightPlugin';
import { MarkdownShortcutPlugin } from '@/components/editor/plugins/MarkdownShortcut';
import PageBreakPlugin from '@/components/editor/plugins/PageBreakPlugin/PageBreakPlugin';
import { PageBreakNode } from '@/components/editor/plugins/PageBreakPlugin/nodes/PageBreakNode';
import SlashCommandPickerPlugin from '@/components/editor/plugins/SlashCommandPicker';
import TabFocusPlugin from '@/components/editor/plugins/TabFocusPlugin';
import { theme } from '@/components/editor/plugins/theme';
import { getFontFamily } from '@/components/editor/utils';

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
  placeholderClassName?: string;
}

export const MiniNoteRenderer = ({
  id,
  content,
  placeholderClassName = 'editor-placeholder',
}: EditorType) => {
  const CustomContent = useMemo(() => {
    return (
      <div className="editor-inner">
        <ContentEditable className="trash-editor-root" />
      </div>
    );
  }, []);

  const editorConfig = {
    editorState: content ?? null,
    namespace: 'TrashEditor',
    editable: false,
    theme: {
      ...theme,
      paragraph: 'trash-editor-paragraph',
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

  const fontFamilyClass = getFontFamily();

  return (
    <LexicalComposer initialConfig={editorConfig} key={id}>
      <div className={clsx('trash-editor-wrapper', fontFamilyClass)}>
        <RichTextPlugin
          contentEditable={CustomContent}
          placeholder={<Placeholder className={placeholderClassName} />}
          ErrorBoundary={LexicalErrorBoundary}
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
      </div>
    </LexicalComposer>
  );
};
