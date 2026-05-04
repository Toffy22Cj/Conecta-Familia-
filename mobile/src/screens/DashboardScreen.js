import React, { useEffect, useState, useReducer, useMemo, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
  Animated,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightTheme, darkTheme, spacing, radius, typography } from "../theme/colors";
import {
  authService,
  retosService,
  foroService,
  citasService,
  diagnosticoService,
} from "../services/api";
import Icon from "../components/Icon";
import * as Notifications from "expo-notifications";

const forumMachineInitialState = {
  status: "idle",
  expandedThreads: [],
  commentDrafts: {},
  editingComment: null,
  loading: false,
  error: null,
};

function forumMachineReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, status: "loading", loading: true, error: null };
    case "LOAD_SUCCESS":
      return { ...state, status: "ready", loading: false, error: null };
    case "LOAD_ERROR":
      return { ...state, status: "error", loading: false, error: action.error };
    case "TOGGLE_THREAD": {
      const expanded = state.expandedThreads.includes(action.threadId);
      return {
        ...state,
        expandedThreads: expanded
          ? state.expandedThreads.filter((id) => id !== action.threadId)
          : [...state.expandedThreads, action.threadId],
      };
    }
    case "SET_COMMENT_DRAFT":
      return {
        ...state,
        commentDrafts: {
          ...state.commentDrafts,
          [action.threadId]: action.text,
        },
      };
    case "SET_EDITING_COMMENT":
      return {
        ...state,
        editingComment: action.payload,
      };
    case "RESET_COMMENT":
      return {
        ...state,
        commentDrafts: {
          ...state.commentDrafts,
          [action.threadId]: "",
        },
        editingComment: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.error, loading: false };
    default:
      return state;
  }
}

const askPermissionAndInit = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus;
};

