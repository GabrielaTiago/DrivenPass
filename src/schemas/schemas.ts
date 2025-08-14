import { authSchema } from './authSchema';
import { cardSchema } from './cardSchema';
import { credentialSchema } from './credentialSchema';
import { noteSchema } from './noteSchema';
import { wifiSchema } from './wifiSchemas';
import { ISchemas } from '../interfaces/schemasInterface';

const schemas: ISchemas = {
  auth: authSchema,
  credential: credentialSchema,
  note: noteSchema,
  card: cardSchema,
  wifi: wifiSchema,
};

export { schemas };
