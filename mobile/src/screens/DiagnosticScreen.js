import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';
import api from '../services/api';
import Icon from '../components/Icon';

const QUESTIONS = [
  { id: 1, text: '¿Con qué frecuencia realizan actividades recreativas en familia?' },
  { id: 2, text: '¿Cómo calificaría la comunicación entre los miembros del hogar?' },
  { id: 3, text: '¿Sienten que existe apoyo mutuo ante situaciones difíciles?' },
  { id: 4, text: '¿Se respetan los espacios y opiniones de cada integrante?' },
  { id: 5, text: '¿Existe una distribución equitativa de las tareas del hogar?' },
  { id: 6, text: '¿Cómo manejan los conflictos cuando surgen?' },
  { id: 7, text: '¿Se sienten escuchados por los demás miembros de la familia?' },
  { id: 8, text: '¿Dedican tiempo de calidad sin distracciones tecnológicas?' },
  { id: 9, text: '¿Expresan afecto y gratitud regularmente?' },
  { id: 10, text: '¿Confían plenamente en los otros miembros de la familia?' },
];

const DiagnosticScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (score) => {
    const newAnswers = [...answers, { questionId: QUESTIONS[currentQuestion].id, score }];
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitDiagnostic(newAnswers);
    }
  };

  const submitDiagnostic = async (finalAnswers) => {
    setLoading(true);
    try {
      const response = await api.post('/diagnostico/results', { answers: finalAnswers });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el diagnóstico.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContent}>
          <Icon name="checkCircle" color={colors.success} size={80} />
          <Text style={styles.resultTitle}>Diagnóstico Completado</Text>
          <View style={styles.resultCard}>
            <Text style={styles.profileLabel}>Tu Perfil:</Text>
            <Text style={[styles.profileValue, { color: result.profile === 'Riesgo Alto' ? colors.error : result.profile === 'Moderado' ? '#F59E0B' : colors.success }]}>
              {result.profile}
            </Text>
            <Text style={styles.scoreText}>Puntaje Total: {result.totalScore}</Text>
          </View>
          <TouchableOpacity 
            style={styles.doneButton} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.doneButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowLeft" color={colors.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diagnóstico Familiar</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.questionCounter}>Pregunta {currentQuestion + 1} de {QUESTIONS.length}</Text>
        <Text style={styles.questionText}>{QUESTIONS[currentQuestion].text}</Text>

        <View style={styles.optionsContainer}>
          {[
            { label: 'Nunca / Muy Mal', score: 2 },
            { label: 'Rara vez / Mal', score: 4 },
            { label: 'A veces / Regular', score: 6 },
            { label: 'Frecuentemente / Bien', score: 8 },
            { label: 'Siempre / Excelente', score: 10 },
          ].map((option, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionButton}
              onPress={() => handleAnswer(option.score)}
            >
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Icon name="chevronRight" color={colors.primary} size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Procesando diagnóstico...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.xl,
  },
  questionCounter: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: spacing.xxl,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionButton: {
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textMain,
    fontWeight: '600',
  },
  resultContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.dark,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  resultCard: {
    backgroundColor: colors.surface,
    padding: spacing.xxl,
    borderRadius: radius.lg,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
  },
  profileLabel: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  profileValue: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.md,
  },
  scoreText: {
    fontSize: 18,
    color: colors.textMain,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.md,
    marginTop: spacing.xxl,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default DiagnosticScreen;
