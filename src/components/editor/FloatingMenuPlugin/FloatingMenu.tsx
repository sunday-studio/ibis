import { FC, ForwardedRef, Fragment, forwardRef } from 'react';

import { $isAtNodeEnd } from '@lexical/selection';
import clsx from 'clsx';
import { FORMAT_TEXT_COMMAND, LexicalEditor, RangeSelection } from 'lexical';
import {
  Bold,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  CodeXml,
  Highlighter,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from 'lucide-react';
import { Button } from 'react-aria-components';
import { useSnapshot } from 'valtio';

import { Tooltip } from '@/components/Tooltip';

import { FloatingLinkEditor } from './components/FloatingLinkEditor';
import { TextHighlightAction } from './components/TextHighlightAction';
import { floatingToolbarStore } from './floating-toolbar.store';

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
    showArrow={false}
    trigger={
      <Button
        type="button"
        onPress={action}
        aria-label={label}
        className={clsx(
          'flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 dark:hover:bg-stone-700',
          {
            'text-orange-600': isActive,
          },
        )}
      >
        {icon}
      </Button>
    }
    content={label}
    shortcuts={shortcuts}
  />
);

interface FloatingMenuComponentProps extends FloatingMenuProps {
  ref: ForwardedRef<HTMLDivElement>;
}

const FloatingMenuComponent = ({ ref, editor }: FloatingMenuComponentProps) => {
  const {
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
    isHighlight,
  } = useSnapshot(floatingToolbarStore);

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
      label: 'Highlight',
      cell: (
        <SingleAction
          label="Highlight"
          isActive={isHighlight}
          icon={<Highlighter size={16} />}
          action={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight')}
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
      separator: true,
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
      cell: <FloatingLinkEditor editor={editor} isLinkActive={isLink} />,
      separator: true,
    },
    {
      label: 'Text Highlight',
      cell: <TextHighlightAction editor={editor} />,
    },
  ];

  return (
    <div
      ref={ref}
      className="transition-opacity duration-500 will-change-transform align-middle flex items-center justify-center p-1 bg-white rounded-xl shadow-1 dark:bg-stone-800"
    >
      <div className="flex items-center justify-center gap-1.5">
        {actions.map((action, index) => (
          <Fragment key={index}>
            {action.cell}
            {action.separator && <div className="h-6 bg-neutral-100 w-[1px] dark:bg-stone-700" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>((props, ref) => (
  <FloatingMenuComponent {...props} ref={ref} />
));
