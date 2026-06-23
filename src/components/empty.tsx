import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPageProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function Empty({
  title = "No Data Found",
  description = "There's nothing to display right now.",
  actionLabel,
  onAction,
}: EmptyPageProps) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Inbox className="h-12 w-12 text-muted-foreground" />
        </div>

        <h2 className="mt-6 text-2xl font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-muted-foreground">
          {description}
        </p>

        {actionLabel && onAction && (
          <Button
            className="mt-6"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}