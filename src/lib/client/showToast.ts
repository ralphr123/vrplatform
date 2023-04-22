import {
  AlertStatus,
  createStandaloneToast,
  ToastPosition,
} from "@chakra-ui/react";

const { toast, ToastContainer } = createStandaloneToast();

export { ToastContainer };

type Props = {
  status?: AlertStatus;
  description: string;
  title?: string;
  duration?: number;
  position?: ToastPosition;
  contactSupport?: boolean;
  contactDeveloper?: boolean;
  // RenderProps type doesn't exist in chakra package
  render?: (props: any) => React.ReactNode;
};

export const showToast = ({
  status = "info",
  description,
  title = "",
  duration = 10 * 1000,
  position,
  render,
  contactSupport,
  contactDeveloper,
}: Props) => {
  const id = description;
  // Disallow duplicate toasts with the same description.
  if (toast.isActive(id)) {
    return;
  }

  let descriptionSuffix = "";

  if (contactSupport) {
    descriptionSuffix =
      "If this error persists, contact support at support@vrplatform.com.";
  }

  if (contactDeveloper) {
    descriptionSuffix = "If this error persists, contact a developer.";
  }

  toast({
    id,
    status,
    title,
    description: render ? "" : `${description} ${descriptionSuffix}`,
    duration,
    position: position || "top",
    isClosable: true,
    variant: "solid",
    render,
  });
};
