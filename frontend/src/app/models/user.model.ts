export type PerfilUsuario = 'usuario' | 'administrador';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  perfil: PerfilUsuario;
  imagenPerfilUrl: string | null;
  activo: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
