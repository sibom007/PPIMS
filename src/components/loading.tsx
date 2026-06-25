import Image from "next/image";

interface LoadingProps {
  title?: string;
  desc?: string;
}

export function Loading({
  title = "Loading...",
  desc,
}: LoadingProps) {
  return (
    <div className="flex items-center justify-center backdrop-blur-sm h-150">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-background p-20 shadow-lg">
        <Image
          src="/loading.svg"
          alt="Loading"
          width={80}
          height={80}
          priority
        />

        <h3 className="text-lg font-semibold">{title}</h3>

        {desc && (
          <p className="max-w-xs text-center text-sm text-muted-foreground">
            {desc}
          </p>
        )}
      </div>
    </div>
  );
}