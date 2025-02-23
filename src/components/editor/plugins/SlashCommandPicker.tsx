import { JSX, useCallback, useMemo, useState } from 'react';
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
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createParagraphNode, $getSelection, $isRangeSelection, TextNode } from 'lexical';
import {
  CheckSquare,
  CodeXml,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  ScissorsIcon,
} from 'lucide-react';
import { INSERT_PAGE_BREAK } from './PageBreakPlugin/PageBreakPlugin';

const headingIconMap = {
  h1: <Heading1 size={18} />,
  h2: <Heading2 size={18} />,
  h3: <Heading3 size={18} />,
} as const;

interface ComponentPickerOptionParams {
  keywords?: string[];
  icon?: JSX.Element | string;
  keyboardShortcut?: string;
  onSelect: (v1: any, v2?: any) => void;
}

class ComponentPickerOption extends MenuOption {
  title: string;
  icon: JSX.Element | string;
  keywords: string[];
  keyboardShortcut: string | undefined;
  onSelect: (v1: any, v2?: any) => void;
  key: string;

  constructor(title: string, options: ComponentPickerOptionParams) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon || '';
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
    this.key = title.toLowerCase().replace(/\s+/g, '-');
  }
}

interface SlashCommandMenuItem {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: React.MouseEventHandler<HTMLLIElement>;
  option: ComponentPickerOption;
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
      role="option"
      id={`typeahead-item-${index}`}
      aria-selected={isSelected}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className="flex cursor-pointer items-center justify-start p-2 rounded-lg gap-2 aria-[selected='true']:bg-stone-100 aria-[selected='true']:inset-ring aria-[selected='true']:inset-ring-stone-200 dark:aria-[selected='true']:bg-stone-800 dark:aria-[selected='true']:inset-ring-stone-700"
    >
      <div className="text-stone-500 w-6 h-6 flex items-center justify-center">{option.icon}</div>
      <p className="text-stone-900 dark:text-stone-300">{option.title}</p>
    </li>
  );
}

export default function SlashCommandPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

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
        (n) =>
          new ComponentPickerOption(`Heading ${n}`, {
            icon: headingIconMap[`h${n}` as keyof typeof headingIconMap],
            keywords: ['heading', 'header', `h${n}`],
            onSelect: () =>
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode(`h${n}` as HeadingTagType));
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
        icon: <CodeXml size={18} />,
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

    if (!queryString) return baseOptions;

    return baseOptions.filter((option) => {
      const titleMatch = new RegExp(queryString, 'gi').test(option.title);
      const keywordMatch = option.keywords?.some((keyword) =>
        new RegExp(queryString, 'gi').test(keyword),
      );
      return titleMatch || keywordMatch;
    });
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef.current && options.length
          ? ReactDOM.createPortal(
              <div className="shadow-1 rounded-lg p-2 bg-white dark:bg-stone-900 w-[250px]">
                <ul className="list-none p-0 m-0">
                  {options.map((option, i) => (
                    <SlashCommandMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
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
  );
}
