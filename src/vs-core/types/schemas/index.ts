import { DynamicComponentTypes } from '../dynamics';
import { StateTypes } from '../stateTypes';

interface IIndexedCompoundFilter {
  field: string;
  operator: string;
}

export enum EntitySchemaTypes {
  MAIN_ENTITY = 'main-entity-type',
  USER_ENTITY = 'user-entity-type',
  ONE_TO_MANY_ENTITY = 'one-to-many-entity-type',
  RELATIONSHIP_ENTITY = 'relationship-entity-type',
  RELATIONSHIP_USER2USER_ENTITY = 'relationship-user2user-entity-type',
  SELECT_OPTIONS_ENTITY = 'select_options-entity-type',
  COMPANY_ENTITY = 'company-entity-type',
  COMPANY_EMPLOYEES_ENTITY = 'company-employees-entity-type',
}

export interface IEntitySchema {
  id: string;
  organizationId: string;

  name: string;
  collectionName: string;
  rootSchema: boolean;
  description: string;

  indexedFilters: string[];
  indexedCompoundFilters: IIndexedCompoundFilter[];

  grantedUserDefinedRols_create: string[];
  grantedUserDefinedRols_read: string[];
  grantedUserDefinedRols_update: string[];
  grantedUserDefinedRols_delete: string[];

  grantedUserDefinedRols_create_mine: string[];
  grantedUserDefinedRols_read_mine: string[];
  grantedUserDefinedRols_update_mine: string[];
  grantedUserDefinedRols_delete_mine: string[];

  grantedUserDefinedRols_create_by_user: string[];
  grantedUserDefinedRols_read_by_user: string[];
  grantedUserDefinedRols_update_by_user: string[];
  grantedUserDefinedRols_delete_by_user: string[];

  grantedUserDefinedRols_create_by_company: string[];
  grantedUserDefinedRols_read_by_company: string[];
  grantedUserDefinedRols_update_by_company: string[];
  grantedUserDefinedRols_delete_by_company: string[];

  grantedAnonymous_create?: boolean;
  grantedAnonymous_read?: boolean;
  grantedAnonymous_update?: boolean;
  grantedAnonymous_delete?: boolean;

  schemaType: EntitySchemaTypes;

  fieldNameUsedAsSchemaLabel: string;

  bidirectional?: boolean;
  relationshipSourceSchemaId?: string;
  relationshipTargetSchemaId?: string;

  relationshipSourceRequiredRols?: string[];
  relationshipTargetRequiredRols?: string[];

  fixedRoleId?: string;

  prelodeable?: boolean;
  cacheable?: boolean;

  isStateRelated?: boolean;
}

export interface IEntitySchemaFieldGroup {
  id: string;
  schemaId: string;
  organizationId: string;
  order: number;

  title: string;
  subTitle: string;
  icon: string;
}

export interface IUpsertRule {
  name: string;
  ruleScript: string;
}

export interface IEntitySchemaField {
  id: string;
  schemaId: string;
  organizationId: string;

  name: string;
  fieldType: DynamicComponentTypes;
  order: number;

  label: string;
  placeholder: string;
  dimensions_xs: string;
  dimensions_sm: string;
  tooltip: string;
  isRequired: boolean;

  enableHidden: boolean;
  hidden_create: boolean;
  hidden_edit: boolean;

  enableReadOnly: boolean;
  readOnly_create: boolean;
  readOnly_edit: boolean;

  enableConditionalRender: boolean;
  conditionalRenderWhen?: string;
  conditionalRenderIs?: string[];

  isCountryOptionFilter?: boolean;
  isRelatedStateOption?: boolean;

  fieldGroupId?: string;

  // si fieldType es 'DynamicComponentTypes.RELATIONSHIP' entonces se usa esta prop para saber contra que esquema se relaciona
  relationshipSchemaId?: string;
  relationshipSchemaLabelPropName?: string;
  relationshipRequiresSimpleParam?: boolean;
  relationshipRequiresUserParam?: boolean;
  relationshipRequiresCompanyParam?: boolean;
  relationshipParamPropName?: string;

  // si fieldType es 'DynamicComponentTypes.FILE_UPLOADER'
  isPublicDefaultValue?: boolean;
  allowIsPublicSwitch?: boolean;

  isSystemField?: boolean;

  uiRules?: IUpsertRule[];
  workflowRules?: IUpsertRule[];

  enableCustomMask?: boolean;
  textCustomMask?: string;
  componentProps?: string;

  enableTextArea?: boolean;
  enableHtmlEditor?: boolean;
  textAreaRows?: number;
}

export interface ISchemaWithFields extends IEntitySchema {
  fields: IEntitySchemaField[];
}

export interface ISelectOptionEntity {
  name: string;
  code: string;
  countryConstraints?: string[];
  relatedState?: StateTypes;
}
