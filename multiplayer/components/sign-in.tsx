"use client";

import { signInSignUp } from "@/server-actions/authentication/sign-in-sign-up";
import { Button } from "./ui/button";

export const SignIn = () => {
  const action = async () => {
    await signInSignUp();
  };
  return <Button onClick={() => action()}>Sign Up / Sign In</Button>;
};
