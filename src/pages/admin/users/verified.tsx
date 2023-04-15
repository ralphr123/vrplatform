import { PageHeader } from "@app/components/admin/PageHeader";
import { UserTable } from "@app/components/admin/tables/UserTable";
import { Flex } from "@chakra-ui/react";

export default function PendingReview() {
  return (
    <Flex flexDirection="column" width="100%" gap="1.5em">
      <PageHeader>Verified users</PageHeader>
      <UserTable pendingReview={false} />
    </Flex>
  );
}
