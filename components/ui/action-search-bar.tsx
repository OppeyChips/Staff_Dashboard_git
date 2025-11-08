"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";

interface Action {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
}

interface ActionSearchBarProps {
  actions: Action[];
  onSelect?: (action: Action) => void;
  placeholder?: string;
}

export function ActionSearchBar({
  actions,
  onSelect,
  placeholder = "Search actions...",
}: ActionSearchBarProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [selectedAction, setSelectedAction] = React.useState<Action | null>(null);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (action: Action) => {
    setSelectedAction(action);
    setValue(action.label);
    setOpen(false);
    onSelect?.(action);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-full bg-white/[0.02] border border-white/10 rounded-md px-4 py-3 text-left hover:bg-white/[0.05] transition-all"
      >
        <Search className="h-4 w-4 text-white/40" />
        <span className="flex-1 text-white/60">
          {selectedAction ? (
            <span className="flex items-center gap-2">
              {selectedAction.icon}
              <span className="text-white/90">{selectedAction.label}</span>
              {selectedAction.description && (
                <span className="text-white/40 text-sm">- {selectedAction.description}</span>
              )}
            </span>
          ) : (
            placeholder
          )}
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/40 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
            <Command
              className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-white/10 px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 text-white/40" />
                <Command.Input
                  placeholder={placeholder}
                  className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-50"
                  value={value}
                  onValueChange={setValue}
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-white/40">
                  No actions found.
                </Command.Empty>
                {actions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.label}
                    onSelect={() => handleSelect(action)}
                    className="relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2.5 text-sm outline-none hover:bg-white/[0.05] data-[selected=true]:bg-white/[0.05] transition-colors"
                  >
                    {action.icon && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03]">
                        {action.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-white/90">{action.label}</div>
                      {action.description && (
                        <div className="text-xs text-white/40">{action.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {action.short && (
                        <kbd className="hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white/40 sm:flex">
                          {action.short}
                        </kbd>
                      )}
                      {action.end && (
                        <span className="text-xs text-white/40">{action.end}</span>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
}
