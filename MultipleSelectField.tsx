/* eslint-disable @typescript-eslint/no-explicit-any*/

import { useField, useFormikContext } from 'formik';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  SelectProps,
  SelectChangeEvent,
  Typography,
  Badge,
  FormControlProps,
  FormHelperTextProps,
  ClickAwayListener,
  ListItem,
  Input,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { BootstrapSelect } from './SelectField';
import { useState } from 'react';
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
  query: string,
  fieldValue: string | string[] | number[]
): any {
  const filteredOptions =
    items &&
    items.filter &&
    items.filter((item: IKeyValuePair | any) => {
      return (
        !item.value ||
        (item.value && item.value.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1)
      );
    });

  return filteredOptions?.length > 0
    ? filteredOptions.map((option: { key: string | number; value: string | number }) => {
        return (
          <MenuItem key={option.key} value={option.key} sx={{ py: { xs: 1, sm: 0 } }}>
            <Checkbox
              checked={fieldValue?.indexOf(option.key as never) > -1}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: 'common.black',
                '&.Mui-selected,&.Mui-selected:hover': { backgroundColor: 'unset' },
              }}
            />
            <ListItemText
              primary={option.value}
              sx={{
                '& .MuiTypography-root': {
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'common.black',
                  whiteSpace: { xs: 'pre-wrap', sm: 'nowrap' },
                },
              }}
            />
          </MenuItem>
        );
      })
    : query && (
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

export const MultipleSelect = ({
  name,
  label,
  items,
  renderText = '',
  disabled = false,
  onChange,
  ...rest
}: SelectProps & {
  name: string;
  label: string;
  items: { key: string | number; value: string | number }[];
  renderText?: string;
  disabled?: boolean;
  onChange?: (event: SelectChangeEvent<unknown>) => void;
}): JSX.Element => {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const { setFieldValue } = useFormikContext();
  const [query, setQuery] = useState('');

  const handleChange = (e: SelectChangeEvent<unknown>): void => {
    const { target: fieldTarget } = e;
    const { value } = fieldTarget;
    if ((value as string[] | number[])[(value as string[] | number[])?.length - 1] === 'all') {
      //['all', ...items.map((item) => item.key)]
      setFieldValue(
        name,
        field.value?.length === items.map((item) => item.key).length
          ? []
          : items.map((item) => item.key)
      );
      return;
    }
    setFieldValue(name, value);
  };

  return (
    <FormControl fullWidth sx={{ my: { xs: 1, sm: 1, md: 2 } }}>
      <InputLabel
        shrink
        // htmlFor={id}
        sx={{ transform: 'unset', fontSize: 14, fontWeight: 500, color: 'rgba(0,0,0,0.7)' }}>
        {label}
      </InputLabel>
      <BootstrapSelect
        sx={{
          mt: '32px',
          ...rest.sx,
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
        multiple
        {...field}
        {...rest}
        renderValue={(selected) => {
          const selectedKeys = [];
          for (let i = 0; i < (selected as string[]).length; i++) {
            const key = (selected as unknown as string[])[i];
            const value = items.find(
              (_ele: { key: string | number; value: string | number }) => _ele.key === key
            )?.value;
            if (value) {
              selectedKeys.push(value);
            }
          }
          //   return (selectedKeys as unknown[] as string[] | number[]).join(', ');
          return renderText ? (
            <Typography component={'span'}>
              {renderText}
              <Badge badgeContent={selectedKeys.length} color="info" sx={{ pl: 3 }}></Badge>
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedKeys.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  sx={{ fontSize: 14, fontWeight: 500, color: 'common.black' }}
                />
              ))}
            </Box>
          );
        }}
        value={field.value || []}
        disabled={disabled}
        onChange={onChange || handleChange}>
        {items?.length > 0 && (
          <SearchFieldWrapper searchFieldPlaceholder={''} setQuery={setQuery} />
        )}
        {/* Select All option*/}
        {items?.length > 0 && !query && (
          <MenuItem value="all" sx={{ py: 0 }}>
            <Checkbox
              checked={items.length > 0 && field.value?.length === items.length}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: 'common.black',
                '&.Mui-selected,&.Mui-selected:hover': { backgroundColor: 'unset' },
              }}
            />
            <ListItemText
              primary="Select All"
              sx={{
                '& .MuiTypography-root': { fontSize: 14, fontWeight: 500, color: 'common.black' },
              }}
            />
          </MenuItem>
        )}

        {/* drop down options excluding Select All option*/}
        {renderFilteredOptions(items, query, field.value)}
      </BootstrapSelect>
      {errorText && (
        <FormHelperText error sx={{ marginLeft: 'unset' }}>
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
