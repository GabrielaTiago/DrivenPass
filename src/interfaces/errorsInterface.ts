import { ErrorsTypes } from '../types/errorsType';

export interface IErrors extends Error {
  type: ErrorsTypes;
  message: string;
}
