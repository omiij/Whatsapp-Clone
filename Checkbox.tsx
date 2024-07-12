import {
  FormHelperText,
  CheckboxProps,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import { useField } from 'formik';

export const MFCheckbox = function ({
  label,
  name,
  onChange,
  checked,
  sx,
  ...props
}: CheckboxProps & { label: string; name: string }): JSX.Element {
  const [field, meta] = useField(name);
  checked = checked || field.value;
  onChange = onChange || field.onChange;
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox {...field} {...props} checked={checked} onChange={onChange} />}
        name={name}
        label={label}
        sx={{
          '& .Mui-disabled': {
            cursor: !props.disabled ? 'pointer' : 'not-allowed !important',
            pointerEvents: 'all',
          },
          ...sx,
        }}
      />
      <FormHelperText error sx={{ marginLeft: 'unset' }}>
        {errorText}
      </FormHelperText>
    </FormGroup>
  );
};

export default MFCheckbox;
