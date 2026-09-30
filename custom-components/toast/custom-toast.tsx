import { addToast, cn, Button } from "@heroui/react";
import { useRef } from "react";

interface ToastComponentAttributes {
  customdescription: string;
  customColor:
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
}

export const CustomToastComponent = ({
  customdescription,
  customColor,
}: ToastComponentAttributes) => {
  const hasShownToast = useRef(false);

  if (!hasShownToast.current) {
    addToast({
      title: "Successfull!",
      description: customdescription,
      classNames: {
        base: cn([
          "bg-default-50 dark:bg-background shadow-sm",
          "border border-l-8 rounded-md rounded-l-none",
          "flex flex-col items-start",
          "border-primary-200 dark:border-primary-100 border-l-primary",
        ]),
        icon: "w-6 h-6 fill-current",
      },
      endContent: (
        <div className="ms-11 my-2 flex gap-x-2">
          <Button color="primary" size="sm" variant="bordered">
            View Document
          </Button>
          <Button
            className="underline-offset-2"
            color="primary"
            size="sm"
            variant="light"
          >
            Maybe Later
          </Button>
        </div>
      ),
      color: customColor,
    });
    hasShownToast.current = true; // Prevent multiple toasts
  }

  return null; // No UI needed since toast is shown automatically
};