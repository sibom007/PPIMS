"use client"
import * as React from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  emptyIndicator?: React.ReactNode;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  loading = false,
  disabled = false,
  className,
  emptyIndicator = "No results found.",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  const handleToggle = (item: string) => {
    if (value.includes(item)) {
      onChange?.(value.filter((v) => v !== item));
    } else {
      onChange?.([...value, item]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled || loading}
          className={cn("min-h-11 w-full justify-between px-3 py-2", className)}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            {loading ? (
              <span className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </span>
            ) : selectedOptions.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                {placeholder}
              </span>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="gap-1 rounded-md px-2 py-1"
                >
                  <span className="max-w-35 truncate">{option.label}</span>
                </Badge>
              ))
            )}
          </div>

          <div className="ml-2 flex items-center gap-1">
            {!!value.length && !loading && !disabled && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.([]);
                }}
                className="rounded-md p-1 hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground opacity-70" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            disabled={loading || disabled}
          />

          <CommandList className="max-h-72">
            <CommandEmpty>{emptyIndicator}</CommandEmpty>

            <CommandGroup>
              {options.map((option) => {
                const selected = value.includes(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleToggle(option.value)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded border",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </div>

                    <span className="flex-1 truncate">{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
