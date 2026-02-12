<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="nav-content">
        <h2 class="logo">Ciber Ciudadano</h2>
        <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </nav>

    <main class="main-content">
      <div class="welcome-section">
        <h1>Bienvenido, {{ currentUser?.name }}!</h1>
        <p class="subtitle">Panel de Usuario</p>
      </div>

      <div class="user-info-card">
        <h3>Información de tu Cuenta</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Nombre Completo:</span>
            <span class="info-value"
              >{{ currentUser?.name }} {{ currentUser?.last_name }}</span
            >
          </div>
          <div class="info-item">
            <span class="info-label">Correo:</span>
            <span class="info-value">{{ currentUser?.email }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Fecha de Nacimiento:</span>
            <span class="info-value">{{
              formatDate(currentUser?.birth_date)
            }}</span>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <h4>Panel de Control</h4>
          <p>Gestiona tu información</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔒</div>
          <h4>Seguridad</h4>
          <p>Cuenta protegida</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⚙️</div>
          <h4>Configuración</h4>
          <p>Personaliza tu experiencia</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { User } from "@/types/user";

const router = useRouter();
const currentUser = ref<User | null>(null);

onMounted(() => {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) {
    router.push("/login");
    return;
  }
  currentUser.value = JSON.parse(userStr);
});

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  router.push("/login");
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  color: #667eea;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.btn-logout {
  padding: 10px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.welcome-section h1 {
  font-size: 48px;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.user-info-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.user-info-card h3 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.stat-card h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 20px;
}

.stat-card p {
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 32px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
