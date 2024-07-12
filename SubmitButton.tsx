import LoadingButton from '@mui/lab/LoadingButton';
import { useFormikContext } from 'formik';

const MFSubmitButton = ({
  label = 'Submit',
  variant = 'contained',
  fullWidth = true,
  loadingEnable = false,
  ...props
}: {
  label: string;
  variant?: 'contained' | 'text' | 'outlined' | undefined;
  fullWidth?: boolean;
  loadingEnable?: boolean;
}): JSX.Element => {
  const formikContext = useFormikContext();
  const { isSubmitting: loading } = formikContext;
  return (
    <LoadingButton
      loadingPosition="start"
      type="submit"
      loading={loading || loadingEnable}
      variant={variant}
      sx={{
        mt: 3,
        mb: 2,
        color: variant === 'contained' ? 'common.white' : 'primary.main',
        lineHeight: 1.5,
        fontSize: 14,
      }}
      fullWidth={fullWidth}
      {...props}>
      {label}
    </LoadingButton>
  );
  // return (
  //   <Button
  //     type="submit"
  //     fullWidth={fullWidth}
  //     variant={variant}
  //     sx={{ mt: 3, mb: 2, color: 'common.white', lineHeight: 1.5, fontSize: 14 }}
  //     disabled={disabled}
  //     {...props}>
  //     {l}
  //   </Button>
  // );
};
export default MFSubmitButton;
