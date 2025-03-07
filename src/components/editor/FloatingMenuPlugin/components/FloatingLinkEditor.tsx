import { FC, useEffect, useState } from 'react';

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import clsx from 'clsx';
import { $createRangeSelection, $getSelection, $isTextNode, $setSelection } from 'lexical';
import { LexicalEditor } from 'lexical';
import { $isRangeSelection } from 'lexical';
import { ChevronDown, Link, Text } from 'lucide-react';

import { DropdownMenu, useDropdownMenuToggle } from '@/components/DropdownMenu';
import { Tooltip } from '@/components/Tooltip';
import { sanitizeUrl } from '@/components/editor/plugins/AutolinkPlugin';

import { getSelectedNode } from '../utils/getSelectedNode';

interface LinkEditorProps {
  editor: LexicalEditor;
  onClose: () => void;
}

const LinkEditor: FC<LinkEditorProps> = ({ editor, onClose }) => {
  const [link, setLink] = useState('https://www.google.com');
  const [text, setText] = useState('');

  // Load the selected text and link when the editor state changes
  useEffect(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const node = getSelectedNode(selection);
      setText(selection.getTextContent().replace(/\n/g, '') || '');

      if ($isLinkNode(node)) {
        setLink(node.getURL());
      }
    });
  }, [editor]);

  const monitorInputInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLinkSubmission(event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    }
  };

  const handleLinkSubmission = (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault();

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (link.trim() === '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        onClose();
        return;
      }

      const anchorNode = selection.anchor.getNode();
      const focusNode = selection.focus.getNode();

      if ($isTextNode(anchorNode) && anchorNode === focusNode) {
        const anchorOffset = selection.anchor.offset;
        const focusOffset = selection.focus.offset;

        const [start, end] =
          anchorOffset < focusOffset ? [anchorOffset, focusOffset] : [focusOffset, anchorOffset];
        const [, selectedNode, _] = anchorNode.splitText(start, end);

        selectedNode.setTextContent(text);

        const rangeSelection = $createRangeSelection();
        rangeSelection.setTextNodeRange(
          selectedNode,
          0,
          selectedNode,
          selectedNode.getTextContent().length,
        );
        $setSelection(rangeSelection);
      }
    });

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(link));

    onClose();
  };

  return (
    <div>
      <div className="flex items-center gap-2 p-1">
        <Link size={12} />
        <input
          type="text"
          className="outline-none w-full text-sm"
          placeholder="Paste or type your link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={monitorInputInteraction}
        />
      </div>
      <div className="flex w-full bg-neutral-100 h-[1px]"></div>
      <div className="flex items-center gap-2 p-1">
        <Text size={12} />
        <input
          type="text"
          className="outline-none w-full text-sm"
          placeholder="Text to display"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={monitorInputInteraction}
        />
      </div>
    </div>
  );
};

interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  isLinkActive: boolean;
}

export const FloatingLinkEditor: FC<FloatingLinkEditorProps> = ({ editor, isLinkActive }) => {
  const { isOpen, setIsOpen } = useDropdownMenuToggle();

  return (
    <DropdownMenu isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger className="ring-0! hover:ring-0! p-0! rounded-lg!">
        <Tooltip
          trigger={
            <div
              role="button"
              className={clsx(
                'flex items-center justify-center gap-1 h-8 rounded-lg hover:bg-neutral-100 px-2 dark:hover:bg-stone-700',
              )}
            >
              <Link size={14} />
              <ChevronDown
                color={isLinkActive ? 'var(--color-orange-600)' : 'var(--color-gray-600)'}
                size={16}
              />
            </div>
          }
          content="Link"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <div className="p-2 w-[250px] bg-white rounded-lg shadow-1">
          <LinkEditor onClose={() => setIsOpen(false)} editor={editor} />
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
