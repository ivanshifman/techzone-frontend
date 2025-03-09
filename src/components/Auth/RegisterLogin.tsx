"use client";

import { FC, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../context";
import { Users } from "../../services/user.service";
import { ResponsePayload } from "../../services/api";
import {
  FormValues,
  IRegisterLoginProps,
} from "../../interfaces/registerLogin.interface";
import { useForm } from "react-hook-form";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

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

  const { state, dispatch } = useAppContext();

  const [loading, setLoading] = useState({
    auth: false,
    forgotPwd: false,
    verifying: false,
    resendingOTP: false,
  });
  const [otpTime, setOtpTime] = useState(false);

  const user = state?.user;
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return;
    if (user && user?.email) {
      router.replace("/my-account");
    }
  }, [user?.email, router]);

  const getFieldValue = (field: keyof FormValues) => {
    const value = getValues(field);
    if (!value?.trim()) throw new Error(`${field} is required.`);
    return value;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { email, password, name, confirmPassword } = data;
      if (isRegisterForm && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      setLoading((prev) => ({ ...prev, auth: true }));

      const payload = { email, password, ...(isRegisterForm && { name }) };

      const { success, message, result }: ResponsePayload = isRegisterForm
        ? await Users.registerNewUser(payload)
        : await Users.loginUser(payload);

      if (!success) throw new Error(message);

      if (!isRegisterForm) {
        dispatch({
          type: "LOGIN",
          payload: { user: result.user, token: result.token },
        });
        showSuccessToast(message);
        router.push("/");
      }

      if (isRegisterForm) {
        setOtpTime(true);
      }
      showSuccessToast(message);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.errorResponse.message ||
        error?.message ||
        (Object.keys(errors).length > 0
          ? Object.values(errors)
              .map((e) => e?.message)
              .join("\n")
          : "An unknown error occurred");

      if (errorMessage) {
        showErrorToast(errorMessage);
      }
    } finally {
      setLoading((prev) => ({ ...prev, auth: false }));
    }
  };

  const otpResend = async () => {
    try {
      const email = getFieldValue("email");
      if (!email) throw new Error("Email is required.");

      setLoading((prev) => ({ ...prev, resendingOTP: true }));

      const { success, message }: ResponsePayload = await Users.resendOTP(
        email
      );
      if (!success) throw new Error(message);
      showSuccessToast(message);
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setLoading((prev) => ({ ...prev, resendingOTP: false }));
    }
  };

  const verifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = getFieldValue("email") ?? "";
      const otp = getFieldValue("otp") ?? "";
      if (!email.trim()) throw new Error("Email is required.");
      if (!otp.trim()) throw new Error("OTP is required.");

      setLoading((prev) => ({ ...prev, verifying: true }));

      const { success, message }: ResponsePayload = await Users.verifyOTP(
        otp,
        email
      );
      if (!success) throw new Error(message);
      showSuccessToast(message);
      setOtpTime(false);
      setValue("email", "");
      setValue("password", "");
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setLoading((prev) => ({ ...prev, verifying: false }));
    }
  };

  const forgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const email = getFieldValue("email");
      if (!email) throw new Error("Email is required.");

      setLoading((prev) => ({ ...prev, forgotPwd: true }));
      const { success, message }: ResponsePayload =
        await Users.forgotUserPassword(email);

      if (!success) throw new Error(message);
      showSuccessToast(message);
    } catch (error: any) {
      showErrorToast(
        error.response?.data?.errorResponse.message || error.message
      );
    } finally {
      setLoading((prev) => ({ ...prev, forgotPwd: false }));
    }
  };

  return (
    <Card>
      <Card.Header>{isRegisterForm ? "Register" : "Login"}</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {isRegisterForm && (
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
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
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              className="form-control-no-focus"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="name@example.com"
              disabled={loading.resendingOTP || otpTime}
              autoComplete="email"
            />
            {errors.email && (
              <Form.Text className="text-danger mx-2">
                {errors.email.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
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
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Re-type password</Form.Label>
                <Form.Control
                  type="password"
                  className="form-control-no-focus"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                  placeholder="Re-type your password"
                  disabled={otpTime}
                  autoComplete="re-type-password"
                />
                {errors.confirmPassword && (
                  <Form.Text className="text-danger mx-2">
                    {errors.confirmPassword.message as string}
                  </Form.Text>
                )}
              </Form.Group>
              {otpTime && (
                <Form.Group className="mb-3" controlId="otp">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-no-focus"
                    {...register("otp")}
                    placeholder="OTP"
                    autoComplete="otp"
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
                disabled={loading.auth}
                onClick={verifyUser}
              >
                {loading.verifying && (
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
                disabled={loading.auth}
              >
                {loading.auth && (
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
          <a className="text-decoration-none" href="#" onClick={forgotPassword}>
            {loading.forgotPwd && (
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
