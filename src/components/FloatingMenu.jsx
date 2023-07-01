import { forwardRef, useEffect, useState } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';

import { Bold, Italic, Underline, Strikethrough, Code, Link2 } from 'lucide-react';
import FloatingLinkEditor from './FloatingLinkEditor';

export const FloatingMenu = forwardRef(function FloatingMenu(props, ref) {
  const { editor } = props;

  const [state, setState] = useState({
    isBold: false,
    isCode: false,
    isItalic: false,
    isStrikethrough: false,
    isUnderline: false,
    isLink: false,
  });

  const actions = [
    {
      icon: <Bold size={18} />,
      isActive: state.isBold,
      action: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
    },
    {
      icon: <Italic size={18} />,
      isActive: state.isItalic,
      action: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'),
    },
    {
      icon: <Underline size={18} />,
      isActive: state.isUnderline,
      action: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'),
    },

    {
      icon: <Strikethrough size={18} />,
      isActive: state.isStrikethrough,
      action: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough'),
    },

    {
      icon: <Code size={18} />,
      isActive: state.isCode,
      action: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code'),
    },
    {
      icon: <Link2 size={18} />,
      isActive: state.isLink,
      action: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code'),
    },
  ];

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setState({
          isBold: selection.hasFormat('bold'),
          isCode: selection.hasFormat('code'),
          isItalic: selection.hasFormat('italic'),
          isStrikethrough: selection.hasFormat('strikethrough'),
          isUnderline: selection.hasFormat('underline'),
          isLink: selection.hasFormat('link'),
        });
      });
    });
    return unregisterListener;
  }, [editor]);

  return (
    <div ref={ref} className="floating-menu">
      <FloatingLinkEditor editor={editor} />
      {actions.map((action, index) => {
        return (
          <div
            className={`floating-menu__item ${action.isActive ? 'item-active' : ''}`}
            key={index}
            onClick={action?.action}
          >
            <div className="icon">{action.icon}</div>
          </div>
        );
      })}
    </div>
  );
});
