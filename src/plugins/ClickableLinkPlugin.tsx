// @ts-nocheck
// TODO: add types
import { useEffect } from 'react';

import { $isLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, isHTMLAnchorElement } from '@lexical/utils';
import { open } from '@tauri-apps/api/shell';
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  getNearestEditorFromDOMNode,
} from 'lexical';

function findMatchingDOM(startNode, predicate) {
  if (!predicate) return null;

  let node = startNode;
  while (node != null) {
    if (predicate(node)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export default function LexicalClickableLinkPlugin({ newTab = true }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const onClick = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      const nearestEditor = getNearestEditorFromDOMNode(target);

      if (nearestEditor === null) {
        return;
      }

      let url = null;
      let urlTarget = null;
      nearestEditor.update(() => {
        const clickedNode = $getNearestNodeFromDOMNode(target);
        if (clickedNode !== null) {
          const maybeLinkNode = $findMatchingParent(clickedNode, $isElementNode);
          if ($isLinkNode(maybeLinkNode)) {
            url = maybeLinkNode.getURL();
            urlTarget = maybeLinkNode.getTarget();
          } else {
            const a = findMatchingDOM(target, isHTMLAnchorElement);
            if (a !== null) {
              url = a.href;
              urlTarget = a.target;
            }
          }
        }
      });

      if (url === null || url === '') {
        return;
      }

      // Allow user to select link text without follwing url
      const selection = editor.getEditorState().read($getSelection);
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        event.preventDefault();
        return;
      }
      open(url);
      event.preventDefault();
    };

    const onMouseUp = (event) => {
      if (event.button === 1 && editor.isEditable()) {
        onClick(event);
      }
    };

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener('click', onClick);
        prevRootElement.removeEventListener('mouseup', onMouseUp);
      }
      if (rootElement !== null) {
        rootElement.addEventListener('click', onClick);
        rootElement.addEventListener('mouseup', onMouseUp);
      }
    });
  }, [editor, newTab]);

  return null;
}
