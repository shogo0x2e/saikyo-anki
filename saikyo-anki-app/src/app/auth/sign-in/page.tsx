/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Mpd4T2XQFoQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Login from "@/component/auth/login";
import { authOptions } from "@/lib/auth-option";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <div className="flex flex-col items-center space-y-6">
          <div></div>
          <h2 className="text-2xl font-bold">Google でサインインする</h2>
          <Login />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
