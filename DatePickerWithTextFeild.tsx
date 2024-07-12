/* eslint-disable @typescript-eslint/no-explicit-any*/

import {
  CardMedia,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  Theme,
} from '@mui/material';
import { LocalizationProvider, DesktopDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { SxProps } from '@mui/system';
import { useField } from 'formik';
import { useEffect, useRef, useState } from 'react';
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

export const TextDatePicker = ({
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
  const [field, meta, { setValue }] = useField(name);
  const [error, setError] = useState(false);
  const { moment } = new AdapterMoment({ instance: momentTimezone });

  const invalidDate = (date: any): void => {
    !date
      ? setError(false)
      : date.toString().toLowerCase() === 'invalid date'
      ? setError(true)
      : setError(false);
  };

  const onChange = (date: any) => {
    invalidDate(date);
    const date1 = moment(new Date());
    const date2 = date
      ? moment(date).get('hours') === 0 &&
        moment(date).get('minutes') === 0 &&
        moment(date).get('seconds') === 0
        ? moment(date)
            .add(date1.get('hours'), 'hours')
            .add(date1.get('minutes'), 'minutes')
            .add(date1.get('seconds'), 'seconds')
            .format()
        : moment(date).format()
      : null;
    setValue(date2);
    invalidDate(date2);
    onClick && onClick();
  };
  const errorText = error ? 'Invalid Date' : meta.error && meta.touched ? meta.error : '';
  moment.tz.setDefault(timeZoneFromServer);
  momentTimezone.tz.setDefault(timeZoneFromServer);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormControl variant="outlined" fullWidth sx={{ my: { xs: 1, md: 2 } }}>
        <InputLabel shrink htmlFor="date-picker" sx={{ ...inputLabelStyles }}>
          {label}
        </InputLabel>
        <DesktopDatePicker
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
          components={{
            OpenPickerIcon: () => <CardMedia component="img" src="/images/calender.svg" />,
          }}
          componentsProps={{}}
          value={field.value}
          inputFormat="DD/MM/yyyy"
          onChange={onChange}
          disabled={disabled}
          views={['year', 'month', 'day']}
          InputAdornmentProps={{ position: 'start' }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              id="date-picker"
              placeholder={placeholder}
              sx={{
                ...textFieldStyles,
                display: 'flex',
                flexDirection: 'row-reverse',
                '& .Mui-disabled': {
                  cursor: !disabled ? 'text' : 'not-allowed !important',
                  pointerEvents: 'all',
                },
              }}
              disabled={disabled}
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

export const MinorTextDatePicker = ({
  label = '',
  placeholder = '',
  name,
  // eslint-disable-next-line
  inputLabelStyles,
  textFieldStyles = defaultTextFieldStyles,
  maxDate = new Date(),
  minDate,
  disabled = false,
  onClick,
  previousDob,
  setMinorDataFetched,
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
  previousDob?: any;
  setMinorDataFetched?: any;
}): JSX.Element => {
  const [focus, setFocus] = useState(false);
  const [field, meta, { setValue }] = useField(name);
  const [error, setError] = useState(false);
  const onChange = (date: any) => {
    date == 'Invalid Date' && setError(true);
    date != 'Invalid Date' && setError(false);
    setValue(date);
    onClick && onClick();
    if (
      date != 'Invalid Date' &&
      new Date(date).toISOString() !== new Date(previousDob).toISOString()
    ) {
      setMinorDataFetched('changed');
    } else {
      setMinorDataFetched('fetched');
    }
  };
  const errorText = error ? 'Invalid Date' : meta.error && meta.touched ? meta.error : '';
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.addEventListener('wheel', (e) => e.preventDefault());
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl variant="outlined" fullWidth sx={{ my: { xs: 1, md: 2 } }}>
        <InputLabel
          shrink
          htmlFor="date-picker-input"
          sx={{
            transform: 'unset',
            fontSize: 14,
            fontWeight: 500,
            color: focus ? '#2057A6' : 'rgba(0,0,0,0.7)',
            // ...inputLabelStyles,
          }}>
          {label}
        </InputLabel>
        <DesktopDatePicker
          ref={inputRef}
          // id={'date-picker-input'}
          maxDate={maxDate}
          minDate={minDate}
          components={{
            OpenPickerIcon: () => <CardMedia component="img" src="/images/calender.svg" />,
          }}
          componentsProps={{}}
          value={field.value}
          inputFormat="dd/MM/yyyy"
          onChange={onChange}
          disabled={disabled}
          views={['year', 'month', 'day']}
          InputAdornmentProps={{ position: 'start' }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              id="date-picker-input"
              placeholder={placeholder}
              sx={{
                ...textFieldStyles,
                display: 'flex',
                flexDirection: 'row-reverse',
                '& .Mui-disabled': {
                  cursor: !disabled ? 'text' : 'not-allowed !important',
                  pointerEvents: 'all',
                },
                '& .Mui-blur': {},
              }}
              onSelect={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              disabled={disabled}
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
