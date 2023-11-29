import { tagsState } from '@/store/tags-state';
import { observer } from 'mobx-react-lite';
import Select, { MultiValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type TagSelectorProps = {
  isCreatable?: boolean;
  tags: any[];
  onTagSelect: (tag: MultiValue<string>) => void;
};

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];
export const TagSelector = observer((props: TagSelectorProps) => {
  const { isCreatable = true, tags, onTagSelect, ...rest } = props;

  return (
    <div className="tag-selector">
      <CreatableSelect
        value={tags}
        onCreateOption={(newValue: string) => {
          const id = tagsState.createNewTag(newValue);
          onTagSelect([...tags, id]);
        }}
        isMulti
        onChange={(newValue) => {
          const ids = newValue.map((option) => option.value);
          onTagSelect(ids);
        }}
        options={tagsState.tags}
        {...rest}
      />

      {/* {isCreatable ? (
        <CreatableSelect
          value={valueTags}
          onCreateOption={(newValue: string) => {
            const id = tagsState.createNewTag(newValue);
            onTagSelect([id]);
          }}
          isMulti
          onChange={(newValue) => {
            const ids = newValue.map((option) => option.value);
            // console.log({ ids });
            onTagSelect(ids);
          }}
          options={tagsState.tags}
        />
      ) 
      : (
        <Select isMulti options={tagsState.tags} />
      )} */}
    </div>
  );
});
