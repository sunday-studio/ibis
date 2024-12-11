import { RefObject } from 'react';

import { observer } from 'mobx-react-lite';
import { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { tagsState } from '@/store/tags-state';

type TagSelectorProps = {
  isCreatable?: boolean;
  tags: any[];
  onTagSelect: (tag: MultiValue<string> | string[]) => void;
  containerRef?: RefObject<HTMLDivElement>;
};

export const TagSelector = observer((props: TagSelectorProps) => {
  const { isCreatable = true, tags, onTagSelect, containerRef, ...rest } = props;

  const currentTagsId = tags.map((a) => a.value);

  return (
    <div className="tag-selector" ref={containerRef}>
      <CreatableSelect
        value={tags}
        classNamePrefix="ibis-select"
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
