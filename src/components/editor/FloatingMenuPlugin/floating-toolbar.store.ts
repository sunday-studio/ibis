import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  LexicalEditor,
  $isRangeSelection,
  getDOMSelection,
  $isTextNode,
  $isParagraphNode,
} from 'lexical';
import { useCallback, useEffect } from 'react';
import { proxy } from 'valtio';
import { getSelectedNode } from './utils/getSelectedNode';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $isLinkNode } from '@lexical/link';
import { $isCodeHighlightNode } from '@lexical/code';

interface FloatingToolbarStore {
  show: boolean;
  isText: boolean;
  isLink: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isUppercase: boolean;
  isLowercase: boolean;
  isCapitalize: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isHighlight: boolean;
  isCode: boolean;
  textColor: string;
  backgroundColor: string;
}

export const floatingToolbarStore = proxy<FloatingToolbarStore>({
  show: false,
  isText: false,
  isLink: false,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isUppercase: false,
  isLowercase: false,
  isCapitalize: false,
  isStrikethrough: false,
  isSubscript: false,
  isSuperscript: false,
  isHighlight: false,
  isCode: false,
  textColor: '#000000',
  backgroundColor: '#ffffff',
});

export const setShowState = (value: boolean) => {
  floatingToolbarStore.show = value;
};

export const setTextState = (value: boolean) => {
  floatingToolbarStore.isText = value;
};

export const setLinkState = (value: boolean) => {
  floatingToolbarStore.isLink = value;
};

export const setBoldState = (value: boolean) => {
  floatingToolbarStore.isBold = value;
};

export const setItalicState = (value: boolean) => {
  floatingToolbarStore.isItalic = value;
};

export const setUnderlineState = (value: boolean) => {
  floatingToolbarStore.isUnderline = value;
};

export const setUppercaseState = (value: boolean) => {
  floatingToolbarStore.isUppercase = value;
};

export const setLowercaseState = (value: boolean) => {
  floatingToolbarStore.isLowercase = value;
};

export const setCapitalizeState = (value: boolean) => {
  floatingToolbarStore.isCapitalize = value;
};

export const setStrikethroughState = (value: boolean) => {
  floatingToolbarStore.isStrikethrough = value;
};

export const setSubscriptState = (value: boolean) => {
  floatingToolbarStore.isSubscript = value;
};

export const setSuperscriptState = (value: boolean) => {
  floatingToolbarStore.isSuperscript = value;
};

export const setHighlightState = (value: boolean) => {
  floatingToolbarStore.isHighlight = value;
};

export const setCodeState = (value: boolean) => {
  floatingToolbarStore.isCode = value;
};

export const setTextColor = (color: string) => {
  floatingToolbarStore.textColor = color;
};

export const setBackgroundColor = (color: string) => {
  floatingToolbarStore.backgroundColor = color;
};

interface useFloatingToolbarStoreProps {
  editor: LexicalEditor;
}
export const useFloatingToolbarStoreListener = ({ editor }: useFloatingToolbarStoreProps) => {
  const $updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) {
        return;
      }

      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setShowState(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setBoldState(selection.hasFormat('bold'));
      setItalicState(selection.hasFormat('italic'));
      setUnderlineState(selection.hasFormat('underline'));
      setUppercaseState(selection.hasFormat('uppercase'));
      setLowercaseState(selection.hasFormat('lowercase'));
      setCapitalizeState(selection.hasFormat('capitalize'));
      setStrikethroughState(selection.hasFormat('strikethrough'));
      setSubscriptState(selection.hasFormat('subscript'));
      setSuperscriptState(selection.hasFormat('superscript'));
      setCodeState(selection.hasFormat('code'));
      setHighlightState(selection.hasFormat('highlight'));

      // Update text color and background color
      setTextColor($getSelectionStyleValueForProperty(selection, 'color', 'currentColor'));
      setBackgroundColor(
        $getSelectionStyleValueForProperty(selection, 'background-color', 'transparent'),
      );

      // update link state
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setLinkState(true);
      } else {
        setLinkState(false);
      }

      if (!$isCodeHighlightNode(selection.anchor.getNode()) && selection.getTextContent() !== '') {
        setTextState($isTextNode(node) || $isParagraphNode(node));
      } else {
        setTextState(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setTextState(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', $updateToolbar);
    return () => {
      document.removeEventListener('selectionchange', $updateToolbar);
    };
  }, [$updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        $updateToolbar();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          $updateToolbar();
        }
      }),
    );
  }, [$updateToolbar, editor]);
};
