<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Crear Cuenta</h1>
      <p class="subtitle">Únete a Ciber Ciudadano</p>

      <form @submit.prevent="handleRegister" ref="registerForm">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input
              type="text"
              id="name"
              v-model="userData.name"
              @input="validateForm"
              required
              minlength="2"
              placeholder="Jonathan Alexander"
            />
          </div>

          <div class="form-group">
            <label for="last_name">Apellidos</label>
            <input
              type="text"
              id="last_name"
              v-model="userData.last_name"
              @input="validateForm"
              required
              minlength="2"
              placeholder="López Uc"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="userData.email"
            @input="validateForm"
            required
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="birth_date">Fecha de Nacimiento</label>
          <input
            type="date"
            id="birth_date"
            v-model="userData.birth_date"
            @input="validateForm"
            required
            :max="maxDate"
          />
          <small>Debes ser mayor de 13 años</small>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="userData.password"
            @input="validateForm"
            required
            minlength="8"
            placeholder="••••••••"
          />
          <small>Mínimo 8 caracteres, una mayúscula y un número</small>
          <div v-if="passwordError" class="validation-error">
            {{ passwordError }}
          </div>
          <div
            v-if="passwordStrength"
            class="password-strength"
            :class="passwordStrength.class"
          >
            {{ passwordStrength.text }}
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

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button
          type="submit"
          class="btn-primary"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? "Registrando..." : "Crear Cuenta" }}
        </button>
      </form>

      <div class="footer-links">
        <p>
          ¿Ya tienes cuenta?
          <router-link to="/login">Inicia sesión</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";

const router = useRouter();
const registerForm = ref<HTMLFormElement | null>(null);
const userData = ref<User>({
  name: "",
  last_name: "",
  email: "",
  password: "",
  birth_date: "",
});

const error = ref("");
const success = ref("");
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

// Fecha máxima (13 años atrás desde hoy)
const maxDate = computed(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 13);
  return today.toISOString().split("T")[0];
});

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
  if (!userData.value.password) {
    passwordError.value = "";
    return false;
  }

  if (userData.value.password.length < 8) {
    passwordError.value = "La contraseña debe tener al menos 8 caracteres";
    return false;
  }

  if (!passwordRegex.test(userData.value.password)) {
    passwordError.value = "Debe contener al menos una mayúscula y un número";
    return false;
  }

  passwordError.value = "";
  return true;
};

// Indicador de fortaleza de contraseña
const passwordStrength = computed(() => {
  const pass = userData.value.password;
  if (!pass) return null;

  let strength = 0;
  if (pass.length >= 8) strength++;
  if (pass.length >= 12) strength++;
  if (/[A-Z]/.test(pass)) strength++;
  if (/[a-z]/.test(pass)) strength++;
  if (/\d/.test(pass)) strength++;
  if (/[^A-Za-z0-9]/.test(pass)) strength++;

  if (strength <= 2) return { text: "Débil", class: "weak" };
  if (strength <= 4) return { text: "Media", class: "medium" };
  return { text: "Fuerte", class: "strong" };
});

const validateAge = () => {
  if (!userData.value.birth_date) return false;

  const birthDate = new Date(userData.value.birth_date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return age - 1 >= 13;
  }

  return age >= 13;
};

const validateForm = () => {
  const isPasswordValid = validatePassword();
  const isEmailValid =
    userData.value.email.includes("@") && userData.value.email.length > 0;
  const isNameValid = userData.value.name.length >= 2;
  const isLastNameValid = userData.value.last_name.length >= 2;
  const isAgeValid = validateAge();

  isFormValid.value =
    isPasswordValid &&
    isEmailValid &&
    isNameValid &&
    isLastNameValid &&
    isAgeValid;

  // Mostrar desafío solo cuando el formulario básico es válido
  if (isFormValid.value && !showChallenge.value) {
    showChallenge.value = true;
    generateChallenge();
  }
};

const handleRegister = async () => {
  // Validación final antes de enviar
  if (!isFormValid.value) {
    error.value = "Por favor, completa todos los campos correctamente";
    return;
  }

  if (!validateAge()) {
    error.value = "Debes ser mayor de 13 años para registrarte";
    return;
  }

  // Validar desafío matemático
  if (!validateChallenge()) {
    return;
  }

  try {
    loading.value = true;
    error.value = "";
    success.value = "";

    console.log("Iniciando proceso de registro...");
    console.log("Desafío de seguridad superado");

    await userService.register(userData.value);

    console.log("Registro exitoso");
    success.value = "Cuenta creada exitosamente. Redirigiendo...";

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      console.log("Redirigiendo a /login...");
      router.push("/login");
    }, 2000);
  } catch (err: any) {
    console.error("Error en handleRegister:", err);

    if (err.message.includes("fetch")) {
      error.value = "No se puede conectar con el servidor.";
    } else {
      error.value = err.message || "Error al crear la cuenta";
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
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 520px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  border-color: #f5576c;
}

input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

input:valid:not(:placeholder-shown) {
  border-color: #10b981;
}

small {
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

.password-strength {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.password-strength.weak {
  color: #ef4444;
  background-color: #fee;
}

.password-strength.medium {
  color: #f59e0b;
  background-color: #fef3c7;
}

.password-strength.strong {
  color: #10b981;
  background-color: #d1fae5;
}

/* Estilos del Desafío */
.challenge-group {
  background: linear-gradient(135deg, #fce7f3 0%, #fecaca 100%);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid #f5576c;
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
  color: #f5576c;
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
  border: 2px solid #f5576c;
}

.challenge-input:focus {
  border-color: #f093fb;
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

.success-message {
  background-color: #efe;
  color: #3c3;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
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
  color: #f5576c;
  text-decoration: none;
  font-weight: 600;
}

.footer-links a:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
