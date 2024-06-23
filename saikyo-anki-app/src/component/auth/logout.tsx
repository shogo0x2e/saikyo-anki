import React from "react";
import { useSession, signOut } from "next-auth/react";

export default function Logout() {
  return (
    <div>
      <button onClick={() => signOut()}>ログアウト</button>
    </div>
  );
}
