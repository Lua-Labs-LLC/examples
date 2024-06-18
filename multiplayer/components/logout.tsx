"use client";

import { logout } from "@/server-actions/authentication/logout";
import { Button } from "./ui/button";

export const Logout = () => {
  const action = async () => {
    await logout();
  };
  return <Button onClick={() => action()}>Logout</Button>;
};
