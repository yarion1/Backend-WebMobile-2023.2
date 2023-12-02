import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly favoritesService: FavoritesService,
  ) { }

  async bcryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
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

  findAll() {
    return `This action returns all users`;
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
