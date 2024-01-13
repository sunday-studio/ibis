import { useCallback, useEffect } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DOMConversionMap,
  DOMConversionOutput,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';

export type SerializedPageBreakNode = SerializedLexicalNode;

const createScissorSvg = () => {
  // Create the main SVG element
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', 'page-break-svg');

  // Create and append the elements
  function createAndAppendElement(tag: string, attributes: any) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    svg.appendChild(element);
  }

  // Create path elements
  createAndAppendElement('path', { d: 'M5.42 9.42 8 12' });
  createAndAppendElement('path', { d: 'm14 6-8.58 8.58' });
  createAndAppendElement('path', { d: 'M10.8 14.8 14 18' });
  createAndAppendElement('path', { d: 'M16 12h-2' });
  createAndAppendElement('path', { d: 'M22 12h-2' });

  // Create circle elements
  createAndAppendElement('circle', { cx: '4', cy: '8', r: '2' });
  createAndAppendElement('circle', { cx: '4', cy: '16', r: '2' });

  // Append the SVG to the body or another element in your document
  // document.body.appendChild(svg);

  return svg;
};

function PageBreakComponent({ nodeKey }: { nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      if (isSelected && $isNodeSelection($getSelection())) {
        const node = $getNodeByKey(nodeKey);
        if ($isPageBreakNode(node)) {
          node?.remove();
          return true;
        }
      }
      return false;
    },
    [isSelected, nodeKey],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const pbElement = editor.getElementByKey(nodeKey);
          if (event.target === pbElement) {
            if (!event.shiftKey) {
              clearSelection();
            }

            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  useEffect(() => {
    const pbElement = editor.getElementByKey(nodeKey);

    if (pbElement !== null) {
      pbElement.className = isSelected ? 'selected' : '';
    }
  }, [editor, isSelected, nodeKey]);

  return null;
}

export class PageBreakNode extends DecoratorNode<JSX.Element> {
  static getType(): string {
    return 'page-break';
  }

  static clone(node: PageBreakNode): PageBreakNode {
    return new PageBreakNode(node._key);
  }

  static importJSON(_serializedNode: SerializedLexicalNode): PageBreakNode {
    return $createPageBreakNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      figure: (domNode: HTMLElement) => {
        const type = domNode.getAttribute('type');
        if (type !== this.getType()) return null;

        return {
          conversion: convertPageBreakElement,
          priority: COMMAND_PRIORITY_HIGH,
        };
      },
    };
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: this.getType(),
      version: 1,
    };
  }

  createDOM(): HTMLElement {
    const element = document.createElement('figure');
    const svg = createScissorSvg();

    element.style.pageBreakAfter = 'always';
    element.setAttribute('type', this.getType());

    element.appendChild(svg);
    return element;
  }

  getTextContent(): string {
    return '\n';
  }

  isInline(): false {
    return false;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return <PageBreakComponent nodeKey={this.__key} />;
  }
}

function convertPageBreakElement(): DOMConversionOutput {
  return {
    node: $createPageBreakNode(),
  };
}

export function $createPageBreakNode(): PageBreakNode {
  return new PageBreakNode();
}

export function $isPageBreakNode(node: LexicalNode | null | undefined): node is PageBreakNode {
  return node instanceof PageBreakNode;
}
