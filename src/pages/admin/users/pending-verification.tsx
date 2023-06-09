import { PageHeader } from "@app/components/admin/PageHeader";
import { UserTable } from "@app/components/admin/user-table/UserTable";
import { Stack } from "@chakra-ui/react";

export default function PendingReview() {
  return (
    <Stack width="100%" gap="1.5em">
      <PageHeader>Unverified users</PageHeader>
      <UserTable verified={true} />
    </Stack>
  );
}
