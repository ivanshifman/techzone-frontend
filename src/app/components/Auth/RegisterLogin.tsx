"use client";

import { FC, useContext, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import Router from "next/router";
import { Context } from "../../context";
import { Users } from "../../../services/user.service";
import { ResponsePayload } from "../../../services/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
interface IRegisterLoginProps {
  isResgisterForm?: boolean;
}

interface FormValues {
	name?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	otp?: string;
}

const initalForm = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
};

const RegisterLogin: FC<IRegisterLoginProps> = ({
  isResgisterForm = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [authForm, setAuthForm] = useState(initalForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForgotPwd, setIsLoadingForgotPwd] = useState(false);
  const [otpTime, setOtpTime] = useState(false);
  const [otpForm, setOtpForm] = useState({ email: "", otp: "" });

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    if (user && user.email) {
      Router.push("/my-account");
    }
  }, [user]);

  
  const onSubmit = async (data: FormValues) => {
    try {
      const { email, password, name, confirmPassword } = data;
      if (isResgisterForm && password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      setIsLoading(true);
      const payload = { email, password, ...(isResgisterForm && { name }) };

      const { success, message, result }: ResponsePayload = isResgisterForm
        ? await Users.registerNewUser(payload)
        : await Users.loginUser(payload);

      if (!success) throw new Error(message);

      if (!isResgisterForm) {
        dispatch({ type: "LOGIN", payload: result?.user });
        toast.success(message, {
          autoClose: 5000,
        });
        Router.push("/");
      }
      toast.success(message, {
        autoClose: 5000,
      });
    } catch (error: any) {
      let errorMessage = "";
      if (error.response) {
        errorMessage = error.response.data.message;
      } else {
        for (const field in errors) {
          if (errors[field]?.message) {
            errorMessage += `${errors[field]?.message}\n`;
          }
        }
      }

      if (errorMessage) {
        toast.error(errorMessage, {
          autoClose: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      const { email, name, password, confirmPassword } = authForm;
      if (!name) {
        throw new Error("Invalid name");
      }
      //   if (!validator.isEmail(email)) {
      //     throw new Error("Invalid email");
      //   }
      if (password !== confirmPassword) {
        console.error("Invalid password", password, confirmPassword);
        throw new Error("Password does not match");
      }
      if (password.length < 6) {
        throw new Error("Password is too short. Minimum 6 characters");
      }
      setIsLoading(true);
      const payload = {
        email: authForm.email,
        password: authForm.password,
        name: authForm.name,
      };

      const { success, message }: ResponsePayload = await Users.registerNewUser(
        payload
      );
      if (!success) throw new Error(message);
      setOtpForm({ ...otpForm, email: email });
      setOtpTime(true);
      toast.success(message, {
        autoClose: 5000,
      });
      //   addToast(message, { appearance: "success", autoDismiss: true });
    } catch (error: any) {
      //   if (error.response) {
      //     return addToast(error.response.data.message, {
      //       appearance: "error",
      //       autoDismiss: true,
      //     });
      //   }
      //   addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const { email, password } = authForm;
      if (!email || !password) {
        throw new Error("Invalid email or password");
      }
      //   if (!validator.isEmail(email)) {
      //     throw new Error("Invalid email");
      //   }
      if (password.length < 6) {
        throw new Error("Password is too short. Minimum 6 characters");
      }
      setIsLoading(true);
      const payload = {
        email,
        password,
      };
      const { success, message, result }: ResponsePayload =
        await Users.loginUser(payload);
      if (!success) throw new Error(message);

      dispatch({
        type: "LOGIN",
        payload: result?.user,
      });
      toast.success(message, {
        autoClose: 5000,
      });
      //   addToast(message, { appearance: "success", autoDismiss: true });
      Router.push("/");
    } catch (error: any) {
      console.log(error);
      //   if (error.response) {
      //     return addToast(error.response.data.message, {
      //       appearance: "error",
      //       autoDismiss: true,
      //     });
      //   }
      //   addToast(error.message, { appearance: "error", autoDismiss: true });
    } finally {
      setIsLoading(false);
    }
  };

  const otpResend = async () => {
    try {
      const { email } = otpForm;
      //   if (!validator.isEmail(email)) {
      //     throw new Error("Invalid email");
      //   }
      setIsLoading(true);
      const { success, message }: ResponsePayload = await Users.resendOTP(
        email
      );
      if (!success) throw new Error(message);
      toast.success(message, {
        autoClose: 5000,
      });
      //   addToast(message, { appearance: "success", autoDismiss: true });
    } catch (error: any) {
      if (error.response) {
        // return addToast(error.response.data.message, {
        //   appearance: "error",
        //   autoDismiss: true,
        // });
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      }
      //   addToast(error.message, { appearance: "error", autoDismiss: true });
      toast.error(error.message, {
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUser = async (e: any) => {
    e.preventDefault();
    try {
      //   if (!validator.isEmail(otpForm.email)) {
      //     throw new Error("Invalid email");
      //   }
      setIsLoading(true);
      const { success, message }: ResponsePayload = await Users.verifyOTP(
        otpForm.otp,
        otpForm.email
      );
      if (!success) throw new Error(message);
      //   addToast(message, { appearance: "success", autoDismiss: true });
      toast.success(message, {
        autoClose: 5000,
      });
      setOtpTime(false);
      setAuthForm(initalForm);
    } catch (error: any) {
      if (error.response) {
        // return addToast(error.response.data.message, {
        //   appearance: "error",
        //   autoDismiss: true,
        // });
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      }
      //   addToast(error.message, { appearance: "error", autoDismiss: true });
      toast.error(error.message, {
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (e: any) => {
    e.preventDefault();
    try {
      const { email } = authForm;
      //   if (!validator.isEmail(email)) {
      //     throw new Error(
      //       "Invalid email. Plese enter a valid email and we will send you a password for you"
      //     );
      //   }
      setIsLoadingForgotPwd(true);
      const { success, message }: ResponsePayload =
        await Users.forgotUserPassword(email);
      if (!success) throw new Error(message);
      //   addToast(message, { appearance: "success", autoDismiss: true });
      toast.success(message, {
        autoClose: 5000,
      });
      console.log(message, success);
    } catch (error: any) {
      if (error.response) {
        // return addToast(error.response.data.message, {
        //   appearance: "error",
        //   autoDismiss: true,
        // });
        toast.error(error.response.data.message, {
          autoClose: 5000,
        });
      }
      //   addToast(error.message, { appearance: "error", autoDismiss: true });
      toast.error(error.message, {
        autoClose: 5000,
      });
      console.log(error);
    } finally {
      setIsLoadingForgotPwd(false);
    }
  };

  return (
    <Card>
      <Card.Header>{isResgisterForm ? "Register" : "Login"}</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {isResgisterForm && (
            <Form.Group className="mb-3">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                className="form-control-no-focus"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your full name"
                disabled={otpTime}
                value={authForm.name || ""}
                onChange={(e) =>
                  setAuthForm({ ...authForm, name: e.target.value })
                }
              />
              {errors.name && (
                <Form.Text className="text-danger mx-2">
                  {errors.name.message as string}
                </Form.Text>
              )}
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              className="form-control-no-focus"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email",
                },
              })}
              placeholder="name@example.com"
              disabled={otpTime}
              value={authForm.email || ""}
              onChange={(e) =>
                setAuthForm({ ...authForm, email: e.target.value })
              }
            />
            {errors.email && (
              <Form.Text className="text-danger mx-2">
                {errors.email.message as string}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
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
              value={authForm.password || ""}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
            />
            {errors.password && (
              <Form.Text className="text-danger mx-2">
                {errors.password.message as string}
              </Form.Text>
            )}
          </Form.Group>
          {isResgisterForm && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Re-type password</Form.Label>
                <Form.Control
                  type="password"
                  className="form-control-no-focus"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="Re-type your password"
                  disabled={otpTime}
                  value={authForm.confirmPassword || ""}
                  onChange={(e) =>
                    setAuthForm({
                      ...authForm,
                      confirmPassword: e.target.value,
                    })
                  }
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
                // onClick={isResgisterForm ? handleRegister : handleLogin}
              >
                {isLoading && (
                  <span
                    className="spinner-border spinner-border-sm mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                {isResgisterForm ? "Register" : "Login"}
              </Button>
            </Form.Group>
          )}
        </Form>
        {!isResgisterForm && (
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
