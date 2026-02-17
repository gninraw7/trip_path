import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

/**
 * UUID 유효성 검증 파이프
 */
@Injectable()
export class ParseUUIDPipe implements PipeTransform<string> {
  private readonly uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  transform(value: string): string {
    if (!this.uuidRegex.test(value)) {
      throw new BadRequestException({
        code: 'INVALID_UUID',
        message: '올바른 UUID 형식이 아닙니다.',
      });
    }
    return value;
  }
}
