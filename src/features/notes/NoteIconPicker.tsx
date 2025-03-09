import { FC } from 'react';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { ScrollTextIcon } from 'lucide-react';

import { DropdownMenu } from '@/components/DropdownMenu';

import { useUpdateNote } from '@/services/db/notes';
import { Note, NoteEmoji } from '@/services/db/types';

interface NoteIconPickerProps {
  note: Note;
}

export const NoteIconPicker = ({ note }: NoteIconPickerProps) => {
  const { mutate: updateNote } = useUpdateNote({ noteId: note.id });

  const handleOnEmojiSelect = (emoji: NoteEmoji) => {
    const emojiString = JSON.stringify({
      shortcodes: emoji.shortcodes,
      id: emoji.id,
      native: emoji.native,
    });

    updateNote({
      id: note.id,
      entry: {
        icon: emojiString,
      },
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenu.Trigger className="rounded-full!">
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <EmojiRenderer emoji={note.icon} size={56} placeholderSize={53} />
          </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content className="w-full">
          <Picker data={data} onEmojiSelect={handleOnEmojiSelect} />
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

interface EmojiRendererProps {
  emoji: string | null;
  size?: number;
  placeholderSize?: number;
}

export const EmojiRenderer: FC<EmojiRendererProps> = ({
  emoji,
  size = 14,
  placeholderSize = 16,
}) => {
  const icon = emoji ? JSON.parse(emoji) : null;

  return (
    <>
      {icon ? (
        // @ts-ignore
        <em-emoji size={size} shortcodes={icon.shortcodes}></em-emoji>
      ) : (
        <ScrollTextIcon
          size={placeholderSize}
          strokeWidth={2}
          className="text-stone-500 dark:text-stone-200"
        />
      )}
    </>
  );
};
