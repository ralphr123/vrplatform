import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await signOut({ redirect: false });
      router.push("/auth/signin");
    })();
  }, [router]);

  return <></>;
}
