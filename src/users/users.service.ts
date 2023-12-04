import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FavoritesService } from 'src/favorites/favorites.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly favoritesService: FavoritesService,
    private readonly jwtService: JwtService
  ) { }

  async bcryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserDto.email)) {
      throw new BadRequestException('Invalid email format');
    }

    if (!createUserDto.name || !createUserDto.password) {
      throw new BadRequestException('Name and password are required');
    }

    if (createUserDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const date = new Date();

    const checkIfEmailExists = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (!checkIfEmailExists) {
      try {
        createUserDto.password = await this.bcryptPassword(
          createUserDto.password,
        );
        const createUser = this.usersRepository.create({
          ...createUserDto,
          created_at: date,
          updated_at: date
        });
        await this.usersRepository.save(createUser);
        createUser.password = undefined;

        await this.favoritesService.create(+createUser.id);

        return createUser;
      } catch (error) {
        if (
          error
            .toString()
            .indexOf('duplicate key value violates unique constraint') !== -1
        ) {
          throw new BadRequestException(
            `Email already exists: ${createUserDto.email}`,
          );
        } else {
          throw new BadRequestException(
            `Error trying to create the user: ${error}`,
          );
        }
      }
    } else {
      throw new BadRequestException(
        `Email already exists: ${createUserDto.email}`,
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          email
        }
      });
      return user;
    } catch {
      throw new NotFoundException(`User not found`);
    }
  }

  async findUserById(headers: any) {
    try {
      const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
      const user_id = JSON.parse(token)._id;

      const user = await this.usersRepository.findOne({
        where: {
          id: user_id
        },
        select: [
          "name",
          "email"
        ]
      })

      return user;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to get user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(headers: any, updateUserDto: UpdateUserDto) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateUserDto.email)) {
      throw new BadRequestException('Formato de Email Inválido');
    }

    if (!updateUserDto.name) {
      throw new BadRequestException('Preencha Nome');
    }

    if (updateUserDto.newPassword && updateUserDto.newPassword.length < 6) {
      throw new BadRequestException('Nova Senha Deve Ter no Minímo 6 Caracteres');
    }

    try {
      const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
      const user_id = JSON.parse(token)._id;

      const user = await this.usersRepository.findOne({
        where: {
          id: user_id
        }
      })

      if (!(await bcrypt.compare(updateUserDto.password, user.password))) {
        throw new HttpException("Senha atual incorreta", HttpStatus.UNAUTHORIZED)
      }

      if (updateUserDto.newPassword) {
        updateUserDto.newPassword = await this.bcryptPassword(
          updateUserDto.newPassword,
        );
      }

      await this.usersRepository
        .createQueryBuilder()
        .update(User)
        .set({
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: updateUserDto.newPassword ? updateUserDto.newPassword : user.password
        })
        .where('id = :id', { id: user_id })
        .execute();

      return true;
    } catch (err) {
      if (err.response === 'Senha atual incorreta') {
        throw new HttpException("Senha atual incorreta", HttpStatus.UNAUTHORIZED)
      }
      throw new HttpException("Error to update users", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}