const createStyles = (theme, width) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: theme.background,
    },
    tabBar: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      paddingVertical: spacing.xs,
    },
    tabActive: {
      backgroundColor: theme.primaryLight,
      borderRadius: radius.sm,
    },
    tabText: {
      fontSize: 12,
      color: theme.textMuted,
      marginTop: 2,
    },
    tabTextActive: {
      color: theme.primary,
      fontWeight: "600",
    },
    header: {
      marginBottom: spacing.lg,
    },
    welcomeText: {
      ...typography.h1,
      color: theme.text,
    },
    subtitle: {
      ...typography.body,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
    moodTracker: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: spacing.md,
    },
    moodBtn: {
      alignItems: "center",
      padding: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      width: width < 380 ? "30%" : "28%",
    },
    moodBtnActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    moodLabel: {
      ...typography.caption,
      color: theme.text,
      marginTop: spacing.xs,
    },
    moodLabelActive: {
      color: theme.white,
    },
    moodResponse: {
      ...typography.body,
      color: theme.text,
      marginTop: spacing.md,
      textAlign: "center",
    },
    moodResponseBold: {
      fontWeight: "600",
    },
    grid: {
      flexDirection: "column",
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    cardTitle: {
      ...typography.h3,
      color: theme.text,
    },
    badge: {
      backgroundColor: theme.primary,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
    },
    badgeText: {
      ...typography.caption,
      color: theme.white,
      fontWeight: "600",
    },
    cardContent: {
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    cardText: {
      ...typography.body,
      color: theme.textMuted,
      textAlign: "center",
      marginTop: spacing.sm,
    },
    viewMore: {
      ...typography.caption,
      color: theme.primary,
      textAlign: "right",
      fontWeight: "600",
    },
    challengeList: {
      marginBottom: spacing.sm,
    },
    challengeCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    challengeInfo: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    challengeTitle: {
      ...typography.body,
      fontWeight: "600",
      color: theme.text,
    },
    challengeDesc: {
      ...typography.caption,
      color: theme.textMuted,
    },
    forumList: {
      marginBottom: spacing.sm,
    },
    forumItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    forumInfo: {
      marginLeft: spacing.sm,
      flex: 1,
    },
    forumTitle: {
      ...typography.body,
      fontWeight: "600",
      color: theme.text,
    },
    forumMeta: {
      ...typography.caption,
      color: theme.textMuted,
    },
    sectionHeader: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h2,
      color: theme.text,
    },
    sectionSubtitle: {
      ...typography.body,
      color: theme.textMuted,
      marginTop: spacing.xs,
    },
    startBtn: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      borderRadius: radius.md,
      alignItems: "center",
    },
    startBtnText: {
      ...typography.button,
      color: theme.white,
    },
    questionContainer: {
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
    },
    questionNumber: {
      ...typography.caption,
      color: theme.primary,
      fontWeight: "600",
      marginBottom: spacing.sm,
    },
    questionText: {
      ...typography.h3,
      color: theme.text,
      marginBottom: spacing.lg,
    },
    optionsContainer: {
      flexDirection: "column",
    },
    optionBtn: {
      marginBottom: spacing.sm,
      backgroundColor: theme.background,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    optionText: {
      ...typography.body,
      color: theme.text,
    },
    resultsContainer: {
      alignItems: "center",
    },
    resultsTitle: {
      ...typography.h2,
      color: theme.text,
      marginBottom: spacing.lg,
    },
    resultCard: {
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: spacing.lg,
      borderLeftWidth: 4,
      width: "100%",
      alignItems: "center",
    },
    resultLevel: {
      ...typography.h1,
      fontWeight: "700",
      marginBottom: spacing.sm,
    },
    resultDesc: {
      ...typography.body,
      color: theme.textMuted,
      textAlign: "center",
      marginBottom: spacing.md,
    },
    resultScore: {
      ...typography.body,
      fontWeight: "600",
      color: theme.text,
    },
    restartBtn: {
      backgroundColor: theme.secondary,
      padding: spacing.md,
      borderRadius: radius.md,
      marginTop: spacing.lg,
    },
    restartBtnText: {
      ...typography.button,
      color: theme.white,
    },
    retosContainer: {
      flexDirection: "column",
    },
    retoCard: {
      marginBottom: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    retoCompleted: {
      opacity: 0.75,
    },
    retoHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    retoTitle: {
      ...typography.h3,
      color: theme.text,
      marginLeft: spacing.sm,
    },
    retoCategory: {
      ...typography.caption,
      color: theme.primary,
      marginLeft: spacing.sm,
    },
    retoDesc: {
      ...typography.body,
      color: theme.textMuted,
      marginBottom: spacing.md,
    },
    retoFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    retoDuration: {
      ...typography.caption,
      color: theme.textMuted,
    },
    btn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    btnPrimary: {
      backgroundColor: theme.primary,
    },
    btnSecondary: {
      backgroundColor: theme.secondary,
    },
    btnOutline: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    btnPrimaryText: {
      ...typography.button,
      color: theme.white,
    },
    btnOutlineText: {
      ...typography.button,
      color: theme.primary,
    },
    forumThreads: {
      flexDirection: "column",
    },
    threadCard: {
      marginBottom: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    threadHeader: {
      flexDirection: "row",
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.md,
    },
    avatarText: {
      ...typography.button,
      color: theme.white,
      fontWeight: "700",
    },
    threadInfo: {
      flex: 1,
    },
    threadTitle: {
      ...typography.h3,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    threadBody: {
      ...typography.body,
      color: theme.textMuted,
      marginBottom: spacing.sm,
    },
    threadMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
    },
    metaText: {
      ...typography.caption,
      color: theme.textMuted,
    },
    likeBtn: {
      flexDirection: "row",
      alignItems: "center",
    },
    likeText: {
      ...typography.caption,
      color: theme.textMuted,
      marginLeft: spacing.xs,
      ...typography.caption,
      color: theme.textMuted,
      marginLeft: spacing.xs,
    },
    likeTextActive: {
      color: theme.primary,
    },
    commentContainer: {
      marginTop: spacing.md,
      backgroundColor: theme.background,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.md,
    },
    commentInput: {
      backgroundColor: theme.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      minHeight: 48,
      textAlignVertical: "top",
    },
    commentActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: spacing.sm,
    },
    commentBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      backgroundColor: theme.primary,
    },
    commentBtnText: {
      ...typography.button,
      color: theme.white,
    },
    commentCard: {
      backgroundColor: theme.surface,
      padding: spacing.sm,
      borderRadius: radius.md,
      marginTop: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    commentAuthor: {
      ...typography.caption,
      fontWeight: "700",
      color: theme.text,
      marginBottom: spacing.xs,
    },
    commentBody: {
      ...typography.body,
      color: theme.textMuted,
      marginBottom: spacing.xs,
    },
    commentActionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    commentActionText: {
      ...typography.caption,
      color: theme.primary,
      fontWeight: "600",
    },
    emptyState: {
      alignItems: "center",
      padding: spacing.xl,
    },
    emptyText: {
      ...typography.body,
      color: theme.textMuted,
      marginTop: spacing.md,
    },
    citasContainer: {
      flexDirection: "column",
    },
    citaCard: {
      marginBottom: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    citaHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    citaName: {
      ...typography.h3,
      color: theme.text,
    },
    citaEspecialidad: {
      ...typography.caption,
      color: theme.primary,
    },
    citaDetails: {
      flexDirection: "column",
    },
    citaDetail: {
      ...typography.body,
      color: theme.textMuted,
      marginBottom: spacing.xs,
    },
    logoutBtn: {
      backgroundColor: theme.error,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.md,
      borderRadius: radius.md,
      marginTop: spacing.lg,
    },
    logoutText: {
      ...typography.button,
      color: theme.white,
      marginLeft: spacing.sm,
    },
    stateBadge: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.sm,
      backgroundColor: theme.primaryLight,
      alignSelf: "flex-start",
      marginTop: spacing.sm,
    },
    stateBadgeText: {
      ...typography.caption,
      color: theme.primary,
      fontWeight: "700",
    },
    statusBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    statusToggle: {
      padding: spacing.sm,
      borderRadius: radius.md,
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
    },
    statusToggleText: {
      ...typography.caption,
      color: theme.text,
    },
  });

