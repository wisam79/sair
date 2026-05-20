import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../../src/hooks/useTranslation';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RatingScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const [rating, setRating] = useState(0);
  const handleStarPress = async (star: number) => {
    setRating(star);
    await Haptics.selectionAsync();
  };
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    { key: 'safe_driving', label: t('safe_driving') },
    { key: 'clean_bus', label: t('clean_bus') },
    { key: 'on_time', label: t('on_time') },
    { key: 'friendly_driver', label: t('friendly_driver') },
    { key: 'ac_active', label: t('ac_active') },
  ];

  const handleTagToggle = async (tagKey: string) => {
    await Haptics.selectionAsync();
    setSelectedTags((prev) =>
      prev.includes(tagKey) ? prev.filter((k) => k !== tagKey) : [...prev, tagKey],
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t('alert'), t('please_rate'));
      return;
    }

    try {
      setIsSubmitting(true);
      let finalComment = comment.trim();
      if (selectedTags.length > 0) {
        const tagsText = selectedTags
          .map((tKey) => tags.find((tg) => tg.key === tKey)?.label)
          .join('، ');
        finalComment = `[${tagsText}]${finalComment ? '\n' + finalComment : ''}`;
      }

      const { error } = await supabase.rpc('submit_rating', {
        p_trip_id: tripId,
        p_rating: rating,
        p_comment: finalComment || null,
      });

      if (error) throw error;

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('thank_you'), t('rating_success'), [
        { text: t('ok'), onPress: () => router.push('/') },
      ]);
    } catch (err: unknown) {
      Alert.alert(t('error'), err instanceof Error ? err.message : t('something_went_wrong'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: top + Spacing.xl }]}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('how_was_trip')}</Text>
          <Text style={styles.subtitle}>{t('rating_subtitle')}</Text>
        </View>

        <View style={[styles.starContainer, isRTL && { flexDirection: 'row-reverse' }]}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(star)} activeOpacity={0.7}>
              <Ionicons
                name={star <= rating ? 'star' : 'star-outline'}
                size={48}
                color={star <= rating ? Colors.warning : Colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Feedback Tags */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('select_favorite_tags')}
          </Text>
          <View style={[styles.tagsContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            {tags.map((tag) => {
              const active = selectedTags.includes(tag.key);
              return (
                <TouchableOpacity
                  key={tag.key}
                  style={[styles.tagChip, active && styles.tagChipActive]}
                  onPress={() => handleTagToggle(tag.key)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.tagText, active && styles.tagTextActive]}>{tag.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('additional_notes_optional')}
          </Text>
          <TextInput
            style={[styles.textInput, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('comment_placeholder')}
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, (rating === 0 || isSubmitting) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={rating === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitText}>{t('submit_rating')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.push('/')}
          disabled={isSubmitting}
        >
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, alignItems: 'center', paddingBottom: Spacing.xxxl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  starContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxxl },
  inputContainer: { width: '100%', marginBottom: Spacing.xxxl },
  label: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    height: 120,
    textAlignVertical: 'top',
    fontFamily: FontFamily.regular,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  disabledButton: { backgroundColor: Colors.border },
  submitText: { fontFamily: FontFamily.bold, fontSize: 18, color: Colors.white },
  skipButton: { padding: Spacing.md },
  skipText: { fontFamily: FontFamily.medium, fontSize: 16, color: Colors.textMuted },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  tagChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 2,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  tagChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  tagText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.primary,
    fontFamily: FontFamily.bold,
  },
});
