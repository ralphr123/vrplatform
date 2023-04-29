import { useVerify } from "@app/lib/client/hooks/api/useVerify";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

/**
 * Users are sent here when they click on the
 * verification link in their email
 * */

export default function Verify() {
  const router = useRouter<"/auth/verify/[token]">();
  const { token } = router.query;
  const { data, isLoading } = useVerify({ token });

  if (isLoading) {
    return (
      <Flex>
        <Spinner />
      </Flex>
    );
  }

  if (!data) {
    return (
      <Flex>
        <Text>
          There was an error verifying your email. If this persists, contact
          support.
        </Text>
      </Flex>
    );
  } else {
    router.push("/auth/signin");
  }

  return (
    <Flex>
      <Text>Redirecting...</Text>
    </Flex>
  );
}
