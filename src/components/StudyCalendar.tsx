import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface StudyCalendarProps {
  studiedDates?: string[]; // 학습한 날짜들 (YYYY-MM-DD 형식)
  currentStreak?: number;
  compact?: boolean; // 작은 버전
  studyColor?: 'green' | 'red'; // 학습 완료 색상
}

export function StudyCalendar({ 
  studiedDates = [
    "2025-10-16", "2025-10-17", "2025-10-18", "2025-10-19", "2025-10-20", "2025-10-21", "2025-10-22"
  ],
  currentStreak = 7,
  compact = false,
  studyColor = 'green'
}: StudyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isStudied = (date: Date) => {
    return studiedDates.includes(formatDateKey(date));
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const days = getCalendarDays(currentDate);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // 색상 클래스 정의
  const studiedBgClass = studyColor === 'red' ? 'bg-red-600' : 'bg-green-600';
  const studiedRingClass = studyColor === 'red' ? 'ring-red-600' : 'ring-green-600';

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Month Navigator */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-sm">
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day, index) => (
              <div 
                key={day} 
                className={`text-center text-[10px] py-1 ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const studied = isStudied(day);
              const today = isToday(day);
              const currentMonth = isCurrentMonth(day);

              return (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-[11px] rounded
                    ${!currentMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${today && !studied ? 'bg-orange-100 text-orange-900' : ''}
                    ${studied && !today ? `${studiedBgClass} text-white` : ''}
                    ${studied && today ? `${studiedBgClass} text-white ring-1 ${studiedRingClass} ring-offset-1` : ''}
                  `}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${studiedBgClass}`}></div>
            <span className="text-gray-600">학습</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-100"></div>
            <span className="text-gray-600">오늘</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">학습 달력</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
            <Flame className="w-4 h-4 text-orange-600" />
            <span>{currentStreak}일 연속</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-base">
            {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
              <div 
                key={day} 
                className={`text-center text-xs py-2 ${
                  index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const studied = isStudied(day);
              const today = isToday(day);
              const currentMonth = isCurrentMonth(day);

              return (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded
                    ${!currentMonth ? 'text-gray-300' : 'text-gray-700'}
                    ${today && !studied ? 'bg-orange-100 text-orange-900 font-medium' : ''}
                    ${studied && !today ? `${studiedBgClass} text-white font-medium` : ''}
                    ${studied && today ? `${studiedBgClass} text-white font-medium ring-2 ring-orange-500 ring-offset-2` : ''}
                  `}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-5 h-5 rounded ${studiedBgClass}`}></div>
            <span className="text-gray-600">학습 완료</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-5 h-5 rounded bg-orange-100"></div>
            <span className="text-gray-600">오늘</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
