import {
  IEntitySchema,
  IEntitySchemaField,
  IEntitySchemaFieldGroup,
} from '../vs-core/types/schemas';

// import { IUserDefinedRol } from '../vs-core/types/userDefinedRols';

export interface IOrganizationConfig {
  schemas: IEntitySchema[];
  fields: IEntitySchemaField[];
  fieldGroups: IEntitySchemaFieldGroup[];
  udRolsColections: any[];
  dataCollections: any[];
}
