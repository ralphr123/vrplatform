import { Logo } from "@app/components/Logo";
import { showToast } from "@app/lib/client/showToast";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

type QueryParams = {
  hasJustVerifiedEmail?: string;
};

export default function SignIn() {
  const router = useRouter();
  const session = useSession();
  const { hasJustVerifiedEmail } = router.query as QueryParams;

  useEffect(() => {
    if (hasJustVerifiedEmail === "true") {
      showToast({
        status: "success",
        title: "Your email has been verified!",
        description: "You can now access the dashboard.",
      });
      router.replace("/auth/signin", undefined, { shallow: true });
    }
  }, [hasJustVerifiedEmail, router]);

  if (session?.status === "authenticated") {
    router.push("/admin/videos/published");
    return <Text>Redirecting...</Text>;
  } else if (session?.status === "loading") {
    return <Spinner />;
  }

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
        padding={14}
        rounded={8}
        gap={10}
        width={"35vw"}
      >
        <Logo />
        <Flex flexDirection="column" gap={2}>
          <Heading size={"lg"}>Sign In</Heading>
          <Text>Please fill in your account credentials.</Text>
        </Flex>
        <FormControl width="100%">
          <Flex flexDirection="column" gap={4}>
            <div>
              <FormLabel>Email address</FormLabel>
              <Input width="100%" type="text" />
            </div>
            <div>
              <FormLabel>Password</FormLabel>
              <Input width="100%" type="password" />
            </div>
          </Flex>
        </FormControl>
        <Flex flexDirection="column" gap={5}>
          <Button bgColor="gray.500" color="white" padding={6}>
            Sign in
          </Button>
          <Button
            bgColor="gray.100"
            padding={6}
            onClick={() => signIn("google", { redirect: false })}
          >
            <Flex align="center" justify="center" gap={3}>
              <Icon fontSize={24} as={FcGoogle} />
              <Text>Sign in with Google</Text>
            </Flex>
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
