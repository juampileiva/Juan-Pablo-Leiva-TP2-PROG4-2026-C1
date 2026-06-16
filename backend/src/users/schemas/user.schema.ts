import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  nombre!: string;

  @Prop({ required: true, trim: true })
  apellido!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo!: string;

  @Prop({ required: true, unique: true, trim: true })
  nombreUsuario!: string;

  @Prop({ required: true })
  contrasena!: string;

  @Prop({ required: true })
  fechaNacimiento!: Date;

  @Prop({ trim: true, maxlength: 250 })
  descripcionBreve?: string;

  @Prop({ default: '' })
  imagenPerfil!: string;

  @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
  perfil!: string;

  @Prop({ default: true })
  activo!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);