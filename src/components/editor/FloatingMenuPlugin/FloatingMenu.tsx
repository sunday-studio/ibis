import { FC, ForwardedRef, Fragment, forwardRef, useEffect, useMemo, useState } from 'react';
import { $isAtNodeEnd } from '@lexical/selection';
import { FORMAT_TEXT_COMMAND, LexicalEditor, RangeSelection } from 'lexical';
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
  ChevronDown,
} from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';
import clsx from 'clsx';
import { FloatingLinkEditor } from './FloatingLinkEditor';
import { TextHighlightAction } from './components/TextHighlightAction';

// Helper function to get selected node from editor selection
export function getSelectedNode(selection: RangeSelection) {
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
  }
  return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
}

interface SingleActionProps {
  icon: React.ReactNode;
  action: () => void;
  isActive: boolean;
  label: string;
  shortcuts?: string[];
}

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
  show: boolean;
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
          'flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100',
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

interface FloatingMenuComponentProps extends FloatingMenuProps {
  ref: ForwardedRef<HTMLDivElement>;
}

const FloatingMenuComponent = ({
  ref,
  editor,
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
  show,
}: FloatingMenuComponentProps) => {
  const [showLinkInput, setShowLinkInput] = useState(false);

  const actions = useMemo(() => {
    return [
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
            action={() => setShowLinkInput(true)}
          />
        ),
      },
      {
        label: 'Text Highlight',
        cell: <TextHighlightAction editor={editor} />,
        separator: true,
      },
    ];
  }, [
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    isSuperscript,
    isSubscript,
    isUppercase,
    isLowercase,
    isCapitalize,
    isLink,
  ]);

  // HACK: to reset the link input when the menu is hidden
  useEffect(() => {
    if (!show) {
      setShowLinkInput(false);
    }
  }, [show]);

  return (
    <div
      ref={ref}
      className="transition-opacity duration-500 will-change-transform align-middle flex items-center justify-center p-1 bg-white rounded-xl shadow-1"
    >
      {showLinkInput ? (
        <FloatingLinkEditor editor={editor} onClose={() => setShowLinkInput(false)} />
      ) : (
        <div className="flex items-center justify-center gap-1.5">
          {actions.map((action, index) => (
            <Fragment key={index}>
              {action.separator && <div className="h-6 bg-neutral-100 w-[1px]" />}
              {action.cell}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>((props, ref) => (
  <FloatingMenuComponent {...props} ref={ref} />
));
