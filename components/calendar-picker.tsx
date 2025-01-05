'use client'

import { useEffect, useRef, useState } from 'react'
import { format, addDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarIcon } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface CalendarPickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function CalendarPicker({ selectedDate, onDateSelect }: CalendarPickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const today = new Date()
  const [open, setOpen] = useState(false)
  
  const dates = Array.from({ length: 31 }, (_, i) => {
    const date = addDays(selectedDate, i - 15)
    return {
      date,
      dayName: format(date, 'EEE', { locale: zhCN }), // 使用中文星期
      dayNumber: format(date, 'd'),
      isSelected: format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'),
      isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    }
  })

  useEffect(() => {
    if (scrollRef.current) {
      const itemWidth = 80
      const containerWidth = scrollRef.current.offsetWidth
      const scrollPosition = (15 * itemWidth) - (containerWidth / 2) + (itemWidth / 2)
    
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        })
      })
    }
  }, [selectedDate])

  return (
    <div className="px-4">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-calendar {
          width: 100% !important;
          background: transparent !important;
        }
        .custom-calendar .rdp-months {
          justify-content: center;
        }
        .custom-calendar .rdp-cell {
          font-size: 1rem;
        }
        .custom-calendar .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        .custom-calendar .rdp-day_selected {
          background-color: black !important;
          color: white !important;
        }
        .custom-calendar .rdp-button:focus-visible:not([disabled]) {
          background-color: rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          日程{" "}
          <span 
            className="text-[#908986] flex items-center gap-2 cursor-pointer hover:text-black transition-colors" 
            onClick={() => setOpen(true)}
          >
            {format(selectedDate, 'M月d日', { locale: zhCN })}
            <CalendarIcon className="h-5 w-5" />
          </span>
        </h1>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[500px] p-0">
          <SheetHeader className="px-4 py-6 border-b">
            <SheetTitle className="text-2xl font-bold">选择日期</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onDateSelect(date)
                  setOpen(false)
                }
              }}
              className="custom-calendar"
              locale={zhCN}
              showOutsideDays={false}
              initialFocus
            />
          </div>
        </SheetContent>
      </Sheet>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 no-scrollbar touch-pan-x"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory'
        }}
      >
        {dates.map(({ date, dayName, dayNumber, isSelected, isToday }) => (
          <button
            key={date.toISOString()}
            onClick={() => onDateSelect(date)}
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded-lg border flex flex-col items-center justify-center scroll-snap-align-center transition-all",
              isSelected ? "border-black" : "border-gray-200",
              isToday ? "bg-black text-white" : "",
              isToday && isSelected ? "border-white" : "",
              !isSelected && !isToday && "hover:border-gray-400"
            )}
            style={{ scrollSnapAlign: 'center' }}
          >
            <span className={cn(
              "text-sm",
              isToday ? "text-white" : "text-gray-500"
            )}>{dayName}</span>
            <span className={cn(
              "text-lg font-semibold",
              isToday ? "text-white" : ""
            )}>{dayNumber}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

