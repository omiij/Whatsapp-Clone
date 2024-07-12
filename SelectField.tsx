import { styled } from '@mui/material/styles';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Typography,
} from '@mui/material';
import { useField } from 'formik';

export const BootstrapSelect = styled(Select)(({ theme }) => ({
  '&.MuiInputBase-root': {
    '& .MuiSelect-select': {
      // color: '#8692A6',
      border: '1px solid #DDEAF3',
      fontSize: 16,
      padding: '10px 12px',
      borderRadius: 4,
      // transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
      // '&:focus': {
      //   boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      //   borderColor: theme.palette.primary.main,
      // },
    },
  },
  '.MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#DDEAF3',
  },
  '&.Mui-focused,&:hover': {
    '.MuiOutlinedInput-notchedOutline': {
      borderWidth: '1px',
      borderColor: theme.palette.primary.main,
    },
  },
  svg: {
    color: '#337FC9',
  },
}));

export default function MFSelectField({
  name,
  label,
  items,
  onChange,
  disabled = false,
  indexing = false,
  applyLabelStyles = false,
  ...rest
}: SelectProps & {
  name: string;
  label?: string;
  items: { key: string | number; value: string | number }[];
  onChange?: (event: SelectChangeEvent<unknown>) => void;
  disabled?: boolean;
  indexing?: boolean;
  applyLabelStyles?: boolean;
}): JSX.Element {
  const [field, meta] = useField(name);
  onChange = onChange || field.onChange;
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <FormControl fullWidth sx={{ my: { xs: 1, sm: 1, md: 2 } }}>
      {label && (
        <InputLabel
          shrink
          // htmlFor={id}
          sx={{
            transform: 'unset',
            fontSize: 14,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.7)',
            whiteSpace: applyLabelStyles ? 'normal' : 'nowrap',
            position: applyLabelStyles ? 'relative' : 'absolute',
          }}>
          {label}
        </InputLabel>
      )}
      <BootstrapSelect
        sx={{
          mt: applyLabelStyles ? '10px' : '32px',
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
        }}
        placeholder="ssss"
        {...field}
        {...rest}
        onChange={onChange}
        disabled={disabled}>
        {items.map((item, index: number) => (
          <MenuItem
            key={item.key}
            value={item.value}
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: 'common.black',
              '&.Mui-selected,&.Mui-selected:hover': { backgroundColor: 'unset' },
            }}>
            {indexing ? (
              <>
                <Typography
                  sx={{ color: 'primary.main', fontWeight: 500, fontSize: 14 }}
                  component="span">
                  C{index < 9 ? '0' + (index + 1) : index + 1}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'common.black',
                    '&.Mui-selected,&.Mui-selected:hover': { backgroundColor: 'unset' },
                  }}
                  component="span">
                  {item.key}
                </Typography>
              </>
            ) : (
              <Typography sx={{ whiteSpace: { xs: 'pre-wrap', sm: 'nowrap' } }} component="span">
                {item.key}
              </Typography>
            )}
          </MenuItem>
        ))}
      </BootstrapSelect>
      {errorText && (
        <FormHelperText error sx={{ marginLeft: 'unset' }}>
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
