<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Iniciar Sesión</h1>
      <p class="subtitle">Bienvenido a Ciber Ciudadano</p>

      <form @submit.prevent="handleLogin" ref="loginForm">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="credentials.email"
            @input="validateForm"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="credentials.password"
            @input="validateForm"
            required
            minlength="8"
            placeholder="••••••••"
          />
          <small class="password-hint"
            >Mínimo 8 caracteres, una mayúscula y un número</small
          >
          <div v-if="passwordError" class="validation-error">
            {{ passwordError }}
          </div>
        </div>

        <!-- Desafío Matemático -->
        <div v-if="showChallenge" class="challenge-group">
          <label for="challenge">🔒 Desafío de Seguridad</label>
          <p class="challenge-question">
            ¿Cuánto es {{ challenge.num1 }} + {{ challenge.num2 }}?
          </p>
          <input
            type="number"
            id="challenge"
            v-model.number="challengeAnswer"
            required
            placeholder="Escribe tu respuesta"
            class="challenge-input"
          />
          <div v-if="challengeError" class="validation-error">
            {{ challengeError }}
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? "Cargando..." : "Iniciar Sesión" }}
        </button>
      </form>

      <div class="footer-links">
        <p>
          ¿No tienes cuenta?
          <router-link to="/register">Regístrate aquí</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userService } from "@/services/userService";
import type { LoginCredentials } from "@/types/user";

const router = useRouter();
const loginForm = ref<HTMLFormElement | null>(null);
const credentials = ref<LoginCredentials>({
  email: "",
  password: "",
});

const error = ref("");
const passwordError = ref("");
const loading = ref(false);
const isFormValid = ref(false);

// Desafío matemático
const showChallenge = ref(false);
const challenge = ref({ num1: 0, num2: 0, answer: 0 });
const challengeAnswer = ref<number | null>(null);
const challengeError = ref("");

// Regex para validar contraseña: al menos una mayúscula y un número
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

// Generar desafío matemático aleatorio
const generateChallenge = () => {
  const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
  const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
  challenge.value = {
    num1,
    num2,
    answer: num1 + num2,
  };
  challengeAnswer.value = null;
  challengeError.value = "";
  console.log(
    "Desafío generado:",
    num1,
    "+",
    num2,
    "=",
    challenge.value.answer,
  );
};

// Validar respuesta del desafío
const validateChallenge = (): boolean => {
  if (challengeAnswer.value === null) {
    challengeError.value = "Por favor, responde el desafío de seguridad";
    return false;
  }

  if (challengeAnswer.value !== challenge.value.answer) {
    challengeError.value = `Respuesta incorrecta. Intenta de nuevo.`;
    // Generar nuevo desafío
    generateChallenge();
    return false;
  }

  challengeError.value = "";
  return true;
};

const validatePassword = () => {
  if (!credentials.value.password) {
    passwordError.value = "";
    return false;
  }

  if (credentials.value.password.length < 8) {
    passwordError.value = "La contraseña debe tener al menos 8 caracteres";
    return false;
  }

  if (!passwordRegex.test(credentials.value.password)) {
    passwordError.value = "Debe contener al menos una mayúscula y un número";
    return false;
  }

  passwordError.value = "";
  return true;
};

const validateForm = () => {
  const isPasswordValid = validatePassword();
  const isEmailValid =
    credentials.value.email.includes("@") && credentials.value.email.length > 0;

  isFormValid.value = isEmailValid && isPasswordValid;

  // Mostrar desafío solo cuando el formulario básico es válido
  if (isFormValid.value && !showChallenge.value) {
    showChallenge.value = true;
    generateChallenge();
  }
};

const handleLogin = async () => {
  // Validación final antes de enviar
  if (!isFormValid.value) {
    error.value = "Por favor, completa todos los campos correctamente";
    return;
  }

  // Validar desafío matemático
  if (!validateChallenge()) {
    return;
  }

  try {
    loading.value = true;
    error.value = "";

    console.log("Iniciando proceso de login...");
    console.log("Desafío de seguridad superado");

    const user = await userService.login(credentials.value);

    console.log("Login exitoso, guardando usuario...");
    // Guardar usuario en localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));

    console.log("Redirigiendo a /home...");
    // Redirigir al home
    router.push("/home");
  } catch (err: any) {
    console.error("Error en handleLogin:", err);

    if (err.message.includes("fetch")) {
      error.value = "No se puede conectar con el servidor. ";
    } else {
      error.value = err.message || "Error al iniciar sesión";
    }

    // Generar nuevo desafío en caso de error
    generateChallenge();
  } finally {
    loading.value = false;
  }
};

// Generar desafío inicial al montar el componente
onMounted(() => {
  generateChallenge();
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

h1 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  text-align: center;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

input:valid:not(:placeholder-shown) {
  border-color: #10b981;
}

.password-hint {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.validation-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
}

/* Estilos del Desafío */
.challenge-group {
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid #667eea;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.challenge-group label {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 12px;
}

.challenge-question {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin: 12px 0;
  padding: 12px;
  background: white;
  border-radius: 6px;
}

.challenge-input {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  border: 2px solid #667eea;
}

.challenge-input:focus {
  border-color: #764ba2;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    opacity 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.footer-links {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.footer-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
