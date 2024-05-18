import { useEffect, useRef } from 'react';

import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $createListItemNode, $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  ElementTransformer,
  TRANSFORMERS,
  type Transformer,
} from '@lexical/markdown';
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
import { $createTextNode, $getRoot } from 'lexical';
import { useDebouncedCallback } from 'use-debounce';

import AutoLinkPlugin, { validateUrl } from '@/plugins/AutolinkPlugin';
import ClickableLinkPlugin from '@/plugins/ClickableLinkPlugin';
import CodeHighlightPlugin from '@/plugins/CodeHighlightPlugin';
import FloatingMenuPlugin from '@/plugins/FloatingMenuPlugin';
import PageBreakPlugin from '@/plugins/PageBreakPlugin/PageBreakPlugin';
import {
  PAGE_BREAK_NODE_TRANSFORMER,
  PageBreakNode,
} from '@/plugins/PageBreakPlugin/nodes/PageBreakNode';
import SearchDialogPlugin from '@/plugins/SearchDialogPlugin';
import SlashCommandPickerPlugin from '@/plugins/SlashCommandPicker';
import TabFocusPlugin from '@/plugins/TabFocusPlugin';
import { theme } from '@/plugins/theme';

import { EntryHeader } from './Editor.EntryHeader';

function Placeholder({ className }) {
  return <div className={className}>Write or type '/' for slash commands....</div>;
}
const CHECKLIST_TRANSFORMER: ElementTransformer = {
  export: (node) => {
    if ($isListItemNode(node)) {
      console.log('called =>>>>>');
      const listItemNode = node;
      if (listItemNode.checked) {
        return '- [x] ' + listItemNode.getTextContent() + '\n';
      } else {
        return '- [ ] ' + listItemNode.getTextContent() + '\n';
      }
    }
    return null;
  },
  regExp: /^(\s*)(?:-\s)?\s?(\[(\s|x)?\])\s/i,
  replace: (parentNode, _, match) => {
    console.log({ parentNode, match });

    // const [allMatch, text] = match;
    // const checked = allMatch.includes('[x]');
    // const listItemNode = $createListItemNode(checked);
    // const textNode = $createTextNode(text);
    // listItemNode.__listType = 'check';
    // console.log('listItemNode =>', listItemNode);
    // listItemNode.append(textNode);
    // // @ts-ignore
    // parentNode.replace([listItemNode]);
  },
  type: 'element',
  dependencies: [ListItemNode, ListNode],
};

const CUSTOM_TRANSFORMERS = [...TRANSFORMERS, PAGE_BREAK_NODE_TRANSFORMER, CHECKLIST_TRANSFORMER];

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function MarkdownContentPlugin({ markdown }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (markdown) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        $convertFromMarkdownString(markdown, CUSTOM_TRANSFORMERS);
      });
    }
  }, [editor, markdown]);

  return null;
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
  page: keyof typeof EDITOR_PAGES;
  extendTheme?: {};
  placeholderClassName?: string;
}

export const Editor = ({
  id,
  content,
  // onChange,
  page,
  extendTheme,
  placeholderClassName = 'editor-placeholder',
}: EditorType) => {
  const markdownRef = useRef<string>();

  const editorConfig = {
    namespace: 'ContentEditor',
    theme: {
      ...theme,
      ...extendTheme,
    },
    onError,
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

      // ChecklistNode,
      // Checklist,
    ],
  };

  const debouncedUpdates = useDebouncedCallback(async () => {
    console.log('markdown => ', markdownRef.current);

    // @ts-ignore
    // console.log('test =>', JSON.stringify(editorState?.current?.toJSON?.()));
    // onChange(editorState?.current?.toJSON?.());
  }, 750);

  return (
    <LexicalComposer initialConfig={editorConfig} key={id}>
      <RichTextPlugin
        contentEditable={
          <div className="editor-wrapper">
            {page === EDITOR_PAGES.ENTRY && <EntryHeader />}
            <ContentEditable className="editor-input" />
          </div>
        }
        placeholder={<Placeholder className={placeholderClassName} />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        onChange={(state) => {
          let se;
          state.read(() => {
            se = state;
            markdownRef.current = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
          });

          // console.log(se.toJSON());
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
      <AutoFocusPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />
      <MarkdownShortcutPlugin transformers={CUSTOM_TRANSFORMERS} />
      <CodeHighlightPlugin />
      <PageBreakPlugin />
      <SearchDialogPlugin />
      <MarkdownContentPlugin markdown={content} />
    </LexicalComposer>
  );
};
