import { RefObject, forwardRef } from 'react';

import { tagsState } from '@/store/tags-state';
import { observer } from 'mobx-react-lite';
import Select, { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type TagSelectorProps = {
  isCreatable?: boolean;
  tags: any[];
  onTagSelect: (tag: MultiValue<string>) => void;
  containerRef?: RefObject<HTMLDivElement>;
};

export const TagSelector = observer((props: TagSelectorProps) => {
  const { isCreatable = true, tags, onTagSelect, containerRef, ...rest } = props;

  const currentTagsId = tags.map((a) => a.value);

  return (
    <div className="tag-selector" ref={containerRef}>
      <CreatableSelect
        value={tags}
        onCreateOption={(newValue: string) => {
          const id = tagsState.createNewTag(newValue);
          onTagSelect([...currentTagsId, id]);
        }}
        isMulti
        onChange={(newValue) => {
          const ids = newValue.map((option) => option.value);
          onTagSelect(ids);
        }}
        options={tagsState.tags}
        {...rest}
      />
    </div>
  );
});
