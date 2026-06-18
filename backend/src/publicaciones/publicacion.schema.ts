import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema({ timestamps: true })
export class ComentarioPublicacion {
  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId!: Types.ObjectId;

  @Prop({ required: true })
  nombreUsuario!: string;

  @Prop({ required: true, trim: true, maxlength: 500 })
  mensaje!: string;

  @Prop({ default: Date.now })
  fecha!: Date;

  @Prop({ default: false })
  modificado!: boolean;
}

@Schema({ timestamps: true })
export class Publicacion {
  @Prop({ required: true, trim: true, maxlength: 80 })
  titulo!: string;

  @Prop({ required: true, trim: true, maxlength: 600 })
  descripcion!: string;

  @Prop({ default: '' })
  imagenUrl!: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId!: Types.ObjectId;

  @Prop({ required: true })
  autorNombre!: string;

  @Prop({ required: true })
  autorUsuario!: string;

  @Prop({ default: '' })
  autorFotoUrl!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Usuario' }], default: [] })
  likes!: Types.ObjectId[];

  @Prop({ type: [ComentarioPublicacion], default: [] })
  comentarios!: ComentarioPublicacion[];

  @Prop({ default: true })
  activa!: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
