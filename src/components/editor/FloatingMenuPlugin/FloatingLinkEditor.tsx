import {
  $createNodeSelection,
  $createParagraphNode,
  $createRangeSelection,
  $createTextNode,
  $getSelection,
  $isParagraphNode,
  $isTextNode,
  $setSelection,
  ParagraphNode,
} from 'lexical';
import { LexicalEditor } from 'lexical';
import { $isRangeSelection } from 'lexical';
import { Text, Link } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { getSelectedNode } from './FloatingMenu';
import { $createLinkNode, $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { sanitizeUrl } from '../plugins/AutolinkPlugin';

interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  onClose: () => void;
}

export const FloatingLinkEditor: FC<FloatingLinkEditorProps> = ({ editor, onClose }) => {
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
    <div className="w-[250px]">
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
