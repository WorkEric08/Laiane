import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';

// --- PHONE INPUT ---
export function PhoneInput({ value, onChange, placeholder, className, required }: any) {
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(formatPhone(value || ''));
  }, [value]);

  const formatPhone = (val: string) => {
    const numbers = val.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setInternalValue(formatted);
    onChange(formatted);
  };

  const handleBlur = () => {
    let numbers = internalValue.replace(/\D/g, '');
    // Auto insert 9 if length is 10 (DDD + 8 digits)
    if (numbers.length === 10) {
      numbers = `${numbers.slice(0, 2)}9${numbers.slice(2)}`;
      const formatted = formatPhone(numbers);
      setInternalValue(formatted);
      onChange(formatted);
    }
  };

  return (
    <input
      type="tel"
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder || '(00) 90000-0000'}
      className={className}
      required={required}
    />
  );
}

// --- CURRENCY INPUT ---
export function CurrencyInput({ value, onChange, className, required }: any) {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numbers = rawValue.replace(/\D/g, '');
    if (!numbers) {
      onChange(0);
      return;
    }
    const floatValue = parseInt(numbers, 10) / 100;
    onChange(floatValue);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={formatCurrency(value || 0)}
      onChange={handleChange}
      className={className}
      required={required}
    />
  );
}

// --- CUSTOM SELECT ---
export function CustomSelect({ value, onChange, options, placeholder, className, disabled }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o: any) => o.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex items-center justify-between text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-brand-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-brand-surface border border-brand-border rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
          >
            {options.map((opt: any) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-brand-bg ${value === opt.value ? 'bg-brand-bg text-brand-accent font-bold' : 'text-brand-text-primary'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- CUSTOM DATE PICKER ---
export function CustomDatePicker({ value, onChange, className, required }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tempDate, setTempDate] = useState(value || new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date(tempDate));

  useEffect(() => {
    if (value) setTempDate(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirm = () => {
    onChange(tempDate);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = tempDate === dateStr;
      
      days.push(
        <button
          key={dateStr}
          type="button"
          onClick={() => setTempDate(dateStr)}
          className={`p-2 w-8 h-8 flex items-center justify-center rounded-full text-xs transition-all ${
            isSelected 
              ? 'bg-brand-accent text-brand-bg font-bold shadow-md' 
              : 'text-brand-text-primary hover:bg-brand-bg'
          }`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const formatDisplay = (val: string) => {
    if (!val) return 'Selecionar Data';
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${className} flex items-center justify-between text-left cursor-pointer`}
      >
        <span>{formatDisplay(value)}</span>
        <CalendarIcon className="w-4 h-4 text-brand-text-secondary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 right-0 left-0 sm:left-auto sm:w-72 mt-2 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  className="p-1 text-brand-text-secondary hover:text-brand-text-primary"
                >
                  &lt;
                </button>
                <div className="font-bold text-sm text-brand-text-primary capitalize">
                  {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  className="p-1 text-brand-text-secondary hover:text-brand-text-primary"
                >
                  &gt;
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={i} className="text-[10px] font-bold text-brand-text-secondary">{d}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 justify-items-center">
                {renderCalendar()}
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full mt-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-bg font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Check className="w-4 h-4" />
                Confirmar Data
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
