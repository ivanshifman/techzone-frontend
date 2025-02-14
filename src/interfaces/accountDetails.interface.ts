export interface IAccountDetailsProps {
  user: Record<string, any>;
  dispatch: any;
  token: any;
  state: any;
}

export interface FormValues {
  name: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
