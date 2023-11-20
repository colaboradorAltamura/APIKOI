export interface IUserDefinedRol {
  id?: string;
  organizationId?: string;
  name: string;
  description?: string;
  isSchemaRelated: boolean;
  relatedSchemaId?: string;
}
