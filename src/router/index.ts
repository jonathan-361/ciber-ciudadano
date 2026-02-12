import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
  ],
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("currentUser");

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  }
  // Si la ruta es solo para invitados (login/register) y ya está autenticado
  else if (to.meta.requiresGuest && isAuthenticated) {
    next("/home");
  }
  // Permitir navegación
  else {
    next();
  }
});

export default router;
