import { Logo } from "@app/components/Logo";
import { BlueLink } from "@app/components/misc/BlueLink";
import { showToast } from "@app/lib/client/showToast";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const session = useSession();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  if (session?.status === "authenticated") {
    router.push({
      pathname: "/",
      query: {},
    });
    return <Text>Redirecting...</Text>;
  } else if (session?.status === "loading") {
    return <Spinner />;
  }

  const handleSubmit = async () => {
    await signIn("email", { email, redirect: false });
    showToast({
      description: "A magic link has been sent to your email.",
    });
  };

  return (
    <Flex
      height="100vh"
      width="100vw"
      padding={0}
      align="center"
      justify="center"
    >
      <Flex
        flexDirection="column"
        justify="center"
        bgColor="white"
        padding={12}
        rounded={8}
        gap={8}
        width={"30em"}
      >
        <Logo height="5em" width="9em" />
        <Heading size={"lg"}>Sign up</Heading>
        <FormControl width="100%">
          <Flex flexDirection="column" gap={4}>
            <div>
              <FormLabel>Email</FormLabel>
              <Input
                width="100%"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Flex>
        </FormControl>
        <Flex flexDirection="column" gap={4}>
          <Button
            bgColor="gray.500"
            color="white"
            padding={6}
            onClick={handleSubmit}
          >
            Sign up
          </Button>
          <Button
            bgColor="gray.100"
            padding={6}
            onClick={() => signIn("google", { redirect: false })}
          >
            <Flex align="center" justify="center" gap={3}>
              <Icon fontSize={24} as={FcGoogle} />
              <Text>Sign up with Google</Text>
            </Flex>
          </Button>
        </Flex>
        <BlueLink href="/auth/signin">
          Already have an account? Sign in.
        </BlueLink>
      </Flex>
    </Flex>
  );
}
