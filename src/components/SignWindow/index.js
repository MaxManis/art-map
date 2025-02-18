import React, { useState } from "react";
import { SignIn } from "../SignIn";
import { SignUp } from "../SignUp";

export const SignWindow = () => {
  const [signMode, setSignMode] = useState("sign_in");

  return (
    <div>
      {signMode === "sign_in" && (
        <SignIn switchSignForm={() => setSignMode("sign_in")} />
      )}

      {signMode === "sign_up" && (
        <SignUp switchSignForm={() => setSignMode("sign_in")} />
      )}
    </div>
  );
};
