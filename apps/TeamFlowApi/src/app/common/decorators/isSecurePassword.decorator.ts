import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsSecurePassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSecurePassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (typeof value !== 'string') return false;
          const minLength = value.length >= 8;
          const maxLength = value.length <= 32;
          const hasUppercase = /[A-Z]/.test(value);
          const hasLowercase = /[a-z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[@$!%*?&]/.test(value);
          return (
            minLength &&
            maxLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSpecialChar
          );
        },
        defaultMessage() {
          return (
            'Password must be 8-32 characters long, contain at least one uppercase letter, ' +
            'one lowercase letter, one number, and one special character (@$!%*?&)'
          );
        },
      },
    });
  };
}
