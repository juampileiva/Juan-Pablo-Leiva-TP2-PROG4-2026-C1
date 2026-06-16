import { 
  Controller, 
  Post, 
  Body, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('imagenPerfil', {
    storage: diskStorage({
      destination: './uploads/perfiles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Solo se permiten archivos de imagen.'), false);
      }
      cb(null, true);
    }
  }))
  async register(
    @Body() registerDto: RegisterAuthDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imagePath = '';
    if (file) {
      imagePath = `/uploads/perfiles/${file.filename}`;
    }
    return this.authService.register(registerDto, imagePath);
  }

  @Post('login')
  async login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }
}