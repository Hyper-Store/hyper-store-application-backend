import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSessionDto } from './create-user-session.dto';

export class UpdateUserSessionDto extends PartialType(CreateUserSessionDto) {}
