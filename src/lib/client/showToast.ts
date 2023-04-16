import {
  AlertStatus,
  createStandaloneToast,
  ToastPosition,
} from "@chakra-ui/react";

const { toast, ToastContainer } = createStandaloneToast();

export { ToastContainer };

interface Props {
  status?: AlertStatus;
  description: string;
  title?: string;
  duration?: number;
  position?: ToastPosition;
  contactSupport?: boolean;
  // RenderProps type doesn't exist in chakra package
  render?: (props: any) => React.ReactNode;
}

export const showToast = ({
  status = "info",
  description,
  title = "",
  duration = 10 * 1000,
  position,
  render,
  contactSupport,
}: Props) => {
  const id = description;
  // Disallow duplicate toasts with the same description.
  if (toast.isActive(id)) {
    return;
  }

  const fullDescription = contactSupport
    ? `${description} If this error persists, contact support at support@vrplatform.com.`
    : description;

  toast({
    id,
    status,
    title,
    description: render ? "" : fullDescription,
    duration,
    position: position || "top",
    isClosable: true,
    variant: "solid",
    render,
  });
};
