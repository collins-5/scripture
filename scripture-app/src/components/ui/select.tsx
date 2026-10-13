import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
}

export function Select({
  label,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  error,
  required,
  disabled = false,
  containerClassName,
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { surface, border, text, brand, red } = useThemeColors();

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setModalVisible(false);
  };

  return (
    <View className={cn('mb-4', containerClassName)}>
      {label && <Label required={required}>{label}</Label>}

      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        style={{
          backgroundColor: disabled ? surface.muted : surface.card,
          borderColor: error ? '#ef4444' : border.medium,
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 16, color: selectedOption ? text.dark : text.muted }}>
          {selectedOption?.label || placeholder}
        </Text>
        <Text style={{ color: text.muted, fontSize: 18 }}>▼</Text>
      </TouchableOpacity>

      {error && (
        <Text className="text-sm mt-1" style={{ color: red.accent }}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: surface.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: 384 }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: border.light, padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', color: text.dark }}>
                    {label || 'Select Option'}
                  </Text>
                </View>
                <FlatList
                  data={options}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelect(item.value)}
                      style={{
                        padding: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: border.faint,
                        backgroundColor: value === item.value ? brand.primaryLight : surface.card,
                      }}
                    >
                      <Text style={{
                        fontSize: 16,
                        color: value === item.value ? brand.primary : text.dark,
                        fontWeight: value === item.value ? '600' : '400',
                      }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ padding: 16, borderTopWidth: 1, borderTopColor: border.light }}
                >
                  <Text style={{ textAlign: 'center', color: text.muted, fontWeight: '600' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
