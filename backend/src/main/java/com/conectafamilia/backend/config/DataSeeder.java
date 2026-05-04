package com.conectafamilia.backend.config;

import com.conectafamilia.backend.model.document.Scenario;
import com.conectafamilia.backend.model.entity.User;
import com.conectafamilia.backend.model.enums.ClientType;
import com.conectafamilia.backend.model.enums.Role;
import com.conectafamilia.backend.repository.mongo.ScenarioRepository;
import com.conectafamilia.backend.repository.jpa.UserRepository;
import com.conectafamilia.backend.repository.mongo.ChallengeRepository;
import com.conectafamilia.backend.repository.mongo.ForumPostRepository;
import com.conectafamilia.backend.model.document.Challenge;
import com.conectafamilia.backend.model.document.ForumPost;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScenarioRepository scenarioRepository;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ForumPostRepository forumPostRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedSpecialist();
        seedScenarios();
        seedChallenges();
        seedForum();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@conectafamilia.com")) {
            User admin = User.builder()
                    .fullName("Administrador")
                    .email("admin@conectafamilia.com")
                    .password(passwordEncoder.encode("ConectaFamilia789!"))
                    .role(Role.ADMIN)
                    .clientType(ClientType.INDIVIDUAL)
                    .build();
            userRepository.save(admin);
            System.out.println("Usuario admin creado: admin@conectafamilia.com / ConectaFamilia789!");
        }
    }

    private void seedScenarios() {
        if (scenarioRepository.count() == 0) {
            Scenario scenario1 = Scenario.builder()
                    .id("conflicto_llegada_tarde")
                    .title("El hijo llega tarde a casa")
                    .description(
                            "Tu hijo adolescente llega 2 horas después de la hora acordada y responde con agresividad al ser cuestionado: '¡Déjame en paz, no es para tanto!'")
                    .options(List.of(
                            new Scenario.Option("A",
                                    "Responder con enojo: '¡Mientras vivas bajo mi techo sigues mis reglas!'",
                                    "Incorrecto. Esto escala el conflicto y rompe la comunicación.", false),
                            new Scenario.Option("B",
                                    "Escucha activa: 'Veo que estás molesto. Hablemos mañana cuando estemos más tranquilos sobre por qué llegaste tarde.'",
                                    "Correcto. Valida la emoción sin ignorar la regla, postergando la discusión a un momento sin tensión.",
                                    true),
                            new Scenario.Option("C", "Indiferencia: Ignorarlo e irse a dormir.",
                                    "Incorrecto. El silencio no resuelve el problema ni establece límites claros.",
                                    false)))
                    .build();

            scenarioRepository.save(scenario1);
            System.out.println("Escenario de prueba insertado.");
        }
    }

    private void seedChallenges() {
        if (challengeRepository.count() == 0) {
            Challenge challenge1 = Challenge.builder()
                    .title("Cena sin pantallas")
                    .description(
                            "Disfruten de una comida familiar completa sin usar teléfonos móviles, tabletas ni televisión. Aprovechen para preguntarse cómo les fue en el día.")
                    .estimatedMinutes(45)
                    .category("Comunicación")
                    .build();

            Challenge challenge2 = Challenge.builder()
                    .title("Escucha activa de 10 minutos")
                    .description(
                            "Dedica 10 minutos ininterrumpidos a escuchar a tu hijo/a sobre un tema de su interés sin juzgar, interrumpir ni dar consejos no solicitados.")
                    .estimatedMinutes(10)
                    .category("Empatía")
                    .build();

            challengeRepository.saveAll(List.of(challenge1, challenge2));
            System.out.println("Retos familiares de prueba insertados.");
        }
    }

    private void seedSpecialist() {
        if (!userRepository.existsByEmail("especialista@conectafamilia.com")) {
            User specialist = User.builder()
                    .fullName("Dra. María Especialista")
                    .email("especialista@conectafamilia.com")
                    .password(passwordEncoder.encode("especialista123"))
                    .role(Role.ESPECIALISTA)
                    .clientType(ClientType.INDIVIDUAL)
                    .build();
            userRepository.save(specialist);
            System.out.println("Usuario especialista creado: especialista@conectafamilia.com");
        }
    }

    private void seedForum() {
        if (forumPostRepository.count() == 0) {
            ForumPost post = ForumPost.builder()
                    .title("¿Cómo manejar berrinches en lugares públicos?")
                    .content(
                            "Hola a todos, mi hijo de 4 años suele hacer rabietas cuando vamos al supermercado y no le compro dulces. ¿Qué estrategias les han funcionado a ustedes para manejar esta situación sin perder la paciencia?")
                    .authorId("user_padre_123")
                    .authorName("Carlos Padre")
                    .createdAt(LocalDateTime.now().minusDays(2))
                    .tags(List.of("Disciplina", "Berrinches", "Niños Pequeños"))
                    .build();

            ForumPost.Comment comment1 = ForumPost.Comment.builder()
                    .id("comment_1")
                    .authorId("user_madre_456")
                    .authorName("Lucía Madre")
                    .content(
                            "¡Hola Carlos! A mí me sirve mucho anticiparle lo que vamos a hacer antes de salir de casa. Le digo claramente qué vamos a comprar y le pido que me ayude a buscar los productos. Así se mantiene ocupado.")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build();

            ForumPost.Comment comment2 = ForumPost.Comment.builder()
                    .id("comment_2")
                    .authorId("especialista_789")
                    .authorName("Dra. María Especialista")
                    .content(
                            "Excelente consejo, Lucía. Además de la anticipación, validar su emoción es clave. Puedes decirle: 'Sé que quieres el dulce y te enoja no tenerlo, pero hoy solo venimos por las verduras'. Mantén un tono de voz calmado.")
                    .createdAt(LocalDateTime.now().minusHours(5))
                    .build();

            post.getComments().add(comment1);
            post.getComments().add(comment2);

            forumPostRepository.save(post);
            System.out.println("Post de foro de prueba insertado con respuestas.");
        }
    }
}
