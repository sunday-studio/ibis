import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  getDOMSelection,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { Dispatch, useCallback, useEffect, useRef } from 'react';
import {
  Bold,
  CodeXml,
  Italic,
  Link,
  Strikethrough,
  Underline,
  Superscript,
  Subscript,
  CaseUpper,
  CaseLower,
  CaseSensitive,
} from 'lucide-react';

import { getDOMRangeRect } from './utils/getDOMRangeRect';
import { setFloatingElemPosition } from './utils/setFloatingElemPosition';
import { FC } from 'react';
import { Fragment } from 'react/jsx-runtime';
import clsx from 'clsx';
import { Tooltip } from '@/components/Tooltip';

interface FloatingMenuProps {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isLink: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isUppercase: boolean;
  isLowercase: boolean;
  isCapitalize: boolean;
  isCode: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}

interface SingleActionProps {
  icon: React.ReactNode;
  action: () => void;
  isActive: boolean;
  label: string;
  shortcuts?: string[];
}

const SingleAction: FC<SingleActionProps> = ({
  icon,
  action,
  isActive,
  label = '',
  shortcuts = [],
}) => (
  <Tooltip
    trigger={
      <button
        type="button"
        onClick={action}
        aria-label={label}
        className={clsx(
          'flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 ',
          {
            'text-orange-600': isActive,
          },
        )}
      >
        {icon}
      </button>
    }
    content={label}
    shortcuts={shortcuts}
  />
);

export const FloatingMenu: FC<FloatingMenuProps> = ({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isUppercase,
  isLowercase,
  isCapitalize,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  setIsLinkEditMode,
}) => {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  // const insertComment = () => {
  //   editor.dispatchCommand(INSERT_INLINE_COMMAND, undefined);
  // };

  function mouseMoveListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current && (e.buttons === 1 || e.buttons === 3)) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }
  function mouseUpListener(e: MouseEvent) {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem, isLink);
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  const actions = [
    {
      label: 'Bold',
      cell: (
        <SingleAction
          label="Bold"
          shortcuts={['⌘', 'B']}
          isActive={isBold}
          icon={<Bold size={16} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        />
      ),
    },
    {
      label: 'Italic',
      cell: (
        <SingleAction
          label="Italic"
          shortcuts={['⌘', 'I']}
          isActive={isItalic}
          icon={<Italic size={16} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        />
      ),
    },
    {
      label: 'Underline',
      cell: (
        <SingleAction
          label="Underline"
          shortcuts={['⌘', 'U']}
          isActive={isUnderline}
          icon={<Underline size={16} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        />
      ),
    },
    {
      label: 'Strikethrough',
      cell: (
        <SingleAction
          label="Strikethrough"
          shortcuts={['⌘', 'S']}
          isActive={isStrikethrough}
          icon={<Strikethrough size={18} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        />
      ),
    },
    {
      label: 'Code',
      cell: (
        <SingleAction
          label="Code"
          shortcuts={['⌘', 'K']}
          isActive={isCode}
          icon={<CodeXml size={16} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        />
      ),
    },
    {
      label: 'Superscript',
      cell: (
        <SingleAction
          label="Superscript"
          shortcuts={['⌘', '↑']}
          isActive={isSuperscript}
          icon={<Superscript size={16} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
        />
      ),
    },
    {
      label: 'Subscript',
      cell: (
        <SingleAction
          label="Subscript"
          shortcuts={['⌘', '↓']}
          isActive={isSubscript}
          icon={<Subscript size={18} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
        />
      ),
    },
    {
      label: 'Uppercase',
      cell: (
        <SingleAction
          label="Uppercase"
          shortcuts={['⌘', 'U']}
          isActive={isUppercase}
          icon={<CaseUpper size={18} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'uppercase')}
        />
      ),
    },
    {
      label: 'Lowercase',
      cell: (
        <SingleAction
          label="Lowercase"
          shortcuts={['⌘', 'L']}
          isActive={isLowercase}
          icon={<CaseLower size={18} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'lowercase')}
        />
      ),
    },
    {
      label: 'Capitalize',
      cell: (
        <SingleAction
          label="Capitalize"
          shortcuts={['⌘', 'C']}
          isActive={isCapitalize}
          icon={<CaseSensitive size={18} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'capitalize')}
        />
      ),
    },
    {
      label: 'Link',
      cell: (
        <SingleAction
          label="Link"
          isActive={isLink}
          icon={<Link size={16} />}
          action={insertLink}
        />
      ),
    },
  ];

  return (
    <div
      ref={popupCharStylesEditorRef}
      className="floating-menu-container gap-1.5 bg-white rounded-xl shadow-1"
    >
      {editor.isEditable() && (
        <>
          {actions.map((action) => {
            return <Fragment key={action.label}>{action.cell}</Fragment>;
          })}
        </>
      )}
    </div>
  );
};
