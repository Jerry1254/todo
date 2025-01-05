'use client'

import { useState } from 'react'
import { TodoProvider } from '../../contexts/TodoContext'
import { CalendarPicker } from '../../components/calendar-picker'
import { TimelineView } from '../../components/timeline-view'

function HistoryContent() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="min-h-screen bg-white">
      <CalendarPicker 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />
      <TimelineView selectedDate={selectedDate} />
    </div>
  )
}

export default function HistoryPage() {
  return (
    <TodoProvider>
      <HistoryContent />
    </TodoProvider>
  )
}

