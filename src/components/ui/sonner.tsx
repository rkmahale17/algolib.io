import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:justify-between",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "group-[.toast]:order-last group-[.toast]:ml-auto group-[.toast]:static group-[.toast]:transform-none",
          success: "[&_[data-icon]]:text-green-500 [&_[data-close-button]]:!bg-green-100 [&_[data-close-button]]:!text-green-600 [&_[data-close-button]]:!border-green-200 [&_[data-close-button]]:hover:!bg-green-200 [&_[data-close-button]>svg]:!text-green-600 [&_[toast-close]]:!text-green-600 [&_[toast-close]]:!bg-green-100 [&_[toast-close]]:!border-green-200 [&_[toast-close]]:hover:!bg-green-200",
          error: "[&_[data-icon]]:text-red-500 [&_[data-close-button]]:!bg-red-100 [&_[data-close-button]]:!text-red-600 [&_[data-close-button]]:!border-red-200 [&_[data-close-button]]:hover:!bg-red-200 [&_[data-close-button]>svg]:!text-red-600 [&_[toast-close]]:!text-red-600 [&_[toast-close]]:!bg-red-100 [&_[toast-close]]:!border-red-200 [&_[toast-close]]:hover:!bg-red-200",
          warning: "[&_[data-icon]]:text-orange-500 [&_[data-close-button]]:!bg-orange-100 [&_[data-close-button]]:!text-orange-600 [&_[data-close-button]]:!border-orange-200 [&_[data-close-button]]:hover:!bg-orange-200 [&_[data-close-button]>svg]:!text-orange-600 [&_[toast-close]]:!text-orange-600 [&_[toast-close]]:!bg-orange-100 [&_[toast-close]]:!border-orange-200 [&_[toast-close]]:hover:!bg-orange-200",
          info: "[&_[data-icon]]:text-blue-500 [&_[data-close-button]]:!bg-blue-100 [&_[data-close-button]]:!text-blue-600 [&_[data-close-button]]:!border-blue-200 [&_[data-close-button]]:hover:!bg-blue-200 [&_[data-close-button]>svg]:!text-blue-600 [&_[toast-close]]:!text-blue-600 [&_[toast-close]]:!bg-blue-100 [&_[toast-close]]:!border-blue-200 [&_[toast-close]]:hover:!bg-blue-200",
        },
      }}
      closeButton
      {...props}
    />
  );
};

export { Toaster, toast };
