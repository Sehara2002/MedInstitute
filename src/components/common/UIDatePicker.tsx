"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
} from "lucide-react";

export interface UIDatePickerProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
  disablePast?: boolean; // Disallow dates before today
  disableFuture?: boolean; // Disallow dates after today
  className?: string;
  wrapperClassName?: string;
  onClear?: () => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseISODate(dateStr?: string): Date | null {
  if (!dateStr || dateStr.length < 10) return null;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && y > 1900 && m >= 0 && m <= 11 && d >= 1 && d <= 31) {
      return new Date(y, m, d);
    }
  }
  return null;
}

function formatISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Automatically format numeric keystrokes into YYYY-MM-DD
 */
function applyDateMask(rawInput: string, prevVal: string): string {
  const isDeleting = rawInput.length < prevVal.length;
  const digits = rawInput.replace(/\D/g, "").slice(0, 8);

  if (!digits) return "";

  if (isDeleting) {
    if (digits.length <= 4) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }

  if (digits.length <= 4) {
    return digits.length === 4 ? `${digits}-` : digits;
  }
  if (digits.length <= 6) {
    const month = digits.slice(4);
    return month.length === 2 ? `${digits.slice(0, 4)}-${month}-` : `${digits.slice(0, 4)}-${month}`;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export const UIDatePicker: React.FC<UIDatePickerProps> = ({
  id,
  name,
  label,
  value = "",
  onChange,
  placeholder = "YYYY-MM-DD",
  error,
  helperText,
  required,
  disabled = false,
  min,
  max,
  disablePast = false,
  disableFuture = false,
  className = "",
  wrapperClassName = "",
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const todayStr = useMemo(() => formatISODate(new Date()), []);

  const effectiveMin = useMemo(() => {
    if (min) return min;
    if (disablePast) return todayStr;
    return null;
  }, [disablePast, min, todayStr]);

  const effectiveMax = useMemo(() => {
    if (max) return max;
    if (disableFuture) return todayStr;
    return null;
  }, [disableFuture, max, todayStr]);

  const isDateDisabled = (dateOrStr: Date | string) => {
    const dStr = typeof dateOrStr === "string" ? dateOrStr : formatISODate(dateOrStr);
    if (effectiveMin && dStr < effectiveMin) return true;
    if (effectiveMax && dStr > effectiveMax) return true;
    return false;
  };

  const parsedValue = useMemo(() => parseISODate(value), [value]);

  const [viewDate, setViewDate] = useState<Date>(() => {
    if (parsedValue) return parsedValue;
    if (effectiveMax) {
      const pMax = parseISODate(effectiveMax);
      if (pMax) return pMax;
    }
    return new Date();
  });

  useEffect(() => {
    if (parsedValue) {
      setViewDate(parsedValue);
    } else if (effectiveMax) {
      const pMax = parseISODate(effectiveMax);
      if (pMax) setViewDate(pMax);
    }
  }, [value, parsedValue, effectiveMax]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsYearPickerOpen(false);
        setIsMonthPickerOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    if (disabled || isDateDisabled(date)) return;
    const formatted = formatISODate(date);
    setIsOpen(false);
    setIsYearPickerOpen(false);
    setIsMonthPickerOpen(false);
    if (onChange) {
      onChange({
        target: {
          value: formatted,
          name: name || id,
        },
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formattedVal = applyDateMask(rawVal, value);

    if (onChange) {
      onChange({
        target: {
          value: formattedVal,
          name: name || id,
        },
      });
    }

    const parsed = parseISODate(formattedVal);
    if (parsed) {
      setViewDate(parsed);
      if (formattedVal.length === 10) {
        setIsOpen(false);
        setIsYearPickerOpen(false);
        setIsMonthPickerOpen(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" || e.key === "Enter") {
      setIsOpen(false);
      setIsYearPickerOpen(false);
      setIsMonthPickerOpen(false);
      if (e.key === "Enter") {
        e.preventDefault();
      }
    } else if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    } else if (!/^[0-9]$/.test(e.key) && e.key !== "-") {
      e.preventDefault();
    }
  };

  const handleClear = () => {
    if (disabled) return;
    if (onChange) {
      onChange({
        target: {
          value: "",
          name: name || id,
        },
      });
    }
    if (onClear) onClear();
    setIsOpen(false);
    setIsYearPickerOpen(false);
    setIsMonthPickerOpen(false);
  };

  const isTodayDisabled = isDateDisabled(new Date());

  const handleSelectToday = () => {
    if (isTodayDisabled) return;
    handleSelectDate(new Date());
  };

  const validationError = useMemo(() => {
    if (error) return error;
    if (value && value.length === 10) {
      if (effectiveMin && value < effectiveMin) {
        return disablePast
          ? "Date cannot be in the past"
          : `Date must be on or after ${effectiveMin}`;
      }
      if (effectiveMax && value > effectiveMax) {
        return disableFuture
          ? "Date cannot be in the future"
          : `Date must be on or before ${effectiveMax}`;
      }
    }
    return null;
  }, [error, value, effectiveMin, effectiveMax, disablePast, disableFuture]);

  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      isDisabled: boolean;
    }> = [];

    const selectedStr = parsedValue ? formatISODate(parsedValue) : "";

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, daysInPrevMonth - i);
      const dStr = formatISODate(d);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedStr,
        isDisabled: isDateDisabled(d),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(currentYear, currentMonth, day);
      const dStr = formatISODate(d);
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedStr,
        isDisabled: isDateDisabled(d),
      });
    }

    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(currentYear, currentMonth + 1, day);
      const dStr = formatISODate(d);
      days.push({
        date: d,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedStr,
        isDisabled: isDateDisabled(d),
      });
    }

    return days;
  }, [currentYear, currentMonth, parsedValue, effectiveMin, effectiveMax, todayStr]);

  const yearOptions = useMemo(() => {
    const currentYr = new Date().getFullYear();
    const minYr = effectiveMin ? parseInt(effectiveMin.split("-")[0], 10) : 1940;
    const maxYr = effectiveMax ? parseInt(effectiveMax.split("-")[0], 10) : currentYr + 15;
    const start = Math.max(1940, minYr);
    const end = Math.min(2045, maxYr);
    const years: number[] = [];
    for (let y = end; y >= start; y--) {
      years.push(y);
    }
    return years;
  }, [effectiveMin, effectiveMax]);

  return (
    <div className={`w-full relative ${wrapperClassName}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-800 mb-1.5">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer flex items-center justify-center p-0.5 z-10"
          title="Open Calendar"
        >
          <CalendarIcon className={`w-4 h-4 ${isOpen ? "text-emerald-600" : "text-slate-400"}`} />
        </button>

        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          maxLength={10}
          disabled={disabled}
          required={required}
          className={`w-full bg-slate-50 border rounded-xl text-xs text-slate-800 font-medium pl-9 pr-8 py-2.5 transition focus:outline-none focus:bg-white ${
            isOpen
              ? "border-emerald-600 ring-2 ring-emerald-500/20"
              : validationError
              ? "border-rose-400 hover:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 hover:border-emerald-500 focus:border-emerald-600"
          } ${className}`}
        />

        {value && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-[100] bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 w-72 select-none animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setIsMonthPickerOpen(!isMonthPickerOpen);
                  setIsYearPickerOpen(false);
                }}
                className="px-2 py-1 rounded-lg hover:bg-emerald-50 text-emerald-700 font-black transition-colors cursor-pointer"
                title="Select month"
              >
                {MONTH_NAMES[currentMonth]}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsYearPickerOpen(!isYearPickerOpen);
                  setIsMonthPickerOpen(false);
                }}
                className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
                title="Select year"
              >
                {currentYear}
              </button>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isYearPickerOpen && (
            <div className="grid grid-cols-4 gap-1 max-h-48 overflow-y-auto py-1 mb-2">
              {yearOptions.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(yr, currentMonth, 1));
                    setIsYearPickerOpen(false);
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    yr === currentYear
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          )}

          {isMonthPickerOpen && (
            <div className="grid grid-cols-3 gap-1.5 py-1 mb-2">
              {MONTH_NAMES.map((mName, mIdx) => (
                <button
                  key={mName}
                  type="button"
                  onClick={() => {
                    setViewDate(new Date(currentYear, mIdx, 1));
                    setIsMonthPickerOpen(false);
                  }}
                  className={`py-1.5 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mIdx === currentMonth
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {mName.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {!isYearPickerOpen && !isMonthPickerOpen && (
            <>
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {DAYS_SHORT.map((day) => (
                  <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarGrid.map((item, idx) => {
                  const dayNumber = item.date.getDate();

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={item.isDisabled}
                      onClick={() => handleSelectDate(item.date)}
                      className={`h-7 w-7 mx-auto rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-100 ${
                        item.isDisabled
                          ? "text-slate-300 line-through opacity-30 cursor-not-allowed bg-transparent select-none pointer-events-none"
                          : item.isSelected
                          ? "bg-emerald-600 text-white font-bold shadow-xs scale-105 cursor-pointer"
                          : item.isToday
                          ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-300 cursor-pointer"
                          : item.isCurrentMonth
                          ? "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                          : "text-slate-300 hover:bg-slate-50 hover:text-slate-500 cursor-pointer"
                      }`}
                    >
                      {dayNumber}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              disabled={isTodayDisabled}
              onClick={handleSelectToday}
              className={`font-bold flex items-center gap-1 transition-colors ${
                isTodayDisabled
                  ? "text-slate-300 cursor-not-allowed opacity-50"
                  : "text-emerald-600 hover:underline cursor-pointer"
              }`}
            >
              <RotateCcw className="w-3 h-3" /> Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="font-semibold text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {validationError && (
        <p className="text-[11px] font-medium text-rose-500 mt-1">
          {validationError}
        </p>
      )}
      {helperText && !validationError && (
        <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
      )}
    </div>
  );
};
