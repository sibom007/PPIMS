import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorPageProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function Error({
  title = "Oops! Something went wrong",
  description = "We couldn't complete your request. Please try again.",
  onRetry,
}: ErrorPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex max-w-lg flex-col items-center px-6 text-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-72 w-72 object-contain"
        >
          <source src="/error.mp4" type="video/mp4" />
        </video>

        <h1 className="mt-4 text-2xl font-bold">{title}</h1>

        <p className="mt-2 text-muted-foreground">
          {description}
        </p>

        {onRetry && (
          <Button
            className="mt-6"
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}