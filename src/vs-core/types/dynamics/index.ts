export enum DynamicComponentTypes {
  RELATIONSHIP = 'relationship',
  USER = 'user',
  CUSTOM = 'custom',

  TITLE = 'title',
  TABLE = 'table',
  DIVIDER = 'divider',

  FORM_TEXT = 'text',
  FORM_EMAIL = 'email',
  FORM_NUMBER = 'number',
  FORM_PHONE_NUMBER = 'phoneNumber',

  FORM_SELECT = 'select',
  FORM_MULTI_SELECT = 'multi-select',

  FORM_SELECT_ASYNC = 'select-async',
  FORM_MULTI_SELECT_ASYNC = 'multi-select-async',

  FORM_SELECT_CREATABLE = 'select-creatable',
  FORM_MULTI_SELECT_CREATABLE = 'multi-select-creatable',

  FORM_BOOLEAN = 'boolean',
  FORM_DATE = 'date',

  FORM_AVATAR = 'avatar',

  FORM_COUNTRY_PICKER = 'country-picker',
  FORM_COUNTRY_PICKER_CONSTRAINTS = 'country-picker-constraints',
  FORM_RELATED_STATE = 'related-state',

  ADDRESS = 'address',

  FILE_UPLOADER = 'file-uploader',
  FORM_GENERIC_ANY = 'generic-any',
}
export enum DynamicEventTypes {
  HTTP_REQUEST = 'http-request',
}

export type IDynamicEventImplementation = {
  name: string;

  event: ({ ...args }) => Promise<any>;
};

export interface IDynamicParam {
  variableAlias: string;
  prop?: string | null;
  contextVariableName?: string | null;
}

export interface IDynamicQueryFilter {
  prop?: string;
  contextVariableName?: string | null;

  targetFilterName: string;
  filterOperator: string;
}

export interface IDynamicEventDefinition {
  name: string;
  eventType: string;
  http: {
    method: string;
    endpoint: string;
    paramsVariables?: IDynamicParam[];
    queryFilters?: IDynamicQueryFilter[];
    url: null;
  };
  dataSourceSchema?: string; // se usaria unicamente en el CMS para validar los campos que asocio a la tabla por ejemplo
  dependencies: string[];
}

export interface IDynamicComponentConditionalRender {
  when: string;
  is: any[];
}

export interface IDynamicFormComponentValidation {
  isRequired: boolean;
}

export interface IDynamicInlineComponent {
  component: any;
  stepName?: string;
  order?: number;
  dimensions?: { xs?: number; sm?: number };
}

// ** Start Components

export interface IDynamicComponent {
  id: string;
  name: string;
  label?: string;
  type: DynamicComponentTypes;
  dimensions?: { xs?: number; sm?: number };

  tooltip?: string;
  conditionalRender?: IDynamicComponentConditionalRender[];
  hidden?: { create?: boolean; edit?: boolean };
  readOnly?: { create?: boolean; edit?: boolean };
  components?: IDynamicComponent[];
  customMask?: string;
  componentProps?: string;

  enableTextArea?: boolean;
  enableHtmlEditor?: boolean;
  textAreaRows?: string;
}

export interface IDynamicFormComponent extends IDynamicComponent {
  validation?: IDynamicFormComponentValidation;

  initialValue: any;
  placeholder?: string;

  errorMsg?: string;
}

export enum DynamicTableCellComponentTypes {
  TEXT = 'text',
}

export interface IDynamicActionRoute {
  paramsVariables: IDynamicParam[];
  url: string;
}

export interface IDynamicTableColumnAction {
  sidebarEditor?: { initialValuesEvent: IPreloadEvent };
  actionRoute?: IDynamicActionRoute;
}
export interface IDynamicTableColumnComponent {
  cellType: DynamicTableCellComponentTypes;
  name: string;
  propPath: string[];

  action?: IDynamicTableColumnAction;
}

export interface IDynamicTableComponent extends IDynamicComponent {
  dataSourceContextVariableName: string;
  dataSourceContextVariableNamePropPath: string[];

  columns: IDynamicTableColumnComponent[];

  relatedFormId: string;
}

// ** End Components

export interface IDynamicDataSourceDefinition {
  contextVariableName?: string;
  fixedOptions: { label: string; value: string }[];
  event?: IDynamicEventDefinition;
}
export interface DynamicFormSelectComponentType extends IDynamicFormComponent {
  dataSource: IDynamicDataSourceDefinition;
  optionLabelProps: string[];
  optionIdProp: string;
  optionLabelPropsSeparator: string;
  noOptionsText: string;
}

export interface FormStepType {
  title: string;
  subTitle: string;
  iconName: string;

  components: IDynamicFormComponent[] | IDynamicComponent[];
}

export interface IFormComponentAction {
  component: IDynamicFormComponent;

  isSubmit: boolean;
  isCancel: boolean;

  submitLabel?: string;
}

export interface IDynamicRequiredVariable {
  variableAlias: string;
  prop?: string | null;
  contextVariableName?: string | null;
}

export interface IPreloadEvent {
  name: string;
  destinationContextVariableName: string;
}
export interface IForm {
  requiredVariables: IDynamicRequiredVariable[];
  requiredEvents: string[];

  preDefinedEvents: IDynamicEventDefinition[];

  submitEvents: { name: string }[];
  steps: FormStepType[];
  footer: { actions: IFormComponentAction[] };
}

// ** Start widget

export enum WidgetTypes {
  WIDGET_TABLE = 'widget-table',
}

export interface IWidget {
  requiredVariables: IDynamicRequiredVariable[];
  requiredEvents: string[];
  type: WidgetTypes;
  title: string;

  preDefinedEvents: IDynamicEventDefinition[];

  preloadEvents?: IPreloadEvent[];

  components: IDynamicComponent[];
}

// ** End widget
