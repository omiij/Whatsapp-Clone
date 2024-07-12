import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useField } from 'formik';
import { ChangeEvent } from 'react';
import { Box, FormControl, FormHelperText, FormLabel, Typography } from '@mui/material';
import { SxProps } from '@mui/system';

interface StyledFormControlLabelProps extends FormControlLabelProps {
  checked: boolean;
}

const StyledFormControlLabel = styled((props: StyledFormControlLabelProps) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  paddingRight: '10px',
  borderRadius: '12px',
  backgroundColor: 'rgba(240, 242, 245, 0.8)',
  border: '1px solid transparent',
  color: 'rgba(38, 48, 60, 0.6)',
  marginLeft: 0,
  marginBottom: '10px',
  '&': checked && {
    backgroundColor: 'rgba(0, 87, 155, 0.0535)',
    border: '1px solid #00579B',
  },
  '.MuiFormControlLabel-label': {
    fontWeight: 500,
    fontSize: '14px',
    '&': checked && {
      color: theme.palette.primary.main,
    },
  },
}));

function MyFormControlLabel(props: FormControlLabelProps) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

export default function UseRadioGroup({
  name,
  formLabel,
  defaultValue,
  items,
  labelColor = 'rgba(38, 48, 60, 0.7)',
  value = '',
  disabled = false,
  onChange,
}: {
  name: string;
  formLabel?: string;
  defaultValue?: string | boolean;
  labelColor?: string;
  items: { label: string; value: string | boolean | number }[];
  value?: boolean | string | undefined | number;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  const fieldValue = value ? value : field.value;
  onChange = onChange || field.onChange;

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      {formLabel && (
        <FormLabel
          component="legend"
          sx={{ mb: 2, fontWeight: 500, fontSize: 14, color: labelColor }}>
          {formLabel}
        </FormLabel>
      )}
      <RadioGroup
        row
        defaultValue={defaultValue}
        {...field}
        onChange={onChange}
        value={fieldValue}
        sx={{
          '& .Mui-disabled': {
            cursor: !disabled ? 'pointer' : 'not-allowed !important',
            pointerEvents: 'all',
          },
        }}>
        {items.map((item, index) => (
          <MyFormControlLabel
            key={index}
            label={item.label}
            value={item.value}
            disabled={disabled}
            control={<Radio disableRipple size="small" sx={{ ':hover': { background: 'none' } }} />}
          />
        ))}
      </RadioGroup>
      {errorText && (
        <FormHelperText error sx={{ marginLeft: 'unset' }}>
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const StyledFormControlLabelr = styled((props: StyledFormControlLabelProps) => (
  <FormControlLabel {...props} />
))(({ theme, checked }) => ({
  paddingRight: '10px',
  borderRadius: '12px',
  marginLeft: 0,
  marginBottom: '10px',
  '.MuiFormControlLabel-label': {
    fontWeight: 500,
    fontSize: '14px',
    '&': checked && {
      color: theme.palette.primary.main,
    },
  },
}));

export function MyFormControlLabels(props: FormControlLabelProps): JSX.Element {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabelr checked={checked} {...props} />;
}

export function UseRadioGroupTransparent({
  name,
  defaultValue,
  items,
  value = '',
  disabled = false,
  formLabel,
  onChange,
  sx,
  TableRender,
  relatedPartyLimit,
}: {
  name: string;
  defaultValue?: string | boolean;
  // eslint-disable-next-line
  items: { label: any; value: string | boolean | number }[];
  value?: boolean | string | undefined | number;
  disabled?: boolean;
  formLabel?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps;
  // eslint-disable-next-line
  TableRender?: any;
  relatedPartyLimit?: string;
}): JSX.Element {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : '';

  const fieldValue = value ? value : field.value;
  onChange = onChange || field.onChange;

  return (
    <FormControl component="fieldset" sx={{ width: '100%', ...sx }}>
      {formLabel && (
        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500, fontSize: 14 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#131836' }}>
            {formLabel}
          </Typography>
        </FormLabel>
      )}
      <RadioGroup
        row
        defaultValue={defaultValue}
        {...field}
        onChange={onChange}
        value={fieldValue}
        sx={{
          '& .Mui-disabled': {
            cursor: !disabled ? 'pointer' : 'not-allowed !important',
            pointerEvents: 'all',
          },
        }}>
        {items.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
            <MyFormControlLabels
              label={item.label}
              value={item.value}
              disabled={disabled}
              control={
                <Radio disableRipple size="small" sx={{ ':hover': { background: 'none' } }} />
              }
            />
            {index === 0 && relatedPartyLimit === 'consent' && (
              <Box sx={{ mt: 4, mb: { xs: 4, sm: 0 } }}>{TableRender} </Box>
            )}
          </Box>
        ))}
      </RadioGroup>
      {errorText && (
        <FormHelperText error sx={{ marginLeft: 'unset' }}>
          {errorText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
