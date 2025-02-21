import { Tooltip } from '@/components/Tooltip';
import { DropdownMenu } from '@/components/DropdownMenu';
import { LexicalEditor } from 'lexical';
import { Ampersand, ChevronDown } from 'lucide-react';
import { FC } from 'react';

interface TextHighlightActionProps {
  editor: LexicalEditor;
}

export const TextHighlightAction: FC<TextHighlightActionProps> = ({ editor }) => {
  const foregroundColors = [
    {
      label: 'Default',
      color: '#000000',
    },
    {
      label: 'Gray',
      color: 'oklch(0.707 0.022 261.325)',
    },
    {
      label: 'Red',
      color: 'oklch(0.704 0.191 22.216)',
    },
    {
      label: 'Orange',
      color: '#f97316',
    },

    {
      label: 'Yellow',
      color: 'oklch(0.852 0.199 91.936)',
    },
    {
      label: 'Green',
      color: 'oklch(0.792 0.209 151.711)',
    },

    {
      label: 'Blue',
      color: 'oklch(0.707 0.165 254.624)',
    },

    {
      label: 'Violet',
      color: 'oklch(0.702 0.183 293.541)',
    },

    {
      label: 'Pink',
      color: 'oklch(0.718 0.202 349.761)',
    },
    {
      label: 'Rose',
      color: 'oklch(0.712 0.194 13.428)',
    },
  ];

  const backgroundColors = ['#f97316', '#ec4899', '#818cf8', '#6366f1', '#374151', '#111827'];

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Tooltip
          shortcuts={['⌘', 'H']}
          trigger={
            <div
              role="button"
              className="flex items-center justify-center gap-1 h-8 rounded-lg hover:bg-neutral-100 px-2"
            >
              <div
                className="size-4 rounded-full"
                style={{
                  background:
                    'linear-gradient(45deg, rgb(110, 182, 242) 0%, rgb(168, 85, 247) 35%, rgb(234, 88, 12) 65%, rgb(234, 179, 8) 100%)',
                }}
              ></div>
              <ChevronDown size={16} />
            </div>
          }
          content="Text Highlight"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content withMenu={false}>
        <div className="p-4 flex flex-col gap-3 bg-white rounded-lg shadow-1 max-w-[200px]">
          <div className="flex gap-1.5 flex-col">
            <h4 className="text-sm text-neutral-600 font-semibold">Text color</h4>
            <div className="grid grid-cols-5 gap-2">
              {foregroundColors.map((color, index) => (
                <Tooltip
                  key={index}
                  trigger={
                    <button
                      key={index}
                      type="button"
                      className="w-8 h-8 ring-1 ring-neutral-200 rounded-md flex items-center justify-center"
                    >
                      <Ampersand color={color.color} size={16} />
                    </button>
                  }
                  content={`${color.label} text`}
                ></Tooltip>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 flex-col">
            <h4 className="text-sm text-neutral-600 font-semibold">Background color</h4>
            <div className="grid grid-cols-5 gap-2">
              {foregroundColors.map((color, index) => (
                <Tooltip
                  key={index}
                  trigger={
                    <button
                      key={index}
                      type="button"
                      style={{ background: color.color } as React.CSSProperties}
                      className="w-8 h-8 rounded-md flex items-center justify-center"
                    ></button>
                  }
                  content={`${color.label} background`}
                ></Tooltip>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
