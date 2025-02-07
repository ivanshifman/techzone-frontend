"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { Context } from "../../context";
import { Users } from "../../../services/user.service";
import { ResponsePayload } from "../../../services/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface IRegisterLoginProps {
  isRegisterForm?: boolean;
}

interface FormValues {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  otp?: string;
}

const RegisterLogin: FC<IRegisterLoginProps> = ({ isRegisterForm = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "", confirmPassword: "", name: "" },
  });

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForgotPwd, setIsLoadingForgotPwd] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [otpTime, setOtpTime] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: "", otp: "" });

  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      router.push("/my-account");
    }
  }, [user, router]);

  const onSubmit = async (data: FormValues) => {
    try {
      const { email, password, name, confirmPassword } = data;
      if (isRegisterForm && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      setIsLoading(true);
      const payload = { email, password, ...(isRegisterForm && { name }) };

      const { success, message, result }: ResponsePayload = isRegisterForm
        ? await Users.registerNewUser(payload)
        : await Users.loginUser(payload);

      if (!success) throw new Error(message);

      if (!isRegisterForm) {
        dispatch({ type: "LOGIN", payload: result?.user });
        toast.success(message, {
          autoClose: 5000,
        });
        router.push("/");
      }

      if (isRegisterForm) {
        setOtpTime(true);
      }

      toast.success(message, {
        autoClose: 5000,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (Object.keys(errors).length > 0
          ? Object.values(errors)
              .map((e) => e?.message)
              .join("\n")
          : "An unknown error occurred");

      if (errorMessage) {
        toast.error(errorMessage, { autoClose: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const otpResend = async () => {
    try {
      const email = getValues("email");
      if (!email) throw new Error("Email is required.");
      setIsResendingOTP(true);
      const { success, message }: ResponsePayload = await Users.resendOTP(
        email
      );
      if (!success) throw new Error(message);
      toast.success(message, {
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.errorResponse.message || error.message,
        {
          autoClose: 5000,
        }
      );
    } finally {
      setIsResendingOTP(false);
    }
  };

  const verifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!otpForm.email.trim()) throw new Error("Email is required.");
      if (!otpForm.otp.trim()) throw new Error("OTP is required.");
      setIsVerifying(true);
      const { success, message }: ResponsePayload = await Users.verifyOTP(
        otpForm.otp,
        otpForm.email
      );
      if (!success) throw new Error(message);
      toast.success(message, {
        autoClose: 5000,
      });
      setOtpTime(false);
      setValue("email", "");
      setValue("password", "");
    } catch (error: any) {
      toast.error(
        error.response?.data?.errorResponse.message || error.message,
        {
          autoClose: 5000,
        }
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const forgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = getValues("email");
      if (!email) throw new Error("Email is required.");

      setIsLoadingForgotPwd(true);
      const { success, message }: ResponsePayload =
        await Users.forgotUserPassword(email);
      if (!success) throw new Error(message);
      toast.success(message, {
        autoClose: 5000,
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.errorResponse.message || error.message,
        {
          autoClose: 5000,
        }
      );
    } finally {
      setIsLoadingForgotPwd(false);
    }
  };

  return (
    <Card>
      <Card.Header>{isRegisterForm ? "Register" : "Login"}</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {isRegisterForm && (
            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Full name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                className="form-control-no-focus"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your full name"
                disabled={otpTime}
                autoComplete="name"
              />
              {errors.name && (
                <Form.Text className="text-danger mx-2">
                  {errors.name.message as string}
                </Form.Text>
              )}
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">Email address</Form.Label>
            <Form.Control
              type="email"
              id="email"
              className="form-control-no-focus"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="name@example.com"
              disabled={isResendingOTP || otpTime}
              autoComplete="email"
            />
            {errors.email && (
              <Form.Text className="text-danger mx-2">
                {errors.email.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              className="form-control-no-focus"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your password"
              disabled={otpTime}
              autoComplete="new-password"
            />
            {errors.password && (
              <Form.Text className="text-danger mx-2">
                {errors.password.message as string}
              </Form.Text>
            )}
          </Form.Group>
          {isRegisterForm && (
            <>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="confirmPassword">Re-type password</Form.Label>
                <Form.Control
                  type="password"
                  id="confirmPassword"
                  className="form-control-no-focus"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  placeholder="Re-type your password"
                  disabled={otpTime}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <Form.Text className="text-danger mx-2">
                    {errors.confirmPassword.message as string}
                  </Form.Text>
                )}
              </Form.Group>
              {otpTime && (
                <Form.Group className="mb-3">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("otp")}
                    placeholder="OTP"
                    onChange={(e) =>
                      setOtpForm({ ...otpForm, otp: e.target.value })
                    }
                  />

                  <Button
                    variant="link"
                    className="resendOtpBtn"
                    onClick={otpResend}
                  >
                    Resend OTP
                  </Button>
                </Form.Group>
              )}
            </>
          )}
          {otpTime ? (
            <Form.Group className="mb-3">
              <Button
                variant="info"
                type="submit"
                className="btnAuth"
                disabled={isLoading}
                onClick={verifyUser}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Submit
              </Button>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Button
                variant="info"
                type="submit"
                className="btnAuth"
                disabled={isLoading}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {isRegisterForm ? "Register" : "Login"}
              </Button>
            </Form.Group>
          )}
        </Form>
        {!isRegisterForm && (
          <a className="text-decoration-none" href="" onClick={forgotPassword}>
            {isLoadingForgotPwd && (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Forgot your password?
          </a>
        )}
      </Card.Body>
    </Card>
  );
};

export default RegisterLogin;
