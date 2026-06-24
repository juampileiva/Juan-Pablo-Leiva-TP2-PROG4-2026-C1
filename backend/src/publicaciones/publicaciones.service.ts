import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto';
import { Publicacion, PublicacionDocument } from './publicacion.schema';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private readonly publicacionModel: Model<PublicacionDocument>,
    private readonly usuariosService: UsuariosService,
  ) {}

  async crearPublicacion(data: CrearPublicacionDto, imagenUrl: string) {
    const usuario = await this.usuariosService.buscarPorId(data.usuarioId);

    const publicacion = await this.publicacionModel.create({
      titulo: data.titulo,
      descripcion: data.descripcion,
      imagenUrl: imagenUrl || '',
      usuarioId: new Types.ObjectId(data.usuarioId),
      autorNombre: `${usuario.nombre} ${usuario.apellido}`,
      autorUsuario: usuario.nombreUsuario,
      autorFotoUrl: usuario.fotoPerfilUrl || '',
      likes: [],
      comentarios: [],
      activa: true,
    });

    return {
      mensaje: 'Publicación creada correctamente.',
      publicacion: this.formatearPublicacion(publicacion, data.usuarioId),
    };
  }

  async listarPublicaciones(filtros: ListarPublicacionesDto) {
    const offset = Number(filtros.offset ?? 0);
    const limit = Number(filtros.limit ?? 6);
    const orden = filtros.orden || 'fecha';

    const filtroMongo: any = { activa: true };

    if (filtros.usuarioId) {
      filtroMongo.usuarioId = new Types.ObjectId(filtros.usuarioId);
    }

    const pipeline: any[] = [
      { $match: filtroMongo },
      {
        $addFields: {
          cantidadLikes: { $size: '$likes' },
          cantidadComentarios: { $size: '$comentarios' },
        },
      },
      orden === 'likes'
        ? { $sort: { cantidadLikes: -1, createdAt: -1 } }
        : { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: offset }, { $limit: limit }],
          total: [{ $count: 'cantidad' }],
        },
      },
    ];

    const resultado = await this.publicacionModel.aggregate(pipeline);
    const publicaciones = resultado[0]?.data || [];
    const total = resultado[0]?.total?.[0]?.cantidad || 0;

    return {
      publicaciones: publicaciones.map((publicacion: any) =>
        this.formatearPublicacion(publicacion, filtros.usuarioActualId),
      ),
      total,
      offset,
      limit,
      orden,
    };
  }

  async obtenerPublicacion(id: string, usuarioActualId?: string) {
    const publicacion = await this.buscarPublicacionActiva(id);

    return {
      publicacion: this.formatearPublicacion(publicacion, usuarioActualId),
    };
  }

  async eliminarPublicacion(id: string, usuarioId: string, perfil = 'usuario') {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('La publicación no es válida.');
    }

    const publicacion = await this.publicacionModel.findOne({
      _id: id,
      activa: true,
    });

    if (!publicacion) {
      throw new NotFoundException('No se encontró la publicación.');
    }

    const esAutor = publicacion.usuarioId.toString() === usuarioId;
    const esAdmin = perfil === 'administrador';

    if (!esAutor && !esAdmin) {
      throw new ForbiddenException('No podés eliminar esta publicación.');
    }

    publicacion.activa = false;
    await publicacion.save();

    return { mensaje: 'Publicación eliminada correctamente.' };
  }

  async darMeGusta(publicacionId: string, usuarioId: string) {
    const publicacion = await this.buscarPublicacionActiva(publicacionId);
    const usuarioObjectId = new Types.ObjectId(usuarioId);

    const yaTieneLike = publicacion.likes.some(
      (like) => like.toString() === usuarioId,
    );

    if (yaTieneLike) {
      throw new BadRequestException('Ya le diste me gusta a esta publicación.');
    }

    publicacion.likes.push(usuarioObjectId);
    await publicacion.save();

    return {
      mensaje: 'Me gusta agregado.',
      publicacion: this.formatearPublicacion(publicacion, usuarioId),
    };
  }

  async quitarMeGusta(publicacionId: string, usuarioId: string) {
    const publicacion = await this.buscarPublicacionActiva(publicacionId);

    const teniaLike = publicacion.likes.some(
      (like) => like.toString() === usuarioId,
    );

    if (!teniaLike) {
      throw new BadRequestException('Todavía no habías dado me gusta.');
    }

    publicacion.likes = publicacion.likes.filter(
      (like) => like.toString() !== usuarioId,
    );

    await publicacion.save();

    return {
      mensaje: 'Me gusta eliminado.',
      publicacion: this.formatearPublicacion(publicacion, usuarioId),
    };
  }

  async agregarComentario(publicacionId: string, usuarioId: string, mensaje: string) {
    const publicacion = await this.buscarPublicacionActiva(publicacionId);
    const usuario = await this.usuariosService.buscarPorId(usuarioId);

    publicacion.comentarios.push({
      usuarioId: new Types.ObjectId(usuarioId),
      nombreUsuario: usuario.nombreUsuario,
      mensaje,
      fecha: new Date(),
      modificado: false,
    } as any);

    await publicacion.save();

    return {
      mensaje: 'Comentario agregado correctamente.',
      comentario: this.formatearComentario(
        publicacion.comentarios[publicacion.comentarios.length - 1] as any,
        usuarioId,
      ),
      publicacion: this.formatearPublicacion(publicacion, usuarioId),
    };
  }

  async editarComentario(
    publicacionId: string,
    comentarioId: string,
    usuarioId: string,
    mensaje: string,
  ) {
    const publicacion = await this.buscarPublicacionActiva(publicacionId);
    const comentario = (publicacion.comentarios as any).id(comentarioId);

    if (!comentario) {
      throw new NotFoundException('No se encontró el comentario.');
    }

    if (comentario.usuarioId.toString() !== usuarioId) {
      throw new ForbiddenException('No podés editar este comentario.');
    }

    comentario.mensaje = mensaje;
    comentario.modificado = true;
    await publicacion.save();

    return {
      mensaje: 'Comentario editado correctamente.',
      comentario: this.formatearComentario(comentario, usuarioId),
    };
  }

  async listarComentarios(
    publicacionId: string,
    offset = 0,
    limit = 5,
    usuarioActualId?: string,
  ) {
    const publicacion = await this.buscarPublicacionActiva(publicacionId);

    const comentariosOrdenados = [...(publicacion.comentarios as any[])].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );

    const comentarios = comentariosOrdenados
      .slice(offset, offset + limit)
      .map((comentario) => this.formatearComentario(comentario, usuarioActualId));

    return {
      comentarios,
      total: publicacion.comentarios.length,
      offset,
      limit,
    };
  }

  private async buscarPublicacionActiva(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('La publicación no es válida.');
    }

    const publicacion = await this.publicacionModel.findOne({
      _id: id,
      activa: true,
    });

    if (!publicacion) {
      throw new NotFoundException('No se encontró la publicación.');
    }

    return publicacion;
  }

  private formatearComentario(comentario: any, usuarioActualId?: string) {
    const usuarioId = comentario.usuarioId?.toString?.() || comentario.usuarioId;

    return {
      id: comentario._id?.toString?.() || comentario.id,
      usuarioId,
      nombreUsuario: comentario.nombreUsuario,
      mensaje: comentario.mensaje,
      fecha: comentario.fecha,
      modificado: !!comentario.modificado,
      esMio: usuarioActualId ? usuarioId === usuarioActualId : false,
    };
  }

  private formatearPublicacion(publicacion: any, usuarioActualId?: string) {
    const id = publicacion._id?.toString?.() || publicacion._id;
    const usuarioId = publicacion.usuarioId?.toString?.() || publicacion.usuarioId;
    const likes = publicacion.likes || [];
    const comentarios = publicacion.comentarios || [];
    const comentariosOrdenados = [...comentarios].sort(
      (a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );

    return {
      id,
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion,
      imagenUrl: publicacion.imagenUrl || '',
      usuarioId,
      autorNombre: publicacion.autorNombre,
      autorUsuario: publicacion.autorUsuario,
      autorFotoUrl: publicacion.autorFotoUrl || '',
      cantidadLikes: publicacion.cantidadLikes ?? likes.length,
      cantidadComentarios: publicacion.cantidadComentarios ?? comentarios.length,
      comentarios: comentariosOrdenados.slice(0, 3).map((comentario: any) =>
        this.formatearComentario(comentario, usuarioActualId),
      ),
      meGusta: usuarioActualId
        ? likes.some((like: any) => like.toString() === usuarioActualId)
        : false,
      esMia: usuarioActualId ? usuarioId === usuarioActualId : false,
      activa: publicacion.activa,
      createdAt: publicacion.createdAt,
      updatedAt: publicacion.updatedAt,
    };
  }
}
