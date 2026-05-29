import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadow, FontFamily } from '../theme';
import { useTranslation } from '../hooks/useTranslation';

interface FormInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  isRTL: boolean;
  onFocus?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  maxLength?: number;
  autoCorrect?: boolean;
}

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  placeholder,
  icon,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  isRTL,
  onFocus,
  style,
  inputStyle,
  maxLength,
  autoCorrect = true,
}: FormInputProps<TFieldValues>) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const isPassword = secureTextEntry;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={[{ marginBottom: Spacing.md }, style]}>
          <View
            collapsable={false}
            style={[
              styles.inputWrapper,
              error && styles.inputError,
              focused && styles.inputFocused,
            ]}
          >
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={focused ? Colors.primary : Colors.textMuted}
                style={styles.inputIcon}
              />
            )}
            <TextInput
              style={[
                styles.input,
                isRTL && styles.inputRTL,
                isPassword && styles.inputPassword,
                !isRTL && (name === 'email' || name === 'password') && { textAlign: 'left' },
                inputStyle,
              ]}
              placeholder={placeholder}
              placeholderTextColor={Colors.textMuted}
              value={value || ''}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocused(false);
              }}
              onFocus={() => {
                setFocused(true);
                if (onFocus) onFocus();
              }}
              secureTextEntry={isPassword && !showPassword}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              maxLength={maxLength}
              autoCorrect={autoCorrect}
            />
            {isPassword && (
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>
          {error?.message && <Text style={styles.errorText}>{t(error.message)}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginEnd: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.text,
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputPassword: {
    flex: 1,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginHorizontal: Spacing.xs,
  },
});
