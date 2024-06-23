"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center space-x-2"
      onClick={() => signIn("google", {}, { prompt: "login" })}
    >
      <div className="flex items-center">
        Sign in with Google <FaGoogle className="ml-2" />
      </div>
    </Button>
  );
}
