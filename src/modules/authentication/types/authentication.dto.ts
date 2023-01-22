import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from "class-validator";

export class UserAuthDto {
  @ApiProperty({
    example: "mark",
    description: "Username should be unique",
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(5, 15)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])[a-zA-Z\d\w]{5,15}$/, {
    message:
      "Username should be between 5 and 15 characters long. Can contain numbers and the '_' symbol",
  })
  username: string;

  @ApiProperty({
    description:
      "Minimum allowed password length is 8 characters. The password must contain at least one number and letter. Special characters allowed. The regex /^(?=.*[A-Za-z])(?=.*\\d)[a-zA-Z\\d\\w\\W]{8,}$/",
    example: "ohhimark123",
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.[@,-,_,~,|])[a-zA-Z\d\w]{6,20}$/,
    {
      message:
        "Password must be between 6 and 20 characters long contain at least one letter and number and one symbol",
    }
  )
  password: string;

  @ApiProperty({
    example: "oh@hi.com",
    description: "Email should be unique",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class TokenUserDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class AccessTokenResponseDto {
  @ApiProperty({
    description: "The newly generated token.",
    name: "accessToken",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZjIyZDk3M2YtNzgwNC00MWY1LTk5ZDMtYjY5ODJhNmRmOGEyIiwidXNlcm5hbWUiOiJtYXJrIiwiZW1haWwiOiJvaEBoaS5jb20ifSwiaWF0IjoxNjUyNTM2NjI4LCJleHAiOjI1MTY1MzY2Mjh9.Ql9AhreH2sAqm42qTa_s7K3T6W5hqui0ziRj6Z4EhAg",
  })
  accessToken: string;
}

export class LoginAuthDto {
  @ApiProperty({
    example: "mark",
    description: "Username is not needed as long as there is email",
    required: false,
  })
  @ValidateIf((o) => o.username || !o.email, { always: true })
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ name: "password", type: String, example: "ohhimark" })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: "oh@hi.com",
    description: "Email is not needed as long as there is username",
    required: false,
  })
  @ValidateIf((o) => !o.email || !o.username, { always: true })
  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email?: string;
}
