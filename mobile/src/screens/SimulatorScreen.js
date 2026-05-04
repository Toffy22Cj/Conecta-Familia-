import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';
import api from '../services/api';
import Icon from '../components/Icon';

const FALLBACK_SCENARIO = {
  id: 'demo-1',
  title: 'Conflicto por el uso del móvil',
  description: 'Tu hijo adolescente se niega a dejar el móvil durante la cena. ¿Cómo reaccionas?',
  options: [
    { id: 'opt1', text: 'Gritarle y quitarle el teléfono por la fuerza.', feedback: 'Esto genera una respuesta defensiva y cierra el canal de comunicación.', isCorrect: false },
    { id: 'opt2', text: 'Ignorarlo y cenar en silencio con tensión.', feedback: 'La indiferencia no resuelve el problema subyacente.', isCorrect: false },
    { id: 'opt3', text: 'Explicar por qué es importante el tiempo juntos y proponer una zona libre de tecnología.', feedback: '¡Excelente! La comunicación asertiva fomenta el respeto mutuo.', isCorrect: true },
  ]
};

const SimulatorScreen = ({ navigation }) => {
  const [scenarios, setScenarios] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    try {
      const response = await api.get('/simulator/scenarios');
      if (response.data && response.data.length > 0) {
        setScenarios(response.data);
        setCurrentScenario(response.data[0]);
      } else {
        // Usar fallback si no hay datos en MongoDB
        setScenarios([FALLBACK_SCENARIO]);
        setCurrentScenario(FALLBACK_SCENARIO);
      }
    } catch (error) {
      console.error(error);
      setScenarios([FALLBACK_SCENARIO]);
      setCurrentScenario(FALLBACK_SCENARIO);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (option) => {
    setSelectedOption(option);
    setSubmitting(true);
    
    try {
      const userData = await api.get('/auth/me').catch(() => ({ data: { id: 1 } })); // Fallback ID
      
      await api.post('/simulator/submit', {
        userId: userData.data?.id || 1,
        scenarioId: currentScenario.id,
        choicesMade: [{
          step: 1,
          choice: option.text,
          isCorrect: option.isCorrect
        }],
        completed: true
      });
    } catch (error) {
      console.error('Error submitting log:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextScenario = () => {
    const currentIndex = scenarios.indexOf(currentScenario);
    if (currentIndex < scenarios.length - 1) {
      setCurrentScenario(scenarios[currentIndex + 1]);
      setSelectedOption(null);
    } else {
      Alert.alert('¡Felicidades!', 'Has completado todos los escenarios disponibles.', [
        { text: 'Ir al Inicio', onPress: () => navigation.navigate('Home') }
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrowLeft" color={colors.textMain} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Simulador de Conflictos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scenarioCard}>
          <View style={styles.iconWrapper}>
            <Icon name="messageSquare" color="#fff" size={32} />
          </View>
          <Text style={styles.scenarioTitle}>{currentScenario.title}</Text>
          <Text style={styles.scenarioDescription}>{currentScenario.description}</Text>
        </View>

        <Text style={styles.label}>¿Qué harías?</Text>

        <View style={styles.optionsList}>
          {currentScenario.options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedOption?.id === option.id && (option.isCorrect ? styles.correctOption : styles.incorrectOption)
              ]}
              onPress={() => !selectedOption && handleOptionSelect(option)}
              disabled={!!selectedOption}
            >
              <Text style={[
                styles.optionText,
                selectedOption?.id === option.id && styles.selectedOptionText
              ]}>{option.text}</Text>
              
              {selectedOption?.id === option.id && (
                option.isCorrect ? (
                  <Icon name="checkCircle" color="#fff" size={20} />
                ) : (
                  <Icon name="xCircle" color="#fff" size={20} />
                )
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption && (
          <View style={[
            styles.feedbackCard,
            { backgroundColor: selectedOption.isCorrect ? '#ECFDF5' : '#FEF2F2' }
          ]}>
            <Text style={[
              styles.feedbackTitle,
              { color: selectedOption.isCorrect ? '#065F46' : '#991B1B' }
            ]}>
              {selectedOption.isCorrect ? '¡Muy bien!' : 'Podría ser mejor'}
            </Text>
            <Text style={styles.feedbackText}>{selectedOption.feedback}</Text>
            
            <TouchableOpacity style={styles.nextButton} onPress={nextScenario}>
              <Text style={styles.nextButtonText}>Siguiente Escenario</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    padding: spacing.xl,
  },
  scenarioCard: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: spacing.md,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  scenarioTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  scenarioDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionButton: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: colors.textMain,
    flex: 1,
    marginRight: spacing.sm,
  },
  correctOption: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  incorrectOption: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  feedbackCard: {
    marginTop: spacing.xl,
    padding: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  feedbackText: {
    fontSize: 15,
    color: colors.textMain,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  nextButton: {
    backgroundColor: colors.dark,
    padding: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default SimulatorScreen;
