"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Calendar } from "./calendar"

export function DatePickerWithRange({
  className,
  value,
  onChange,
  label
}: {
  className?: string;
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  label: string;
}) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(value || {
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  })

  const date = value !== undefined ? value : internalDate;
  const setDate = onChange !== undefined ? onChange : setInternalDate;

  return (
    <Field className={cn("grid gap-1.5", className)}>
      <FieldLabel htmlFor="date-picker-range">{label}</FieldLabel>
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
