import { GenerateIdOption } from './interfaces';
import { customAlphabet, urlAlphabet } from 'nanoid';

export const generateIdentifier = (options: GenerateIdOption): string => {
  const length = options.length ?? 10;

  switch (options.type) {
    case 'identifier': {
      return customAlphabet(urlAlphabet, 16)();
    }
    case 'otp': {
      return customAlphabet('1234567890', length)();
    }
    default:
      break;
  }
};
