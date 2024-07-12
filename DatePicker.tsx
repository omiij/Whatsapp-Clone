import { FormControl, FormHelperText, InputLabel, TextField, Theme } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import KeyboardArrowRightSharpIcon from '@mui/icons-material/KeyboardArrowRightSharp';
import { SxProps } from '@mui/system';
import { useField, useFormikContext } from 'formik';
import momentTimezone from 'moment-timezone';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { timeZoneFromServer } from '../../utils/constant';
const defaultTextFieldStyles: SxProps<Theme> = {
  'label + &': {
    mt: 4,
  },
  '& .MuiInputBase-root': {
    border: '1px solid #DDEAF3',
  },
  '& .MuiOutlinedInput-root': {
    position: 'relative',
    backgroundColor: 'common.white',
    border: '1px solid #DDEAF3',
    fontSize: 16,
    '&:hover': {
      borderColor: 'primary.main',
      '.MuiOutlinedInput-notchedOutline': {
        border: 0,
      },
    },
    '.MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '.MuiInputBase-input': {
      p: '10px 12px',
    },
    '&:focus-visible': {
      outline: 'none',
    },
  },
};

export const DatePicker = ({
  label = '',
  placeholder = '',
  name,
  inputLabelStyles,
  textFieldStyles = defaultTextFieldStyles,
  maxDate = new Date(),
  minDate,
  disabled = false,
  onClick,
}: {
  label?: string;
  placeholder: string;
  value?: string | null;
  onClick?: () => void;
  name: string;
  inputLabelStyles?: SxProps<Theme>;
  textFieldStyles?: SxProps<Theme>;
  maxDate?: Date;
  minDate?: Date;
  disabled?: boolean;
}): JSX.Element => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const { moment } = new AdapterMoment({ instance: momentTimezone });
  const onChange = (date: Date | null) => {
    setFieldValue(name, moment(date).format());
    onClick && onClick();
  };
  const errorText = meta.error && meta.touched ? meta.error : '';
  moment.tz.setDefault(timeZoneFromServer);
  momentTimezone.tz.setDefault(timeZoneFromServer);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormControl variant="outlined" fullWidth sx={{ my: { xs: 1, md: 2 } }}>
        <InputLabel shrink htmlFor="date-picker" sx={{ ...inputLabelStyles }}>
          {label}
        </InputLabel>
        <MobileDatePicker
          shouldDisableDate={(date) => {
            if (maxDate && moment(maxDate).isBefore(moment(date))) {
              return true;
            } else if (minDate && moment(minDate).isAfter(moment(date))) {
              return true;
            }
            return false;
          }}
          shouldDisableYear={(date) => {
            if (
              maxDate &&
              moment(new Date(maxDate).setFullYear(new Date(maxDate).getFullYear() + 1)).isBefore(
                moment(date)
              )
            ) {
              return true;
            } else if (minDate && moment(minDate).isAfter(moment(date))) {
              return true;
            }
            return false;
          }}
          components={{ OpenPickerIcon: KeyboardArrowRightSharpIcon }}
          value={field.value}
          inputFormat="DD/MM/yyyy"
          onChange={onChange}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              fullWidth
              id="date-picker"
              placeholder={placeholder}
              {...params}
              sx={{
                ...textFieldStyles,
                '& .Mui-disabled': {
                  cursor: !disabled ? 'text' : 'not-allowed !important',
                  pointerEvents: 'all',
                },
              }}
            />
          )}
          disableCloseOnSelect={false}
          showToolbar={false}
        />
        {errorText && (
          <FormHelperText error sx={{ marginLeft: 'unset' }}>
            {errorText}
          </FormHelperText>
        )}
      </FormControl>
    </LocalizationProvider>
  );
};
