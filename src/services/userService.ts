import type { User, LoginCredentials } from "@/types/user";

const API_URL = import.meta.env.VITE_API_URL;

console.log("🔧 API_URL configurada:", API_URL);

export const userService = {
  async register(userData: User): Promise<any> {
    console.log("Intentando registrar usuario...");
    console.log("URL:", `${API_URL}/users/register`);
    console.log("Datos a enviar:", userData);

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error("Error al registrar usuario: " + response.status);
      }

      const data = await response.json();
      console.log("Usuario registrado exitosamente:", data);
      return data;
    } catch (error) {
      console.error("Error en registro:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error(
          "No se puede conectar con el servidor. ¿Está corriendo en",
          API_URL + "?",
        );
      }
      throw error;
    }
  },

  async login(credentials: LoginCredentials): Promise<any> {
    console.log("Intentando iniciar sesión...");
    console.log("URL:", `${API_URL}/login`);
    console.log("Credenciales:", {
      email: credentials.email,
      password: "***",
    });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const user = await response.json();
      console.log("Usuario autenticado:", user.email);
      return user;
    } catch (error) {
      console.error("Error en login:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error(
          "No se puede conectar con el servidor. ¿Está corriendo en",
          API_URL + "?",
        );
      }
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    console.log("Cbteniendo todos los usuarios...");
    console.log("URL:", `${API_URL}/users`);

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error("Error al obtener usuarios: " + response.status);
      }

      const users = await response.json();
      console.log("Usuarios obtenidos:", users.length);
      return users;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        console.error(
          "No se puede conectar con el servidor. ¿Está corriendo en",
          API_URL + "?",
        );
      }
      throw error;
    }
  },
};
