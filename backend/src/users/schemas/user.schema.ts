import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type UserRole = 'usuario' | 'administrador';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  nombre!: string;

  @Prop({ required: true, trim: true })
  apellido!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  nombreUsuario!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  fechaNacimiento!: string;

  @Prop({ required: true, trim: true })
  descripcionBreve!: string;

  @Prop({
    required: true,
    enum: ['usuario', 'administrador'],
    default: 'usuario',
  })
  perfil!: UserRole;

  @Prop({ type: String, default: null })
  imagenPerfilUrl!: string | null;

  @Prop({ default: true })
  activo!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);