const DashboardScreen = ({ navigation, themeMode, toggleTheme }) => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [user, setUser] = useState(null);
  const [retos, setRetos] = useState([]);
  const [foroThreads, setForoThreads] = useState([]);
  const [citas, setCitas] = useState([]);
  const [diagnosticoStep, setDiagnosticoStep] = useState(0);
  const [diagnosticoScore, setDiagnosticoScore] = useState(0);
  const [diagnosticoResponses, setDiagnosticoResponses] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [theme, setTheme] = useState(themeMode || "light");
  const [forumState, dispatchForumState] = useReducer(
    forumMachineReducer,
    forumMachineInitialState,
  );
  const [threadStateRefreshing, setThreadStateRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isDarkMode = theme === "dark";
  const activeTheme = useMemo(() => (isDarkMode ? darkTheme : lightTheme), [isDarkMode]);
  const styles = useMemo(() => createStyles(activeTheme, width), [activeTheme, width]);

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const initialize = async () => {
      await refreshData();
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.warn("No se pudo leer el usuario local:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    setTheme(themeMode || "light");
  }, [themeMode]);

  const refreshData = async () => {
    dispatchForumState({ type: "LOAD_START" });
    try {
      const [retosRes, threadsRes, citasRes] = await Promise.allSettled([
        retosService.getAll(),
        foroService.getThreads(),
        citasService.getAll(),
      ]);

      if (retosRes.status === "fulfilled") setRetos(retosRes.value);
      if (threadsRes.status === "fulfilled") setForoThreads(threadsRes.value);
      if (citasRes.status === "fulfilled") setCitas(citasRes.value);
      dispatchForumState({ type: "LOAD_SUCCESS" });
    } catch (error) {
      dispatchForumState({ type: "LOAD_ERROR", error: error.message });
      console.error("Error refreshing data:", error);
    }
  };

  const scheduleLocalNotification = async (title, body) => {
    const status = await askPermissionAndInit();
    if (status !== "granted") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
    });
  };

  const handleAnswer = (pts) => {
    setDiagnosticoScore((prev) => prev + pts);
    setDiagnosticoResponses((prev) => [
      ...prev,
      { questionId: diagnosticoStep, score: pts },
    ]);
    setDiagnosticoStep((prev) => prev + 1);
  };

  const resetDiagnostico = async () => {
    if (diagnosticoStep === 11 && diagnosticoResponses.length === 10) {
      try {
        await diagnosticoService.saveResult(diagnosticoResponses);
      } catch {
        console.warn("API saveResult failed.");
      }
    }
    setDiagnosticoStep(0);
    setDiagnosticoScore(0);
    setDiagnosticoResponses([]);
  };

  const toggleReto = async (id) => {
    try {
      await retosService.toggleComplete(id);
      setRetos((prev) =>
        prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
      );
      scheduleLocalNotification("Reto actualizado", "Tu reto ha cambiado de estado en el tablero.");
    } catch (error) {
      console.warn("API toggleReto failed.", error);
    }
  };

  const handleToggleLike = async (threadId) => {
    try {
      setThreadStateRefreshing(true);
      await foroService.toggleLike(threadId);
      await refreshData();
      scheduleLocalNotification("Foro actualizado", "Tu me gusta se actualizó correctamente.");
    } catch (error) {
      console.warn("Error toggling like:", error);
    } finally {
      setThreadStateRefreshing(false);
    }
  };

  const handleSubmitComment = async (threadId) => {
    const content = (forumState.commentDrafts[threadId] || "").trim();
    if (!content) {
      Alert.alert("Comentario vacío", "Escribe algo antes de publicar.");
      return;
    }

    try {
      await foroService.addComment(threadId, { content });
      dispatchForumState({ type: "RESET_COMMENT", threadId });
      await refreshData();
      scheduleLocalNotification("Comentario publicado", "Tu comentario fue agregado exitosamente.");
    } catch (error) {
      console.warn("Error publishing comment:", error);
    }
  };

  const handleEditComment = async (threadId, commentId, body) => {
    if (!body.trim()) {
      Alert.alert("Comentario vacío", "El comentario no puede estar vacío.");
      return;
    }
    try {
      await foroService.editComment(threadId, commentId, body);
      dispatchForumState({ type: "SET_EDITING_COMMENT", payload: null });
      await refreshData();
      scheduleLocalNotification("Comentario editado", "Tu comentario ha sido actualizado.");
    } catch (error) {
      console.warn("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (threadId, commentId) => {
    Alert.alert("Eliminar comentario", "¿Deseas eliminar este comentario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await foroService.deleteComment(threadId, commentId);
            await refreshData();
          } catch (error) {
            console.warn("Error deleting comment:", error);
          }
        },
      },
    ]);
  };

  const handleToggleThread = (threadId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatchForumState({ type: "TOGGLE_THREAD", threadId });
  };

  const handleThreadStateChange = async (threadId, event) => {
    try {
      setThreadStateRefreshing(true);
      await foroService.updateThreadState(threadId, event);
      await refreshData();
    } catch (error) {
      console.warn("Error changing thread state:", error);
    } finally {
      setThreadStateRefreshing(false);
    }
  };

  const renderInicio = () => (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Hola, Familia! 👋</Text>
        <Text style={styles.subtitle}>Bienvenido de nuevo a tu espacio seguro. ¿Cómo se sienten hoy?</Text>
        <View style={styles.moodTracker}>
          {[
            { key: "bien", icon: "smile", label: "Bien" },
            { key: "regular", icon: "meh", label: "Regular" },
            { key: "dificil", icon: "frown", label: "Difícil" },
          ].map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.moodBtn, selectedMood === m.key && styles.moodBtnActive]}
              onPress={() => setSelectedMood(m.key)}
            >
              <Icon name={m.icon} size={32} color={selectedMood === m.key ? activeTheme.white : activeTheme.primary} />
              <Text style={[styles.moodLabel, selectedMood === m.key && styles.moodLabelActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedMood && (
          <Text style={styles.moodResponse}>
            Has seleccionado: <Text style={styles.moodResponseBold}>{selectedMood === "bien" ? "😊 Bien" : selectedMood === "regular" ? "😐 Regular" : "😟 Difícil"}</Text> — ¡Gracias por compartir!
          </Text>
        )}
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => setActiveSection("diagnostico")}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Simulador de Convivencia</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Recomendado</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Icon name="activity" size={32} color={activeTheme.primary} />
            <Text style={styles.cardText}>Descubre el estado actual de tu convivencia familiar con nuestro simulador.</Text>
          </View>
          <Text style={styles.viewMore}>Empezar test →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setActiveSection("retos")}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Retos Semanales</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{retos.filter((r) => !r.completed).length} Pendientes</Text>
            </View>
          </View>
          <View style={styles.challengeList}>
            {retos.filter((r) => !r.completed).slice(0, 2).map((r) => (
              <View key={r.id} style={styles.challengeCard}>
                <Icon name="checkCircle" size={24} color={activeTheme.primary} />
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeTitle}>{r.title}</Text>
                  <Text style={styles.challengeDesc}>{r.desc?.substring(0, 60) || ""}{r.desc?.length > 60 ? "..." : ""}</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.viewMore}>Ver todos los retos →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setActiveSection("foro")}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Foro Comunitario</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{foroThreads.length} temas</Text>
            </View>
          </View>
          <View style={styles.forumList}>
            {foroThreads.slice(0, 2).map((t) => (
              <View key={t.id} style={styles.forumItem}>
                <Icon name="messageSquare" size={20} color={activeTheme.primary} />
                <View style={styles.forumInfo}>
                  <Text style={styles.forumTitle}>{t.title}</Text>
                  <Text style={styles.forumMeta}>{t.time} • {t.replies || 0} respuestas</Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.viewMore}>Ir al foro →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDiagnostico = () => {
    if (diagnosticoStep === 0) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Simulador de Convivencia</Text>
            <Text style={styles.sectionSubtitle}>Descubre el estado actual de tu convivencia familiar</Text>
          </View>
          <TouchableOpacity style={styles.startBtn} onPress={() => setDiagnosticoStep(1)}>
            <Text style={styles.startBtnText}>Comenzar Test</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }

    if (diagnosticoStep <= 10) {
      const question = questions[diagnosticoStep - 1];
      return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>Pregunta {diagnosticoStep} de 10</Text>
            <Text style={styles.questionText}>{question.q}</Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <TouchableOpacity key={index} style={styles.optionBtn} onPress={() => handleAnswer(option.pts)}>
                  <Text style={styles.optionText}>{option.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      );
    }

    const getResult = () => {
      const percentage = (diagnosticoScore / 100) * 100;
      if (percentage >= 80) return { level: 'Excelente', color: '#10B981', desc: '¡Tu familia tiene una convivencia saludable!' };
      if (percentage >= 60) return { level: 'Buena', color: '#3B82F6', desc: 'Hay aspectos positivos, pero puedes mejorar algunos puntos.' };
      if (percentage >= 40) return { level: 'Regular', color: '#F59E0B', desc: 'Hay áreas que necesitan atención y trabajo conjunto.' };
      return { level: 'Necesita Atención', color: '#EF4444', desc: 'Es importante buscar apoyo profesional para mejorar la convivencia.' };
    };

    const result = getResult();

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Resultados del Diagnóstico</Text>
          <View style={[styles.resultCard, { borderLeftColor: result.color }]}>
            <Text style={[styles.resultLevel, { color: result.color }]}>{result.level}</Text>
            <Text style={styles.resultDesc}>{result.desc}</Text>
            <Text style={styles.resultScore}>Puntuación: {diagnosticoScore}/100</Text>
          </View>
          <TouchableOpacity style={styles.restartBtn} onPress={resetDiagnostico}>
            <Text style={styles.restartBtnText}>Hacer otro test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderRetos = () => (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Retos Semanales</Text>
        <Text style={styles.sectionSubtitle}>Completa actividades para fortalecer los lazos familiares</Text>
      </View>
      <View style={styles.retosContainer}>
        {retos.map((reto) => (
          <View key={reto.id} style={[styles.retoCard, reto.completed && styles.retoCompleted]}>
            <View style={styles.retoHeader}>
              <Icon name={reto.icon === 'check' ? 'checkCircle' : reto.icon === 'smile' ? 'smile' : 'users'} size={28} color={activeTheme.primary} />
              <View>
                <Text style={styles.retoTitle}>{reto.title}</Text>
                <Text style={styles.retoCategory}>{reto.category}</Text>
              </View>
            </View>
            <Text style={styles.retoDesc}>{reto.desc || ''}</Text>
            <View style={styles.retoFooter}>
              <Text style={styles.retoDuration}>⏱️ {reto.duration}</Text>
              {reto.completed ? (
                <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => toggleReto(reto.id)}>
                  <Text style={styles.btnOutlineText}>Deshacer</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => toggleReto(reto.id)}>
                  <Text style={styles.btnPrimaryText}>Completar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderForo = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Foro Comunitario</Text>
          <Text style={styles.sectionSubtitle}>Comparte experiencias y aprende de otras familias</Text>
        </View>

        {forumState.loading && (
          <ActivityIndicator size="large" color={activeTheme.primary} style={{ marginVertical: spacing.lg }} />
        )}

        <View style={styles.forumThreads}>
          {foroThreads.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="messageSquare" size={40} color={activeTheme.textMuted} />
              <Text style={styles.emptyText}>No hay temas aún.</Text>
            </View>
          ) : (
            foroThreads.map((thread) => {
              const isExpanded = forumState.expandedThreads.includes(thread.id);
              return (
                <Animated.View key={thread.id} style={[styles.threadCard, { opacity: fadeAnim }]}>
                  <TouchableOpacity onPress={() => handleToggleThread(thread.id)} activeOpacity={0.85}>
                    <View style={styles.threadHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{thread.avatar}</Text>
                      </View>
                      <View style={styles.threadInfo}>
                        <Text style={styles.threadTitle}>{thread.title}</Text>
                        <Text style={styles.threadBody}>{thread.body || ''}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.threadMeta}>
                    <Text style={styles.metaText}>{thread.author} • {thread.time}</Text>
                    <Text style={styles.metaText}>{thread.replies} respuestas</Text>
                  </View>

                  <View style={[styles.threadMeta, { marginTop: spacing.sm }]}> 
                    <TouchableOpacity style={styles.likeBtn} onPress={() => handleToggleLike(thread.id)}>
                      <Icon name="thumbsUp" size={16} color={thread.liked ? activeTheme.primary : activeTheme.textMuted} />
                      <Text style={[styles.likeText, thread.liked && styles.likeTextActive]}>{thread.likes}</Text>
                    </TouchableOpacity>
                    {thread.status && (
                      <View style={styles.stateBadge}>
                        <Text style={styles.stateBadgeText}>{thread.status.toLowerCase()}</Text>
                      </View>
                    )}
                  </View>

                  {isExpanded && (
                    <View style={styles.commentContainer}>
                      {(thread.comments || []).map((comment) => (
                        <View key={comment.id} style={styles.commentCard}>
                          <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                          <Text style={styles.commentBody}>{comment.content}</Text>
                          <View style={styles.commentActionsRow}>
                            <Text style={styles.metaText}>{comment.time}</Text>
                            {user?.id === comment.authorId && (
                              <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginRight: spacing.sm }} onPress={() => dispatchForumState({ type: 'SET_EDITING_COMMENT', payload: { threadId: thread.id, commentId: comment.id, body: comment.content } })}>
                                  <Text style={styles.commentActionText}>Editar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteComment(thread.id, comment.id)}>
                                  <Text style={styles.commentActionText}>Eliminar</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      ))}

                      <TextInput
                        style={styles.commentInput}
                        value={forumState.commentDrafts[thread.id] || ''}
                        onChangeText={(text) => dispatchForumState({ type: 'SET_COMMENT_DRAFT', threadId: thread.id, text })}
                        placeholder="Escribe un comentario..."
                        placeholderTextColor={activeTheme.textMuted}
                        multiline
                        numberOfLines={3}
                      />
                      <View style={styles.commentActions}>
                        <TouchableOpacity style={styles.commentBtn} onPress={() => handleSubmitComment(thread.id)}>
                          <Text style={styles.commentBtnText}>Publicar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => handleThreadStateChange(thread.id, thread.status === 'OPEN' ? 'RESOLVE' : 'REOPEN')} disabled={threadStateRefreshing}>
                          <Text style={styles.btnOutlineText}>{thread.status === 'OPEN' ? 'Marcar resuelto' : 'Reabrir'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderCitas = () => (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Agenda de Citas</Text>
        <Text style={styles.sectionSubtitle}>Coordina sesiones con especialistas</Text>
      </View>
      {citas.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar" size={40} color={activeTheme.textMuted} />
          <Text style={styles.emptyText}>No tienes citas programadas.</Text>
        </View>
      ) : (
        <View style={styles.citasContainer}>
          {citas.map((cita) => (
            <View key={cita.id} style={styles.citaCard}>
              <View style={styles.citaHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{cita.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.citaName}>{cita.name}</Text>
                  <Text style={styles.citaEspecialidad}>{cita.especialidad}</Text>
                </View>
              </View>
              <View style={styles.citaDetails}>
                <Text style={styles.citaDetail}>📅 {cita.fecha}</Text>
                <Text style={styles.citaDetail}>⏰ {cita.hora}</Text>
                {cita.tipo && <Text style={styles.citaDetail}>📍 {cita.tipo}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderAjustes = () => (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xl }}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ajustes</Text>
        <Text style={styles.sectionSubtitle}>Personaliza tu experiencia</Text>
      </View>
      <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={toggleTheme}>
        <Text style={styles.btnPrimaryText}>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres cerrar sesión?', [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Cerrar Sesión',
              onPress: async () => {
                await authService.logout();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
              },
            },
          ]);
        }}
      >
        <Icon name="logOut" size={20} color={activeTheme.white} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "retos":
        return renderRetos();
      case "diagnostico":
        return renderDiagnostico();
      case "foro":
        return renderForo();
      case "citas":
        return renderCitas();
      case "ajustes":
        return renderAjustes();
      default:
        return renderInicio();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabBar}>
        {[
          { id: "inicio", label: "Inicio", icon: "home" },
          { id: "retos", label: "Retos", icon: "target" },
          { id: "diagnostico", label: "Test", icon: "clipboardList" },
          { id: "foro", label: "Foro", icon: "messageSquare" },
          { id: "citas", label: "Citas", icon: "calendar" },
          { id: "ajustes", label: "Ajustes", icon: "settings" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeSection === tab.id && styles.tabActive]}
            onPress={() => setActiveSection(tab.id)}
          >
            <Icon name={tab.icon} size={20} color={activeSection === tab.id ? activeTheme.primary : activeTheme.textMuted} />
            <Text style={[styles.tabText, activeSection === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderContent()}
    </SafeAreaView>
  );
};

export default DashboardScreen;
