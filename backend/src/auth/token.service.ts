import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { UsuarioLimpio } from '../usuarios/usuarios.service';

export interface TokenPayload {
  sub: string;
  correo: string;
  nombreUsuario: string;
  perfil: 'usuario' | 'administrador';
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  private readonly secreto = process.env.JWT_SECRET || 'clave-tp2-red-social';
  private readonly vencimientoSegundos = 15 * 60;

  generarToken(usuario: UsuarioLimpio): string {
    const ahora = Math.floor(Date.now() / 1000);

    const payload: TokenPayload = {
      sub: usuario.id,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
      iat: ahora,
      exp: ahora + this.vencimientoSegundos,
    };

    const header = { alg: 'HS256', typ: 'JWT' };
    const headerBase64 = this.base64Url(JSON.stringify(header));
    const payloadBase64 = this.base64Url(JSON.stringify(payload));
    const firma = this.firmar(`${headerBase64}.${payloadBase64}`);

    return `${headerBase64}.${payloadBase64}.${firma}`;
  }

  validarToken(token: string): TokenPayload {
    if (!token) {
      throw new UnauthorizedException('Token no informado.');
    }

    const partes = token.split('.');

    if (partes.length !== 3) {
      throw new UnauthorizedException('Token inválido.');
    }

    const [headerBase64, payloadBase64, firmaRecibida] = partes;
    const firmaEsperada = this.firmar(`${headerBase64}.${payloadBase64}`);

    if (!this.firmasCoinciden(firmaRecibida, firmaEsperada)) {
      throw new UnauthorizedException('Token inválido.');
    }

    let payload: TokenPayload;

    try {
      payload = JSON.parse(this.desdeBase64Url(payloadBase64));
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }

    const ahora = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp <= ahora) {
      throw new UnauthorizedException('La sesión venció.');
    }

    return payload;
  }

  obtenerTokenDesdeHeader(authorization = ''): string {
    if (!authorization.startsWith('Bearer ')) {
      return '';
    }

    return authorization.replace('Bearer ', '').trim();
  }

  private firmar(texto: string): string {
    return createHmac('sha256', this.secreto).update(texto).digest('base64url');
  }

  private base64Url(texto: string): string {
    return Buffer.from(texto).toString('base64url');
  }

  private desdeBase64Url(texto: string): string {
    return Buffer.from(texto, 'base64url').toString('utf8');
  }

  private firmasCoinciden(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);

    if (bufferA.length !== bufferB.length) {
      return false;
    }

    return timingSafeEqual(bufferA, bufferB);
  }
}
