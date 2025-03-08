import type { JSX } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import { createPortal } from 'react-dom';

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CodeNode,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeFromDOMNode, isHTMLElement } from 'lexical';
import { ChevronDownIcon } from 'lucide-react';

import { useDebounce } from '@/hooks/use-debounce';

import { DropdownMenu } from '../DropdownMenu';

const CODE_PADDING = 8;

interface Position {
  top: string;
  right: string;
}

// TODO: rewrite later after moving to shiki

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

function CodeActionMenuContainer({ anchorElem }: { anchorElem: HTMLElement }): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const [lang, setLang] = useState('');
  const [isShown, setShown] = useState<boolean>(false);
  const [shouldListenMouseMove, setShouldListenMouseMove] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({
    right: '0',
    top: '0',
  });

  const codeSetRef = useRef<Set<string>>(new Set());
  const codeDOMNodeRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedOnMouseMove = useDebounce(
    (event: MouseEvent) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event, dropdownRef.current);
      if (isOutside) {
        setShown(false);
        return;
      }

      if (!codeDOMNode) {
        return;
      }

      codeDOMNodeRef.current = codeDOMNode;

      let codeNode: CodeNode | null = null;
      let _lang = '';

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode);

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode;
          _lang = codeNode.getLanguage() || '';
        }
      });

      if (codeNode) {
        const { y: editorElemY, right: editorElemRight } = anchorElem.getBoundingClientRect();
        const { y, right } = codeDOMNode.getBoundingClientRect();
        setLang(_lang);
        setShown(true);
        setPosition({
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        });
      }
    },
    50,
    1000,
  );

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return;
    }

    document.addEventListener('mousemove', debouncedOnMouseMove);

    return () => {
      // setShown(false);
      // debouncedOnMouseMove.cancel();
      // document.removeEventListener('mousemove', debouncedOnMouseMove);
    };
  }, [shouldListenMouseMove, debouncedOnMouseMove, dropdownRef]);

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case 'created':
                codeSetRef.current.add(key);
                break;

              case 'destroyed':
                codeSetRef.current.delete(key);
                break;

              default:
                break;
            }
          }
        });
        setShouldListenMouseMove(codeSetRef.current.size > 0);
      },
      { skipInitialization: false },
    );
  }, [editor]);

  const codeFriendlyName = getLanguageFriendlyName(lang);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      editor.update(() => {
        if (codeDOMNodeRef.current !== null) {
          const node = $getNearestNodeFromDOMNode(codeDOMNodeRef.current);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [editor],
  );

  return (
    <>
      {isShown ? (
        <div
          className="code-action-menu-container flex h-[35.8px] absolute  items-center flex-row select-none"
          style={{ ...position }}
        >
          <DropdownMenu>
            <DropdownMenu.Trigger className="text-sm flex items-center gap-1">
              <>{codeFriendlyName}</>
              <ChevronDownIcon className="w-4 h-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content ref={dropdownRef} className="gap-0!">
              <DropdownMenu.MenuContent>
                {CODE_LANGUAGE_OPTIONS.map(([lang, friendlyName]) => (
                  <DropdownMenu.Item key={lang} action={() => onCodeLanguageSelect(lang)}>
                    {friendlyName}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.MenuContent>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      ) : null}
    </>
  );
}

function getMouseInfo(
  event: MouseEvent,
  dropdownRef: HTMLDivElement | null,
): {
  codeDOMNode: HTMLElement | null;
  isOutside: boolean;
} {
  const target = event.target;
  if (isHTMLElement(target)) {
    const codeDOMNode = target.closest<HTMLElement>('code.editor-code');
    const menuContainer = target.closest<HTMLElement>('div.code-action-menu-container');

    const isOutside = !codeDOMNode && !menuContainer && !dropdownRef?.contains(target);

    return { codeDOMNode, isOutside };
  } else {
    return { codeDOMNode: null, isOutside: true };
  }
}

export default function CodeActionMenuPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.ReactPortal | null {
  return createPortal(<CodeActionMenuContainer anchorElem={anchorElem} />, anchorElem);
}
