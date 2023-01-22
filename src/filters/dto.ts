import { ApiProperty } from '@nestjs/swagger';
export class ExceptionDto {
  @ApiProperty({ name: 'statusCode', type: Number, example: 200 })
  statusCode: number;

  @ApiProperty({ name: 'message', type: String, example: 'Ok' })
  message: string;
}
