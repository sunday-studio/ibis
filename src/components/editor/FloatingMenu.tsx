import { RefObject, forwardRef, useEffect, useState } from 'react';
import { useCallback } from 'react';

import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isAtNodeEnd } from '@lexical/selection';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import {
  Bold,
  CheckCheck,
  Code,
  CornerDownLeft,
  Italic,
  Link2,
  Strikethrough,
  Underline,
} from 'lucide-react';

import { validateUrl } from '../../plugins/AutolinkPlugin';

export function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

const LinkInput = ({ value, onChange, onBackClick, onSave }) => {
  const isValueLink = validateUrl(value.toLowerCase());

  return (
    <div className="floating-link-input">
      <div className="icon" onClick={onBackClick}>
        <CornerDownLeft size={18} />
      </div>
      <div className="vr-divider" />
      <input placeholder="Enter link" value={value} onChange={(e) => onChange(e.target.value)} />

      {isValueLink && (
        <>
          <div className="vr-divider" />
          <div className="icon" onClick={onSave}>
            <CheckCheck size={18} color="#fc521f" />
          </div>
        </>
      )}
    </div>
  );
};

export const FloatingMenu = forwardRef(function FloatingMenu(
  props: { editor: LexicalEditor },
  ref: RefObject<HTMLDivElement>,
) {
  const { editor } = props;
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState('');

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
      action: () => {
        setShowLinkInput(true);
      },
    },
  ];

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const node = getSelectedNode(selection);
        const parent = node.getParent();

        if ($isLinkNode(parent) || ($isLinkNode(node) && parent.getURL())) {
          setState((prev) => ({
            ...prev,
            isLink: true,
          }));
          setLinkValue(parent.getURL());
        }

        setState((prev) => ({
          ...prev,
          isBold: selection.hasFormat('bold'),
          isCode: selection.hasFormat('code'),
          isItalic: selection.hasFormat('italic'),
          isStrikethrough: selection.hasFormat('strikethrough'),
          isUnderline: selection.hasFormat('underline'),
        }));
      });
    });

    return unregisterListener;
  }, [editor]);

  const onBack = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if (!parent || !node) {
        setShowLinkInput(false);
        return;
      }

      const prevURL = parent?.getURL?.();

      if (prevURL && !linkValue.length) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        setShowLinkInput(false);
        setState((prev) => ({ ...prev, isLink: false }));
        return;
      }

      setShowLinkInput(false);
    });
  }, [editor]);

  return (
    <div ref={ref} className="floating-menu popover-container">
      {showLinkInput ? (
        <LinkInput
          onSave={() => {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkValue);
            setLinkValue('');
            setShowLinkInput(false);
          }}
          value={linkValue}
          onChange={(v) => setLinkValue(v)}
          onBackClick={onBack}
        />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
});
