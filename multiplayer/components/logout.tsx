"use client";

import { logout } from "@/server-actions/authentication/logout";

export const Logout = () => {
  const action = async () => {
    await logout();
  };
  return <button onClick={() => action()}>Logout</button>;
};
