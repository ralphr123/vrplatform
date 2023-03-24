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
}: Props) => {
  const id = description;
  // Disallow duplicate toasts with the same description.
  if (toast.isActive(id)) {
    return;
  }

  toast({
    id,
    status,
    title,
    description: render ? "" : description,
    duration,
    position: position || "top",
    isClosable: true,
    variant: "solid",
    render,
  });
};
