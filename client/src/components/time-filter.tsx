import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export interface TimeFilterValue {
  type: 'fixed' | 'rolling' | 'custom';
  range: string;
  startDate?: Date;
  endDate?: Date;
}

interface TimeFilterProps {
  value: TimeFilterValue;
  onChange: (value: TimeFilterValue) => void;
}

const FIXED_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'this_quarter', label: 'This Quarter' },
  { value: 'last_quarter', label: 'Last Quarter' },
  { value: 'this_year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
];

const ROLLING_PERIODS = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_14_days', label: 'Last 14 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'last_60_days', label: 'Last 60 Days' },
  { value: 'last_90_days', label: 'Last 90 Days' },
  { value: 'last_180_days', label: 'Last 180 Days' },
  { value: 'last_365_days', label: 'Last 365 Days' },
];

export default function TimeFilter({ value, onChange }: TimeFilterProps) {
  const [filterType, setFilterType] = useState<'fixed' | 'rolling' | 'custom'>(value.type);
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleTypeChange = (type: 'fixed' | 'rolling' | 'custom') => {
    setFilterType(type);
    if (type === 'custom') {
      setShowCustomRange(true);
      onChange({
        type: 'custom',
        range: 'custom',
        startDate: value.startDate || new Date(),
        endDate: value.endDate || new Date(),
      });
    } else {
      setShowCustomRange(false);
      const defaultRange = type === 'fixed' ? 'all' : 'last_30_days';
      onChange({
        type,
        range: defaultRange,
      });
    }
  };

  const handleRangeChange = (range: string) => {
    onChange({
      type: filterType,
      range,
    });
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      onChange({
        ...value,
        [field]: date,
      });
    }
  };

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Filter:</span>
          </div>
          
          <Select value={filterType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Ranges</SelectItem>
              <SelectItem value="rolling">Rolling Periods</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {filterType === 'fixed' && (
            <Select value={value.range} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIXED_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filterType === 'rolling' && (
            <Select value={value.range} onValueChange={handleRangeChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLLING_PERIODS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {filterType === 'custom' && (
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value.startDate ? format(value.startDate, "PPP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={value.startDate}
                    onSelect={(date) => handleCustomDateChange('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <span className="text-gray-500">to</span>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value.endDate ? format(value.endDate, "PPP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={value.endDate}
                    onSelect={(date) => handleCustomDateChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}