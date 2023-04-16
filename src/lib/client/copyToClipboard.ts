import { showToast } from "./showToast";

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  showToast({
    description: "Copied to clipboard!",
    status: "success",
  });
};
