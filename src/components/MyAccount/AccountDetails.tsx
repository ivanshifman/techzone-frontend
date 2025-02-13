import { FC, useState } from "react";
import { Button } from "react-bootstrap";
import { Card, Form } from "react-bootstrap";
import { Users } from "../../services/user.service";
import { ResponsePayload } from "../../services/api";
import { useForm } from "react-hook-form";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { jwtDecode } from "jwt-decode";

interface IAccountDetailsProps {
  user: Record<string, any>;
  dispatch: any;
  token: any;
  state: any;
}

interface CustomJwtPayload {
  id: string;
  type: string;
  iat: number;
  exp: number;
}

interface FormValues {
  name: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountDetails: FC<IAccountDetailsProps> = ({
  user,
  dispatch,
  token,
  state,
}) => {
  const decodedToken = jwtDecode<CustomJwtPayload>(token);
  console.log("decodedToken", decodedToken);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateUserAccount = async (data: FormValues) => {
    try {
      const { name, oldPassword, newPassword } = data;
      setIsLoading(true);

      const payload: Partial<FormValues> = { name };
      if (oldPassword && newPassword) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      const { success, message, result }: ResponsePayload =
        await Users.updateUser(payload, decodedToken?.id);
      if (!success) throw new Error(message);

      dispatch({
        type: "UPDATE_USER",
        payload: {
          user: result.user || state.user,
          token: result.token || state.token,
        },
      });

      reset({
        name: result?.name ?? "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      showSuccessToast(message);
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="mt-3">
      <Card.Header>Register</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(updateUserAccount)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Full name</Form.Label>
            <Form.Control
              type="text"
              className="form-control-no-focus"
              {...register("name")}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.name && (
              <Form.Text className="text-danger mx-2">
                {errors.name.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              disabled={true}
              readOnly
              value={user?.email}
              autoComplete="email"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              className="form-control-no-focus"
              {...register("oldPassword", {
                required: watch("newPassword") ? "Password is required" : false,
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.oldPassword && (
              <Form.Text className="text-danger mx-2">
                {errors.oldPassword.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              className="form-control-no-focus"
              {...register("newPassword", {
                required: watch("oldPassword") ? "Password is required" : false,
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />
            {errors.newPassword && (
              <Form.Text className="text-danger mx-2">
                {errors.newPassword.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Re-type Password</Form.Label>
            <Form.Control
              type="password"
              className="form-control-no-focus"
              {...register("confirmPassword", {
                required: watch("newPassword") ? "Password is required" : false,
                validate: (value) =>
                  value === getValues("newPassword") ||
                  "Passwords do not match",
              })}
              placeholder="Re-type your password"
              autoComplete="re-type-password"
            />
            {errors.confirmPassword && (
              <Form.Text className="text-danger mx-2">
                {errors.confirmPassword.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Button
              variant="info"
              type="submit"
              className="btnAuth"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Update
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AccountDetails;
