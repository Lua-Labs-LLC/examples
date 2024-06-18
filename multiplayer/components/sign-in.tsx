"use client";

import { signInSignUp } from "@/server-actions/authentication/sign-in-sign-up";

export const SignIn = () => {
  const action = async () => {
    await signInSignUp();
  };
  return <button onClick={() => action()}>Sign Up / Sign In</button>;
};
