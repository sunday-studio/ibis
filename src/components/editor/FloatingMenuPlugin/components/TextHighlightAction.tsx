import { Tooltip } from '@/components/Tooltip';
import { DropdownMenu, useDropdownMenuToggle } from '@/components/DropdownMenu';
import { $getSelection, LexicalEditor } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { Ampersand, ChevronDown } from 'lucide-react';
import { FC, useCallback, useMemo } from 'react';
import { floatingToolbarStore } from '../floating-toolbar.store';
import { useSnapshot } from 'valtio';
import { Button } from 'react-aria-components';

interface TextHighlightActionProps {
  editor: LexicalEditor;
}

export const TextHighlightAction: FC<TextHighlightActionProps> = ({ editor }) => {
  const { textColor, backgroundColor } = useSnapshot(floatingToolbarStore);
  const { isOpen, setIsOpen } = useDropdownMenuToggle();

  const hasTextHighlight = useMemo(() => {
    return textColor !== 'currentColor' || backgroundColor !== 'transparent';
  }, [textColor, backgroundColor]);

  const foregroundColors = [
    {
      label: 'Default',
      color: 'currentColor',
      borderColor: 'var(--color-gray-100)',
      activeColor: 'var(--color-gray-400)',
    },
    {
      label: 'Gray',
      color: 'oklch(0.621 0.019 262.87)',
      borderColor: 'var(--color-gray-200)',
      activeColor: 'var(--color-gray-400)',
    },
    {
      label: 'Red',
      color: 'oklch(0.627 0.182 27.014)',
      borderColor: 'var(--color-red-200)',
      activeColor: 'var(--color-red-400)',
    },
    {
      label: 'Orange',
      color: 'oklch(0.695 0.191 40.971)',
      borderColor: 'var(--color-orange-200)',
      activeColor: 'var(--color-orange-400)',
    },
    {
      label: 'Yellow',
      color: 'oklch(0.806 0.201 93.555)',
      borderColor: 'var(--color-yellow-200)',
      activeColor: 'var(--color-yellow-400)',
    },
    {
      label: 'Green',
      color: 'oklch(0.736 0.177 142.73)',
      borderColor: 'var(--color-green-200)',
      activeColor: 'var(--color-green-400)',
    },
    {
      label: 'Blue',
      color: 'oklch(0.647 0.205 263.821)',
      borderColor: 'var(--color-blue-200)',
      activeColor: 'var(--color-blue-400)',
    },
    {
      label: 'Violet',
      color: 'oklch(0.636 0.22 295.556)',
      borderColor: 'var(--color-purple-200)',
      activeColor: 'var(--color-purple-400)',
    },
    {
      label: 'Pink',
      color: 'oklch(0.647 0.22 332.77)',
      borderColor: 'var(--color-pink-200)',
      activeColor: 'var(--color-pink-400)',
    },
    {
      label: 'Rose',
      color: 'oklch(0.637 0.199 15.743)',
      borderColor: 'var(--color-rose-200)',
      activeColor: 'var(--color-rose-400)',
    },
  ];

  const backgroundColors = [
    {
      label: 'Default',
      color: 'transparent',
      borderColor: 'var(--color-gray-100)',
      activeColor: 'var(--color-gray-400)',
    },
    {
      label: 'Gray',
      color: 'oklch(0.967 0.003 264.542)',
      borderColor: 'var(--color-gray-200)',
      activeColor: 'var(--color-gray-400)',
    },
    {
      label: 'Red',
      color: 'oklch(0.936 0.032 17.717)',
      borderColor: 'var(--color-red-200)',
      activeColor: 'var(--color-red-400)',
    },
    {
      label: 'Orange',
      color: 'oklch(0.954 0.038 75.164)',
      borderColor: 'var(--color-orange-200)',
      activeColor: 'var(--color-orange-400)',
    },

    {
      label: 'Yellow',
      color: 'oklch(0.973 0.071 103.193)',
      borderColor: 'var(--color-yellow-200)',
      activeColor: 'var(--color-yellow-400)',
    },
    {
      label: 'Green',
      color: 'oklch(0.962 0.044 156.743)',
      borderColor: 'var(--color-green-200)',
      activeColor: 'var(--color-green-400)',
    },

    {
      label: 'Blue',
      color: 'oklch(0.932 0.032 255.585)',
      borderColor: 'var(--color-blue-200)',
      activeColor: 'var(--color-blue-400)',
    },

    {
      label: 'Violet',
      color: 'oklch(0.943 0.029 294.588)',
      borderColor: 'var(--color-purple-200)',
      activeColor: 'var(--color-purple-400)',
    },

    {
      label: 'Pink',
      color: 'oklch(0.948 0.028 342.258)',
      borderColor: 'var(--color-pink-200)',
      activeColor: 'var(--color-pink-400)',
    },
    {
      label: 'Rose',
      color: 'oklch(0.941 0.03 12.58)',
      borderColor: 'var(--color-rose-200)',
      activeColor: 'var(--color-rose-400)',
    },
  ];

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor],
  );

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value });
    },
    [applyStyleText],
  );

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ 'background-color': value });
    },
    [applyStyleText],
  );

  const isActiveColor = (color1: string, color2: string) => {
    return color1 === color2;
  };

  return (
    <DropdownMenu isOpen={isOpen} onOpenChange={(state) => setIsOpen(!state)}>
      <DropdownMenu.Trigger className="ring-0 hover:ring-0! p-0! rounded-lg!">
        <Tooltip
          shortcuts={['⌘', 'H']}
          trigger={
            <div className="flex items-center justify-center gap-1 h-8 rounded-lg hover:bg-neutral-100 px-2">
              <div
                className="size-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(45deg, rgb(110, 182, 242) 0%, rgb(168, 85, 247) 35%, rgb(234, 88, 12) 65%, rgb(234, 179, 8) 100%)',
                }}
              ></div>
              <ChevronDown
                color={hasTextHighlight ? 'var(--color-orange-600)' : 'var(--color-gray-600)'}
                size={16}
              />
            </div>
          }
          content="Text Highlight"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content withMenu={false}>
        <div className="p-4 flex flex-col gap-3 bg-white rounded-lg shadow-1 max-w-[200px]">
          <div className="flex gap-2 flex-col">
            <h4 className="text-sm text-neutral-600 font-semibold">Text color</h4>
            <div className="grid grid-cols-5 gap-2">
              {foregroundColors.map((color, index) => {
                const isActive = isActiveColor(color.color, textColor);
                return (
                  <Tooltip
                    key={index}
                    trigger={
                      <Button
                        key={index}
                        preventFocusOnPress
                        onPress={() => {
                          onFontColorSelect(isActive ? 'currentColor' : color.color);
                        }}
                        style={
                          {
                            boxShadow: isActive
                              ? `0 0 0 2px ${color.activeColor}`
                              : `0 0 0 1px ${color.borderColor}`,
                          } as React.CSSProperties
                        }
                        className="w-8 h-8 ring-1 rounded-md flex items-center justify-center"
                      >
                        <Ampersand color={color.color} size={16} />
                      </Button>
                    }
                    content={`${color.label} text`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 flex-col">
            <h4 className="text-sm text-neutral-600 font-semibold">Background color</h4>
            <div className="grid grid-cols-5 gap-2">
              {backgroundColors.map((color, index) => {
                const isActive = isActiveColor(color.color, backgroundColor);
                return (
                  <Tooltip
                    key={index}
                    trigger={
                      <Button
                        key={index}
                        preventFocusOnPress
                        type="button"
                        onPress={() => onBgColorSelect(isActive ? 'transparent' : color.color)}
                        style={
                          {
                            background: color.color,
                            boxShadow: isActive
                              ? `0 0 0 2px ${color.activeColor}`
                              : `0 0 0 1px ${color.borderColor}`,
                          } as React.CSSProperties
                        }
                        className="w-8 h-8 rounded-md flex items-center justify-center"
                      />
                    }
                    content={`${color.label} background`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
