import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Error message', example: 'Not Found' })
  message: string;

  @ApiProperty({ description: 'Error code', example: '404' })
  error: string;

  @ApiProperty({ description: 'Optional data', example: null, required: false })
  data?: any;
}
