import { PageHeader } from "@app/components/PageHeader";
import { UserTable } from "@app/components/user/UserTable";
import { Flex } from "@chakra-ui/react";

export default function PendingReview() {
  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>Pending Review</PageHeader>
      <UserTable pendingReview={true} />
    </Flex>
  );
}
