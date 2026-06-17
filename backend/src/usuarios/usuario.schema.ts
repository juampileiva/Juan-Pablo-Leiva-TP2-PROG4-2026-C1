import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

export type PerfilUsuario = 'usuario' | 'administrador';

@Schema({ timestamps: true })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre!: string;

  @Prop({ required: true, trim: true })
  apellido!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo!: string;

  @Prop({ required: true, unique: true, trim: true })
  nombreUsuario!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true })
  fechaNacimiento!: string;

  @Prop({ required: true, maxlength: 250 })
  descripcionBreve!: string;

  @Prop({ default: '' })
  fotoPerfilUrl!: string;

  @Prop({ enum: ['usuario', 'administrador'], default: 'usuario' })
  perfil!: PerfilUsuario;

  @Prop({ default: true })
  activo!: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
