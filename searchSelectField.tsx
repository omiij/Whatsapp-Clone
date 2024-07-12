//reference link:-https://www.npmjs.com/package/react-searchable-select-mui
/*eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { useField } from 'formik';
import { BootstrapSelect } from './SelectField';
import {
  ClickAwayListener,
  FormControl,
  FormControlProps,
  FormHelperText,
  FormHelperTextProps,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  ListItem,
  MenuItem,
  SelectChangeEvent,
  SelectProps,
  Typography,
} from '@mui/material';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';

export interface IKeyValuePair {
  key: any;
  value: string;
}

interface IBaseProps {
  label?: string;
  searchFieldPlaceholder?: string;
  removeSelectionText?: string;
  helperText?: string;
  formControlProps?: FormControlProps;
  formHelperTextProps?: FormHelperTextProps;
  maxVisibleOptions?: number;
  showAll?: boolean;
  noRemoveSelectionOption?: boolean;
}

interface IDefaultKeyValuePair extends IBaseProps {
  options: IKeyValuePair[];
}

interface ICustomKeyValuePair extends IBaseProps {
  keyPropFn: (option: IKeyValuePair | any) => any;
  valuePropFn: (option: IKeyValuePair | any) => string | number;
  options: any[];
}

export type SearchableSelectProps = (IDefaultKeyValuePair | ICustomKeyValuePair) & SelectProps;

interface IClickAwayListenerWrapperProps {
  searchFieldPlaceholder: string | undefined;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

// Needed because otherwise MUI-Select passes down props to the ClickAwayListeneder
// This Component ignores those props
// Additionally it has to be a React.Component instead of a functional component
// Since functional components can't have a "ref" startAdornment?: JSX.Element;  IClickAwayListenerWrapperProps
export function SearchFieldWrapper({
  searchFieldPlaceholder,
  setQuery,
}: IClickAwayListenerWrapperProps & {
  searchFieldPlaceholder: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}): JSX.Element {
  return (
    <ClickAwayListener onClickAway={() => null}>
      <ListItem>
        <Input
          id="input-with-icon-adornment"
          placeholder={searchFieldPlaceholder || 'Search...'}
          autoComplete="off"
          fullWidth
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyDown={(e) => {
            // Prevent MUI-Autoselect while typing
            e.stopPropagation();
          }}
          startAdornment={
            <InputAdornment position="start">
              <IconButton>
                <SearchSharpIcon sx={{ color: 'primary.main' }} />
              </IconButton>
            </InputAdornment>
          }
        />
      </ListItem>
    </ClickAwayListener>
  );
}

export function renderFilteredOptions(
  items: { key: string | number; value: string | number }[],
  query: string
): any {
  const filteredOptions =
    items &&
    items.filter &&
    items.filter((item: IKeyValuePair | any) => {
      return (
        !item.key ||
        (item.key && item.key.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1)
      );
    });
  return filteredOptions?.length > 0 ? (
    filteredOptions.map(
      (
        option:
          | {
              key: string | number;
              value: string | number;
            }
          | any,
        index: number
      ) => {
        return (
          <MenuItem
            key={index}
            value={option.value}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: 'common.black',
              '&.Mui-selected,&.Mui-selected:hover': { backgroundColor: 'unset' },
            }}>
            <Typography
              sx={{ fontSize: 14, whiteSpace: { xs: 'pre-wrap', sm: 'nowrap' } }}
              component="span">
              {option.key}
            </Typography>
          </MenuItem>
        );
      }
    )
  ) : (
    <Typography
      sx={{
        paddingTop: '6px',
        paddingBottom: '6px',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        paddingLeft: '16px',
        paddingRight: '16px',
        fontSize: '14px',
        fontWeight: 500,
      }}>
      No Results found
    </Typography>
  );
}

export function SearchableSelect({
  name,
  label,
  items,
  onChange,
  disabled = false,
  searchFieldPlaceholder = '',
  applyRenderValue = false,
  ...props
}: SelectProps & {
  name: string;
  label?: string;
  items: { key: string | number; value: string | number }[];
  onChange?: (event: SelectChangeEvent<unknown>) => void;
  disabled?: boolean;
  searchFieldPlaceholder?: string;
  applyRenderValue?: boolean;
}): JSX.Element {
  const [query, setQuery] = React.useState('');
  const [field, meta] = useField(name);
  onChange = onChange || field.onChange;
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <FormControl fullWidth sx={{ my: { xs: 1, sm: 1, md: 2 } }}>
      {label && (
        <InputLabel
          shrink
          // htmlFor={id}
          sx={{ transform: 'unset', fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.7)' }}>
          {label}
        </InputLabel>
      )}
      <BootstrapSelect
        sx={{
          mt: '32px',
          ...props.sx,
          '& .Mui-disabled': {
            cursor: !disabled ? 'pointer' : 'not-allowed !important',
            pointerEvents: 'all',
          },
          '& .MuiSelect-icon.Mui-disabled': {
            display: 'none',
          },
        }}
        MenuProps={{
          sx: {
            '.MuiPaper-root ': {
              maxWidth: { xs: '100%', sm: '31%', md: '26%' },
              maxHeight: '20%',
              overflowX: 'auto',
            },
          },
          disableAutoFocusItem: true,
          MenuListProps: {
            disableListWrap: true,
          },
        }}
        onClose={() => {
          setQuery('');
        }}
        placeholder="ssss"
        {...field}
        onChange={onChange}
        disabled={disabled}
        renderValue={(Selectedvalue) => {
          const selectedKey = items?.find((_item) => _item.value == Selectedvalue);
          return (
            <Typography
              sx={{ fontSize: 14, whiteSpace: { xs: 'pre-wrap', sm: 'nowrap' } }}
              component="span">
              {applyRenderValue
                ? (selectedKey?.key as unknown as string)?.split('- ')[1]
                : (selectedKey?.key as unknown as string)}
            </Typography>
          );
        }}
        {...props}>
        <SearchFieldWrapper searchFieldPlaceholder={searchFieldPlaceholder} setQuery={setQuery} />
        {renderFilteredOptions(items, query)}
      </BootstrapSelect>
      {errorText && (
        <FormHelperText error sx={{ marginLeft: 'unset' }}>
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
