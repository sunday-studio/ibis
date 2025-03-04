import { $isListNode } from '@lexical/list';
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  RangeSelection,
} from 'lexical';

const PLACEHOLDER_CLASS_NAME = 'node-placeholder';
const PLACEHOLDER_AFTER_CLASS_NAME = 'node-placeholder-after';

const isCheckListElement = (el: HTMLElement): el is HTMLElement => {
  return el instanceof HTMLElement && el.tagName === 'LI' && el.hasAttribute('aria-checked');
};

const isHeadingElement = (el: HTMLElement): el is HTMLHeadingElement => {
  return (
    el instanceof HTMLElement &&
    (el.tagName === 'H1' ||
      el.tagName === 'H2' ||
      el.tagName === 'H3' ||
      el.tagName === 'H4' ||
      el.tagName === 'H5')
  );
};

const getPlaceholderText = (node: HTMLElement | null) => {
  const defaultPlaceholderText = 'Write or type "/" for slash commands....';

  if (!node) {
    return defaultPlaceholderText;
  }

  if (isHeadingElement(node)) {
    const level = node.tagName.charAt(1);
    return `Heading ${level}...`;
  }

  if (isCheckListElement(node)) {
    return 'To do...';
  }

  return defaultPlaceholderText;
};

const getPlaceholderClassName = (node: HTMLElement | null) => {
  if (!node) {
    return '';
  }

  if (isCheckListElement(node)) {
    return PLACEHOLDER_AFTER_CLASS_NAME;
  }

  return PLACEHOLDER_CLASS_NAME;
};

const setPlaceholderOnSelection = ({
  selection,
  editor,
}: {
  selection: RangeSelection;
  editor: LexicalEditor;
}): void => {
  const children = getAllLexicalChildren(editor);

  children.forEach(({ htmlElement, node }) => {
    if (!htmlElement) {
      return;
    }

    const classList = htmlElement.classList;
    const className = getPlaceholderClassName(htmlElement);

    if (classList.length && classList.contains(className)) {
      classList.remove(className);
    }

    if ($isListNode(node)) {
      const children = node.getChildrenKeys();

      children.forEach((key) => {
        const child = editor.getElementByKey(key);

        if (child) {
          const childClassList = child.classList;
          const childClassName = getPlaceholderClassName(child);

          if (childClassList.length && childClassList.contains(childClassName)) {
            childClassList.remove(childClassName);
          }
        }
      });
    }
  });

  if (children.length === 1 && children[0].htmlElement) {
    return;
  }

  const anchor: string = selection.anchor.key;
  const selectedHtmlElement = editor.getElementByKey(anchor);

  const placeholder = getPlaceholderText(selectedHtmlElement);
  const className = getPlaceholderClassName(selectedHtmlElement);

  selectedHtmlElement?.classList.add(className);
  selectedHtmlElement?.setAttribute('data-placeholder', placeholder);
};

const getAllLexicalChildren = (editor: LexicalEditor) => {
  const childrenKeys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());

  return childrenKeys.map((key) => ({
    key: key,
    node: $getNodeByKey(key),
    htmlElement: editor.getElementByKey(key),
  }));
};

export function setNodePlaceholderFromSelection(editor: LexicalEditor) {
  editor.getEditorState().read(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }
    setPlaceholderOnSelection({ selection, editor });
  });
}
