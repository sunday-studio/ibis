import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  PointType,
  RangeSelection,
} from 'lexical';

const PLACEHOLDER_CLASS_NAME = 'node-placeholder';

const isHtmlHeadingElement = (el: HTMLElement): el is HTMLHeadingElement => {
  return el instanceof HTMLHeadingElement;
};

const setPlaceholderOnSelection = ({
  selection,
  editor,
}: {
  selection: RangeSelection;
  editor: LexicalEditor;
}): void => {
  const children = getAllLexicalChildren(editor);

  children.forEach(({ htmlElement }) => {
    if (!htmlElement) {
      return;
    }

    if (isHtmlHeadingElement(htmlElement)) {
      return;
    }

    const classList = htmlElement.classList;

    if (classList.length && classList.contains(PLACEHOLDER_CLASS_NAME)) {
      classList.remove(PLACEHOLDER_CLASS_NAME);
    }
  });

  if (
    children.length === 1 &&
    children[0].htmlElement &&
    !isHtmlHeadingElement(children[0].htmlElement)
  ) {
    return;
  }

  const anchor: PointType = selection.anchor;

  const placeholder = "Write or type '/' for slash commands....";

  if (placeholder) {
    const selectedHtmlElement = editor.getElementByKey(anchor.key);

    selectedHtmlElement?.classList.add(PLACEHOLDER_CLASS_NAME);
    selectedHtmlElement?.setAttribute('data-placeholder', placeholder);
  }
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
