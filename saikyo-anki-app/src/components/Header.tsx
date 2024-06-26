import { Playfair_Display } from "next/font/google";
import Logout from "@/components/auth/logout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-option";
import { redirect } from "next/navigation";

const PfDsp = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  preload: true,
});

const Header: React.FC = async () => {
  const session = await getServerSession(authOptions);

  return (
    <header
      className={
        "bg-white border px-2 py-4 md:px-4 border-slate-300 mx-auto w-screen h-20"
      }
    >
      <div className="flex justify-between items-center">
        <a
          className={`${PfDsp.className} md:text-5xl sm:text-4xl text-3xl my-auto text-slate-800`}
        >
          Saikyo Anki
        </a>
        {session && <Logout />}
      </div>
    </header>
  );
};
export default Header;
