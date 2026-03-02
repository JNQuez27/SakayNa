import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../theme';

const { width } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export default function LoginScreen({ onFinish }: Props) {
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formTranslate = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 70,
        friction: 8,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(formTranslate, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 10,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />

      {/* Header */}
      <View style={styles.header}>
        <Animated.View
          style={[styles.logoBox, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
        >
          <View style={[styles.logoCard, Shadows.lg]}>
            <Text style={styles.logoIcon}>🚌</Text>
          </View>
          <Text style={styles.brandName}>
            Sakay<Text style={styles.brandAccent}>Na</Text>
          </Text>
          <Text style={styles.brandSub}>Ang iyong maaasahang sakay</Text>
        </Animated.View>
      </View>

      {/* Form */}
      <Animated.View
        style={[
          styles.formCard,
          Shadows.md,
          { opacity: formOpacity, transform: [{ translateY: formTranslate }] },
        ]}
      >
        <Text style={styles.formTitle}>Mag-login</Text>
        <Text style={styles.formSub}>Ilagay ang iyong phone number para makapasok.</Text>

        <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
          <Text style={styles.inputPrefix}>+63</Text>
          <View style={styles.inputDivider} />
          <TextInput
            style={styles.input}
            placeholder="9XX XXX XXXX"
            placeholderTextColor={Colors.gray400}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            selectionColor={Colors.primary}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, !phone && styles.loginBtnDisabled, Shadows.md]}
          onPress={phone.length >= 10 ? onFinish : undefined}
          activeOpacity={0.8}
        >
          <Text style={styles.loginBtnText}>Magpatuloy</Text>
          <Text style={styles.loginBtnArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.guestBtn} onPress={onFinish}>
          <Text style={styles.guestBtnText}>Magpatuloy bilang Bisita</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Sa pag-login, sumasang-ayon ka sa aming Terms of Service
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  logoBox: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCard: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logoIcon: {
    fontSize: 40,
  },
  brandName: {
    fontSize: Typography.fontSizes['3xl'],
    fontWeight: Typography.fontWeights.extrabold,
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: Colors.secondary,
  },
  brandSub: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
    marginTop: Spacing.xs,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  formTitle: {
    fontSize: Typography.fontSizes.xl,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.primaryDark,
  },
  formSub: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray500,
    marginBottom: Spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    height: 52,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.gray100,
  },
  inputWrapperFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  inputPrefix: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.primaryDark,
  },
  inputDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSizes.md,
    color: Colors.gray700,
    fontWeight: Typography.fontWeights.medium,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 52,
    gap: Spacing.sm,
  },
  loginBtnDisabled: {
    backgroundColor: Colors.gray300,
  },
  loginBtnText: {
    fontSize: Typography.fontSizes.lg,
    fontWeight: Typography.fontWeights.bold,
    color: Colors.white,
  },
  loginBtnArrow: {
    fontSize: Typography.fontSizes.lg,
    color: Colors.white,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray200,
  },
  dividerText: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.gray400,
  },
  guestBtn: {
    height: 48,
    borderWidth: 1.5,
    borderColor: Colors.gray200,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBtnText: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.gray600,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.gray400,
    textAlign: 'center',
  },
});
