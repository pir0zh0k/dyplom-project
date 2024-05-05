import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async create(dto: CreateUserDto) {
    const candidate = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (candidate) throw new BadRequestException('Пользователь уже существует');

    const salt = await genSalt();
    const hashed = await hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        surname: dto.surname,
        phone: dto.phone,
        passwordHash: hashed,
        role: dto.role,
      },
    });

    let { passwordHash, ...result } = user;
    return result;
  }
}
