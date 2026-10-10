"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

export interface UISelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface UISelectProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string | number;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  options?: UISelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
  wrapperClassName?: string;
  children?: React.ReactNode;
}

function extractTextFromChildren(childrenNode: any): string {
  if (childrenNode === null || childrenNode === undefined) return "";
  if (typeof childrenNode === "string" || typeof childrenNode === "number") {
    return String(childrenNode);
  }
  if (Array.isArray(childrenNode)) {
    return childrenNode.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement(childrenNode)) {
    return extractTextFromChildren((childrenNode.props as any)?.children);
  }
  return String(childrenNode);
}

export const UISelect: React.FC<UISelectProps> = ({
  id,
  name,
  label,
  value = "",
  onChange,
  options,
  placeholder = "-- Select an option --",
  icon,
  error,
  helperText,
  required,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search...",
  className = "",
  wrapperClassName = "",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const parsedOptions = useMemo<UISelectOption[]>(() => {
    if (options && options.length > 0) {
      return options;
    }

    const extracted: UISelectOption[] = [];
    if (children) {
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const props = child.props as any;
          extracted.push({
            value: props.value ?? "",
            label: extractTextFromChildren(props.children),
            disabled: !!props.disabled,
          });
        }
      });
    }
    return extracted;
  }, [options, children]);

  const selectedOption = useMemo(() => {
    return parsedOptions.find((opt) => String(opt.value) === String(value));
  }, [parsedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return parsedOptions;
    }
    const q = searchQuery.toLowerCase().trim();
    return parsedOptions.filter((opt) => {
      if (opt.value === "") return true;
      const labelMatch = opt.label.toLowerCase().includes(q);
      const valMatch = String(opt.value).toLowerCase().includes(q);
      const sublabelMatch = opt.sublabel?.toLowerCase().includes(q);
      return labelMatch || valMatch || sublabelMatch;
    });
  }, [parsedOptions, searchQuery, searchable]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery("");
    }
  }, [isOpen, searchable]);

  const handleSelect = (optValue: string | number) => {
    if (disabled) return;
    setIsOpen(false);
    setSearchQuery("");
    if (onChange) {
      onChange({
        target: {
          value: String(optValue),
          name: name || id,
        },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    } else if (e.key === "Enter" && isOpen && filteredOptions.length > 0) {
      const nonPlaceholder = filteredOptions.filter((o) => o.value !== "" && !o.disabled);
      if (nonPlaceholder.length > 0) {
        e.preventDefault();
        handleSelect(nonPlaceholder[0].value);
      }
    }
  };

  return (
    <div className={`w-full relative ${wrapperClassName}`} ref={containerRef} onKeyDown={handleKeyDown}>
      {label && (
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <input type="hidden" name={name} value={value} />

      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full relative bg-slate-50 border rounded-xl text-xs text-left transition-all duration-150 flex items-center justify-between font-medium cursor-pointer ${
          icon ? "pl-9" : "pl-3.5"
        } pr-10 py-2.5 ${
          isOpen
            ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-white"
            : error
            ? "border-rose-400 hover:border-rose-500"
            : "border-slate-200 hover:border-emerald-500 focus:border-emerald-600 focus:bg-white"
        } ${disabled ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-slate-800"} ${className}`}
      >
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <div className="truncate pr-2">
          {selectedOption && selectedOption.value !== "" ? (
            <span className="font-semibold text-slate-900">{selectedOption.label}</span>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
          <ChevronDown
            className={`w-4 h-4 stroke-[2.2] transition-transform duration-200 ${
              isOpen ? "rotate-180 text-emerald-600" : "text-slate-400"
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-[100] bg-white border border-slate-200 rounded-2xl shadow-xl max-h-64 flex flex-col p-1.5 animate-in fade-in duration-150">
          {searchable && (
            <div className="p-1 pb-1.5 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/30"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="overflow-y-auto flex-1 p-0.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-4 text-center text-xs text-slate-400 font-medium">
                {searchQuery ? `No results for "${searchQuery}"` : "No options available"}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                const isPlaceholder = opt.value === "";

                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-100 flex items-center justify-between cursor-pointer ${
                      opt.disabled
                        ? "text-slate-300 bg-transparent cursor-not-allowed"
                        : isSelected
                        ? "bg-emerald-50 text-emerald-800 font-bold shadow-2xs"
                        : isPlaceholder
                        ? "text-slate-400 hover:bg-slate-50 italic"
                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div className="truncate">
                        <span className="block truncate">{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-[10px] text-slate-400 font-normal block -mt-0.5">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && !isPlaceholder && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error && <p className="text-[11px] font-medium text-rose-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};
