import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

export interface AlertButton {
  text: string;
  style?: 'cancel' | 'destructive' | 'default';
  onPress?: () => void | Promise<void>;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'question';
  buttons?: AlertButton[];
  onClose?: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  buttons,
  onClose,
}: CustomAlertProps) {
  const { isRTL, t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  if (!visible) return null;

  // Determine Icon and Color based on type
  let iconName: keyof typeof Ionicons.glyphMap = 'information-circle-outline';
  let iconColor: string = Colors.primary;
  let bgIconColor: string = Colors.primarySurface;

  switch (type) {
    case 'success':
      iconName = 'checkmark-circle-outline';
      iconColor = Colors.success;
      bgIconColor = Colors.successSurface;
      break;
    case 'error':
      iconName = 'alert-circle-outline';
      iconColor = Colors.error;
      bgIconColor = Colors.errorSurface;
      break;
    case 'warning':
      iconName = 'warning-outline';
      iconColor = Colors.warning;
      bgIconColor = Colors.warningSurface;
      break;
    case 'question':
      iconName = 'help-circle-outline';
      iconColor = Colors.primary;
      bgIconColor = Colors.primarySurface;
      break;
  }

  const handleButtonPress = (btn: AlertButton) => {
    if (btn.onPress) {
      const res = btn.onPress();
      if (res instanceof Promise) {
        res.catch(() => {});
      }
    }
    if (onClose) {
      onClose();
    }
  };

  const defaultButtons: AlertButton[] = [
    {
      text: t('ok') || 'OK',
      style: 'default',
    },
  ];

  const activeButtons = buttons && buttons.length > 0 ? buttons : defaultButtons;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Semi-transparent Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.backdropClickable} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* Dialog Container */}
        <Animated.View
          style={[
            styles.dialogCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Top Decorative Color Icon */}
          <View style={[styles.iconContainer, { backgroundColor: bgIconColor }]}>
            <Ionicons name={iconName} size={36} color={iconColor} />
          </View>

          {/* Title & Message */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons Area */}
          <View style={[styles.buttonRow, activeButtons.length > 2 && styles.buttonColumn]}>
            {activeButtons.map((btn, index) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';

              let btnStyle: ViewStyle = styles.btnDefault;
              let btnTextStyle: TextStyle = styles.btnTextDefault;

              if (isCancel) {
                btnStyle = styles.btnCancel;
                btnTextStyle = styles.btnTextCancel;
              } else if (isDestructive) {
                btnStyle = styles.btnDestructive;
                btnTextStyle = styles.btnTextDestructive;
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.btnBase,
                    btnStyle,
                    activeButtons.length > 2 && styles.btnColumnBase,
                  ]}
                  onPress={() => handleButtonPress(btn)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.btnTextBase, btnTextStyle]}>{btn.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(22, 22, 22, 0.7)',
  },
  backdropClickable: {
    flex: 1,
  },
  dialogCard: {
    width: Math.min(width * 0.85, 340),
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.circle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 19,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    lineHeight: 25,
    letterSpacing: -0.1,
  },
  message: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 21,
    paddingHorizontal: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  buttonColumn: {
    flexDirection: 'column',
    width: '100%',
  },
  btnBase: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  btnColumnBase: {
    flex: 0,
    width: '100%',
  },
  btnTextBase: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    letterSpacing: 0.1,
  },
  btnDefault: {
    backgroundColor: Colors.primary,
    ...Shadow.glow,
  },
  btnTextDefault: {
    color: Colors.white,
  },
  btnCancel: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    elevation: 0,
    shadowOpacity: 0,
  },
  btnTextCancel: {
    color: Colors.textSecondary,
  },
  btnDestructive: {
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.error + '20',
  },
  btnTextDestructive: {
    color: Colors.error,
  },
});
