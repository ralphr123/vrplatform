import { Flex } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("Google")}>Sign in with Google</button>
    </div>
  );
}
