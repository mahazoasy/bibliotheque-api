import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = exception.message;
    let errors = null;

    // gestion speciale pour les erreurs de validation (class-validator)
    if (exception instanceof BadRequestException && typeof exceptionResponse === 'object') {
      const validationErrors = (exceptionResponse as any).message;
      if (Array.isArray(validationErrors)) {
        message = 'Validation échouée';
        errors = this.formatValidationErrors(validationErrors);
      } else {
        message = validationErrors || message;
      }
    } else if (typeof exceptionResponse === 'object' && (exceptionResponse as any).message) {
      message = (exceptionResponse as any).message;
    }

    response.status(status).json({
      success: false,
      message: message,
      errors: errors,
    });
  }

  private formatValidationErrors(errors: string[]): Record<string, string[]> {
    // Exemple : ["title must be a string", "isbn should not be empty"]
    // On peut essayer de parser, mais par défaut on retourne un objet générique
    const result: Record<string, string[]> = {};
    errors.forEach((err) => {
      const field = err.split(' ')[0]; // approche simple
      if (!result[field]) result[field] = [];
      result[field].push(err);
    });
    return result;
  }
}