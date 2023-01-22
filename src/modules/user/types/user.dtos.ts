import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { NewPassword } from 'src/modules/authentication/types/authentication.types';

export class NewPasswordDto implements NewPassword {
  @IsOptional()
  oldPassword: string;

  @IsNotEmpty()
  @Length(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
    message: 'password must contain at least one letter and number',
  })
  newPassword: string;
}

export class UserIdResponseDto {
  @ApiProperty({
    example: 'f22d973f-7804-41f5-99d3-b6982a6df8a2',
    description: 'Id of the newly created user',
  })
  id: string;
}
