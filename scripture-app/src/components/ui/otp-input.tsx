import { useRef } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from './text';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const OTPInput = ({ length = 6, value = '', onChange, error }: OTPInputProps) => {
  const inputRefs = useRef<TextInput[]>([]);
  const valueArray = (value || '').split('');

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...valueArray];
    newCode[index] = text;
    const updatedCode = newCode.join('');
    onChange(updatedCode);

    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !valueArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (text: string) => {
    if (text.length >= length) {
      const code = text.slice(0, length);
      onChange(code);
      inputRefs.current[length - 1]?.focus();
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row justify-between space-x-2">
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            className={`h-12 mr-1 flex-1 rounded-lg border text-center text-base
              ${error ? 'border-destructive' : 'border-muted-foreground'}
              bg-muted text-foreground`}
            keyboardType="number-pad"
            maxLength={1}
            value={valueArray[index] || ''}
            onChangeText={(text) => handleCodeChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onChange={(e) => {
              if (index === 0 && e.nativeEvent.text.length > 1) {
                handlePaste(e.nativeEvent.text);
              }
            }}
            autoCapitalize="none"
            textAlign="center"
            selectTextOnFocus
          />
        ))}
      </View>
      {error && <Text className="mt-2 text-sm text-destructive">{error}</Text>}
    </View>
  );
};

export default OTPInput;