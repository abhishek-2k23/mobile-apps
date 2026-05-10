import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';


export default function App() {
  const [screen, setScreen] = useState('SIGN_IN');

  // --- UI Components ---

  const Logo = () => (
    <View style={styles.logoContainer}>
      <MaterialCommunityIcons name="rhombus-split" size={60} color="#83CC00" />
    </View>
  );

  const SocialButtons = () => (
    <View style={styles.socialRow}>
      <TouchableOpacity style={styles.socialIcon}><FontAwesome name="facebook" size={24} color="black" /></TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon}><FontAwesome name="google" size={24} color="black" /></TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon}><FontAwesome name="instagram" size={24} color="black" /></TouchableOpacity>
    </View>
  );

  // --- Screen Views ---

  const SignInView = () => (
    <View style={styles.content}>
      <Logo />
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Let's experience the joy of telecare AI.</Text>
      
      <Text style={styles.label}>Email Address</Text>
      <View style={[styles.inputContainer, styles.inputActive]}>
        <Ionicons name="mail-outline" size={20} color="#666" />
        <TextInput style={styles.input}  />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" />
        <TextInput style={styles.input} placeholder="Enter your password..." secureTextEntry />
        <Ionicons name="eye-off-outline" size={20} color="#CCC" />
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Sign In  →</Text>
      </TouchableOpacity>

      <SocialButtons />

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => setScreen('SIGN_UP')}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => setScreen('FORGOT_PASSWORD')}>
        <Text style={styles.linkTextCentered}>Forgot your password?</Text>
      </TouchableOpacity>
    </View>
  );

  const SignUpView = () => (
    <View style={styles.content}>
      <Logo />
      <Text style={styles.title}>Sign Up For Free</Text>
      <Text style={styles.subtitle}>Sign up in 1 minute for free!</Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" />
        <TextInput style={styles.input} placeholder="Enter your email..." />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={[styles.inputContainer, styles.inputError]}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" />
        <TextInput style={styles.input} secureTextEntry value="********" />
      </View>

      <Text style={styles.label}>Password Confirmation</Text>
      <View style={[styles.inputContainer, styles.inputError]}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" />
        <TextInput style={styles.input} secureTextEntry value="*******" />
      </View>

      <View style={styles.errorBanner}>
        <MaterialCommunityIcons name="alert-circle" size={18} color="#FF4D4D" />
        <Text style={styles.errorText}>ERROR: Password do not match!</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Sign Up  →</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => setScreen('SIGN_IN')}>
          <Text style={styles.linkText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ForgotPasswordView = () => (
    <View style={styles.content}>
      <TouchableOpacity onPress={() => setScreen('SIGN_IN')} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={[styles.title, { marginTop: 20 }]}>Forgot Password</Text>
      <Text style={styles.subtitle}>Select which methods you'd like to reset.</Text>

      {/* Option Cards */}
      {[
        { id: 'email', icon: 'mail', title: 'Email Address', desc: 'Send via email address securely.' },
        { id: '2fa', icon: 'shield-checkmark', title: '2 Factor Authentication', desc: 'Send via 2FA securely.', active: true },
        { id: 'google', icon: 'lock-closed', title: 'Google Authenticator', desc: 'Send via authenticator securely.' }
      ].map((item) => (
        <TouchableOpacity key={item.id} style={[styles.optionCard, item.active && styles.optionCardActive]}>
          <View style={[styles.optionIconBox, item.active && styles.optionIconBoxActive]}>
            <Ionicons name={item.icon} size={20} color={item.active ? "#83CC00" : "#666"} />
          </View>
          <View>
            <Text style={styles.optionTitle}>{item.title}</Text>
            <Text style={styles.optionDesc}>{item.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[styles.primaryButton, { marginTop: 40 }]}>
        <Text style={styles.primaryButtonText}>Reset Password  →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {screen === 'SIGN_IN' && <SignInView />}
          {screen === 'SIGN_UP' && <SignUpView />}
          {screen === 'FORGOT_PASSWORD' && <ForgotPasswordView />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    backgroundColor: '#FAFAFA',
  },
  inputActive: {
    borderColor: '#83CC00',
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: '#FFDEDE',
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  errorBanner: {
    backgroundColor: '#FFECEC',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#83CC00',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#83CC00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    gap: 15,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  linkText: {
    color: '#83CC00',
    fontWeight: '700',
  },
  linkTextCentered: {
    color: '#83CC00',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 15,
    marginTop: 15,
    backgroundColor: '#FFF',
  },
  optionCardActive: {
    borderColor: '#83CC00',
    backgroundColor: '#F9FFF0',
  },
  optionIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionIconBoxActive: {
    backgroundColor: '#E8F5D3',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  optionDesc: {
    fontSize: 12,
    color: '#7C7C7C',
    marginTop: 2,
  },
});