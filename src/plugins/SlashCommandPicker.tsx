import { useCallback, useMemo, useState } from 'react';

import * as ReactDOM from 'react-dom';

import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection } from 'lexical';
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  ScissorsIcon,
} from 'lucide-react';

import { INSERT_PAGE_BREAK } from '@/plugins/PageBreakPlugin/PageBreakPlugin';

const headingIconMap: Record<'h1' | 'h2' | 'h3', JSX.Element> & {
  [index: string]: JSX.Element;
} = {
  h1: <Heading1 size={18} />,
  h2: <Heading2 size={18} />,
  h3: <Heading3 size={18} />,
};

type ComponentPickerOptionParams = {
  keywords?: string[];
  icon?: JSX.Element | string;
  keyboardShortcut?: string;
  onSelect: (v1: any, v2?: any) => void;
};

type Option = ComponentPickerOptionParams & {
  title: string;
  keywords: string[];
  key: string;
  setRefElement?: React.RefObject<HTMLLIElement>;
};

type SlashCommandMenuItem = {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: React.MouseEventHandler<HTMLLIElement>;
  option: Option;
};

class ComponentPickerOption extends MenuOption {
  title: any;
  icon: any;
  keywords: any;
  keyboardShortcut: any;
  onSelect: any;

  constructor(title: string, options: ComponentPickerOptionParams) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function SlashCommandMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: SlashCommandMenuItem) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      ref={option.setRefElement}
      role="option"
      id={'typeahead-item-' + index}
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="icon">{option?.icon}</div>
      <p className="text">{option?.title}</p>
    </li>
  );
}

export default function SlashCommandPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = [
      new ComponentPickerOption('Paragraph', {
        icon: <Pilcrow size={20} />,
        keywords: ['normal', 'paragraph', 'p', 'text'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          }),
      }),
      ...Array.from({ length: 3 }, (_, i) => i + 1).map(
        (n: number) =>
          new ComponentPickerOption(`Heading ${n}`, {
            icon: headingIconMap[`h${n}`],
            keywords: ['heading', 'header', `h${n}`],
            onSelect: () =>
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () =>
                    // @ts-ignore Correct types, but since they're dynamic TS doesn't like it.
                    $createHeadingNode(`h${n}`),
                  );
                }
              }),
          }),
      ),
      new ComponentPickerOption('Bulleted list', {
        icon: <List size={18} />,
        keywords: ['bulleted list', 'unordered list', 'ul'],
        onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),

      new ComponentPickerOption('Numbered list', {
        icon: <ListOrdered size={18} />,
        keywords: ['numbered list', 'ordered list', 'ol'],
        onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),

      new ComponentPickerOption('Check list', {
        icon: <CheckSquare size={18} />,
        keywords: ['check list', 'todo list'],
        onSelect: () => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
      }),
      new ComponentPickerOption('Code', {
        icon: <Code size={18} />,
        keywords: ['javascript', 'python', 'js', 'codeblock'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode());
              } else {
                const textContent = selection.getTextContent();
                const codeNode = $createCodeNode();
                selection.insertNodes([codeNode]);
                selection.insertRawText(textContent);
              }
            }
          }),
      }),
      new ComponentPickerOption('Quote', {
        icon: <Quote size={18} />,
        keywords: ['block quote'],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          }),
      }),

      new ComponentPickerOption('Page break', {
        icon: <ScissorsIcon size={18} />,
        keywords: ['page break', 'divider'],
        onSelect: () => {
          editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
        },
      }),
    ];

    return queryString
      ? [
          ...baseOptions.filter((option: Omit<Option, 'setRefElement'>) => {
            return new RegExp(queryString, 'gi').exec(option.title) || option.keywords != null
              ? option.keywords.some((keyword) => new RegExp(queryString, 'gi').exec(keyword))
              : false;
          }),
        ]
      : baseOptions;
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: Option,
      nodeToRemove: { remove: () => void },
      closeMenu: () => void,
      matchingString: any,
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove();
        }
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <>
      <LexicalTypeaheadMenuPlugin
        // @ts-ignore
        onQueryChange={setQueryString}
        // @ts-ignore
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="component-picker-menu popover-container">
                  <ul>
                    {options.map((option: Omit<Option, 'setRefElement'>, i) => (
                      <SlashCommandMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          // @ts-ignore
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
                        option={option}
                      />
                    ))}
                  </ul>
                </div>,
                anchorElementRef.current,
              )
            : null
        }
      />
    </>
  );
}
