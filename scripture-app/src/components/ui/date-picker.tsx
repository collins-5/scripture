import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import Icon from './icon';
import { Input } from './input';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useThemePreference } from '@/hooks/use-theme-preference';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  formatDate?: (date: Date) => string;
  allowManualInput?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

const defaultFormatDate = (date: Date): string => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

const formatDateInput = (input: string): string => {
  const cleaned = input.replace(/\D/g, '');
  let formatted = '';
  if (cleaned.length >= 1) formatted += cleaned.substring(0, 2);
  if (cleaned.length >= 3) formatted += '/' + cleaned.substring(2, 4);
  if (cleaned.length >= 5) formatted += '/' + cleaned.substring(4, 8);
  return formatted.substring(0, 10);
};

const parseDateInput = (input: string): Date | null => {
  const parts = input.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && 
        day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return date;
      }
    }
  }
  return null;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  error,
  description,
  required = false,
  disabled = false,
  maximumDate,
  minimumDate,
  formatDate = defaultFormatDate,
  allowManualInput = false,
  containerClassName = '',
  labelClassName = '',
}) => {
  const { brand, text, surface, border, red, ui } = useThemeColors();
  const { isDark } = useThemePreference();

  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());
  const [manualInput, setManualInput] = useState('');
  const [inputError, setInputError] = useState<string | undefined>(error);

  const maxDate = maximumDate || new Date();
  const minDate = minimumDate || new Date(1920, 0, 1);

  // Sync manual input when value changes from parent (this fixes DOB not showing)
  useEffect(() => {
    if (value) {
      setManualInput(formatDate(value));
    } else {
      setManualInput('');
    }
  }, [value, formatDate]);

  // Sync error prop
  useEffect(() => {
    setInputError(error);
  }, [error]);

  const safeOnChange = (date: Date | null) => {
    if (onChange && typeof onChange === 'function') {
      onChange(date);
    }
  };

  const openDatePicker = () => {
    if (disabled) return;
    
    const initialDate = value || new Date(2000, 0, 1);

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialDate,
        mode: 'date',
        display: 'default',
        maximumDate: maxDate,
        minimumDate: minDate,
        positiveButton: { label: 'OK', textColor: brand.primary },
        negativeButton: { label: 'Cancel', textColor: text.muted },
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            safeOnChange(selectedDate);
            setManualInput(formatDate(selectedDate));
            setInputError(undefined);
          }
        },
      });
      return;
    }

    setTempDate(initialDate);
    setShowPicker(true);
  };

  const handleManualInputChange = (text: string) => {
    const formatted = formatDateInput(text);
    setManualInput(formatted);
    
    if (formatted.length === 10) {
      const parsedDate = parseDateInput(formatted);
      if (parsedDate) {
        if (minDate && parsedDate < minDate) {
          setInputError(`Date must be after ${formatDate(minDate)}`);
          safeOnChange(null);
          return;
        }
        if (maxDate && parsedDate > maxDate) {
          setInputError(`Date must be before ${formatDate(maxDate)}`);
          safeOnChange(null);
          return;
        }
        setInputError(undefined);
        safeOnChange(parsedDate);
      } else {
        setInputError('Invalid date format');
        safeOnChange(null);
      }
    } else {
      setInputError(undefined);
      safeOnChange(null);
    }
  };

  const handleManualInputBlur = () => {
    if (manualInput.length === 10) {
      const parsedDate = parseDateInput(manualInput);
      if (parsedDate) {
        if (minDate && parsedDate < minDate) {
          setInputError(`Date must be after ${formatDate(minDate)}`);
          safeOnChange(null);
        } else if (maxDate && parsedDate > maxDate) {
          setInputError(`Date must be before ${formatDate(maxDate)}`);
          safeOnChange(null);
        } else {
          setInputError(undefined);
          safeOnChange(parsedDate);
          setManualInput(formatDate(parsedDate));
        }
      } else {
        setInputError('Invalid date format');
      }
    }
  };

  const handleClear = () => {
    safeOnChange(null);
    setManualInput('');
    setInputError(undefined);
  };

  const handleIosDone = () => {
    safeOnChange(tempDate);
    setManualInput(formatDate(tempDate));
    setInputError(undefined);
    setShowPicker(false);
  };

  const handleIosCancel = () => {
    setShowPicker(false);
  };

  const rightIcon = (
    <TouchableOpacity onPress={openDatePicker} disabled={disabled}>
      <Icon
        name="calendar"
        size={20}
        color={value ? brand.primary : text.placeholder}
      />
    </TouchableOpacity>
  );

  const clearIcon = value ? (
    <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Icon name="close-circle" size={18} color={text.placeholder} />
    </TouchableOpacity>
  ) : null;

  const combinedRightIcon = (
    <View className="flex-row items-center gap-1">
      {clearIcon}
      {rightIcon}
    </View>
  );

  return (
    <View className={cn('mb-3', containerClassName)}>
      {allowManualInput ? (
        <Input
          label={label}
          value={manualInput}
          onChangeText={handleManualInputChange}
          onBlur={handleManualInputBlur}
          placeholder={placeholder}
          error={inputError}
          description={description}
          required={required}
          keyboardType="numeric"
          maxLength={10}
          rightIcon={combinedRightIcon}
          labelClassName={labelClassName}
          leftIcon={<Icon name="calendar-edit" size={20} />}
        />
      ) : (
        <>
          {label && (
            <View className="flex-row items-center mb-1.5">
              <Text className="text-sm font-medium" style={{ color: text.dark }}>
                {label}
              </Text>
              {required && (
                <Text className="text-sm ml-0.5" style={{ color: red.accent }}>*</Text>
              )}
            </View>
          )}
          
          <TouchableOpacity
            onPress={openDatePicker}
            disabled={disabled}
            style={{
              minHeight: 48,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: error ? red.accent : text.placeholder,
              backgroundColor: disabled ? surface.muted : surface.card,
            }}
            className="flex-row items-center px-3"
            activeOpacity={disabled ? 1 : 0.75}
          >
            <Text
              className="flex-1 text-base py-3"
              style={{ color: value ? text.dark : text.placeholder }}
            >
              {value ? formatDate(value) : placeholder}
            </Text>
            {value && !disabled && (
              <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} className="mr-2">
                <Icon name="close-circle" size={18} color={text.placeholder} />
              </TouchableOpacity>
            )}
            <Icon name="calendar" size={20} color={value ? brand.primary : text.placeholder} />
          </TouchableOpacity>
          
          {description && !error && (
            <Text className="text-xs mt-1.5" style={{ color: text.muted }}>{description}</Text>
          )}
          
          {error && (
            <Text className="text-xs mt-1.5" style={{ color: red.accent }}>{error}</Text>
          )}
        </>
      )}

      <Modal
        visible={Platform.OS === 'ios' && showPicker}
        transparent
        animationType="slide"
        onRequestClose={handleIosCancel}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: ui.overlay }}>
          <View className="rounded-tl-3xl rounded-tr-3xl pb-10" style={{ backgroundColor: surface.card }}>
            <View className="flex-row justify-between items-center px-6 pt-5 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: border.light }}>
              <TouchableOpacity onPress={handleIosCancel}>
                <Text className="text-base" style={{ color: text.muted }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleIosDone}>
                <Text className="text-base font-semibold" style={{ color: brand.primary }}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              themeVariant={isDark ? 'dark' : 'light'}
              textColor={text.dark}
              accentColor={brand.primary}
              maximumDate={maxDate}
              minimumDate={minDate}
              onChange={(_, selectedDate) => {
                if (selectedDate) setTempDate(selectedDate);
              }}
              style={{ height: 200 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};