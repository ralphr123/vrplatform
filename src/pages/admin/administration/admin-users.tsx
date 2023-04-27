import { PageHeader } from "@app/components/admin/PageHeader";
import { UserTable } from "@app/components/admin/user-table/UserTable";
import { Stack } from "@chakra-ui/react";

export default function AdminUsers() {
  return (
    <Stack width="100%" gap="1.5em">
      <PageHeader>Verified users</PageHeader>
      <UserTable excludeMembers />
    </Stack>
  );
}
