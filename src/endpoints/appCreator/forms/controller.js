/* eslint-disable no-unused-vars */

const { ErrorHelper } = require('../../../vs-core-firebase');

const { Collections } = require('../../../types/collectionsTypes');

const schemas = require('./schemas');

const {
  find,

  patch,
  remove,
  create,
} = require('../../../vs-core-firebase/helpers/firestoreHelper');

// const COLLECTION_NAME = Collections.APP_CREATOR_FORMS;

exports.findForms = async function (req, res) {
  await find(req, res, Collections.APP_CREATOR_FORMS);
};

const getCMSEntitySchemaForm = () => {
  const step1 = {
    title: 'Basic Info',
    subTitle: 'Sub title',
    iconName: 'tabler:code',
    stepName: 'firstStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'eg. TheSchema',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: '',
      },
      {
        id: '2',
        name: 'collectionName',
        label: 'Collection Name',
        type: 'text',
        placeholder: 'eg. Seleccione una opcion',
        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        readOnly: { create: true, edit: true },
        hidden: { create: true, edit: false },
      },
      {
        id: '3',
        name: 'rootSchema',
        label: 'Root Schema',
        type: 'boolean',

        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        hidden: { create: true, edit: true },
      },

      // {
      //   id: '4',
      //   name: 'grantedUserDefinedRols',
      //   label: 'Granted Rols',
      //   type: DynamicComponentTypes.FORM_MULTI_SELECT_ASYNC,
      //   placeholder: 'eg. Admin',
      //   errorMsg: 'invalid selection.',

      //   dimensions: { xs: 12, sm: 12 },
      //   validation: { isRequired: false },
      //   // initialValue: 'op-1',
      //   dataSource: {
      //     contextVariableName: null,
      //     event: {
      //       name: 'fetchOrganizationDefinedRols',
      //       eventType: 'http-request',
      //       http: {
      //         method: 'get',
      //         endpoint: '/cms/rols',
      //         paramsVariables: [],

      //         url: null,
      //       },
      //     },
      //   },
      //   optionIdProp: 'id',
      //   optionLabelProps: ['name'],
      //   optionLabelPropsSeparator: '',
      //   noOptionsText: 'Search by name',
      // },
    ],
  };

  const form = {
    id: 'entitySchema',
    // schema: schemas.create,

    steps: [step1],
    postload: [],

    submitEvents: [{ name: 'submitPatientRelative' }, { name: 'onPatientRelativeSubmit' }],
    // submitEvents: [{ name: 'onPatientRelativeSubmit' }],
  };

  console.log('Returning Form: ' + JSON.stringify(form));
  return form;
};

const getCMSEntitySchemaFieldForm = () => {
  const step1 = {
    title: 'Basic Info',
    subTitle: 'Sub title',
    iconName: 'tabler:code',
    stepName: 'firstStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'eg. TheSchema',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: '',
      },
      {
        id: '2',
        name: 'collectionName',
        label: 'Collection Name',
        type: 'text',
        placeholder: 'eg. Seleccione una opcion',
        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        readOnly: { create: true, edit: true },
        hidden: { create: true, edit: false },
      },
      {
        id: '3',
        name: 'rootSchema',
        label: 'Root Schema',
        type: 'boolean',

        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        hidden: { create: true, edit: true },
      },
    ],
  };

  const form = {
    id: 'entitySchemaField',
    // schema: schemas.create,

    steps: [step1],
    postload: [],
  };

  console.log('Returning Form: ' + JSON.stringify(form));
  return form;
};

const getForm1 = () => {
  const patientUserIdVariable = {
    variableAlias: 'patientUserId',
    contextVariableName: 'currentPatient', // si esto es vacio se usa el payload
    prop: 'id',
  };
  // const step1Component2 = {
  //   id: '3',
  //   name: 'comp2',
  //   label: 'Comp 2',
  //   type: 'number',
  //   placeholder: 'eg.Comp 2',
  //   errorMsg: 'is required.',

  //   dimensions: { xs: 12, sm: 12 },
  //   validation: { isRequired: false },
  //   hidden: { create: true },
  //   readonly: { edit: true },

  //   conditionalRender: [
  //     {
  //       when: 'name',
  //       is: ['saraza'],
  //     },
  //   ],
  // };

  // const step1ComponentGroup1 = {
  //   id: '2',

  //   type: 'group',

  //   dimensions: { xs: 12, sm: 12 },
  //   style: { 'justify-content': 'center' },
  //   components: [step1Component2],
  // };

  const step1 = {
    title: 'Basic Info',
    subTitle: 'Sub title',
    iconName: 'tabler:code',
    stepName: 'firstStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'eg. Joe Doe',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: 'Hola',
      },
      {
        id: '12',
        name: 'selectAsync',
        label: 'SELECT Async',
        type: 'select-async',
        placeholder: 'eg. Seleccione una opcion',
        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        // initialValue: 'op-1',
        dataSource: {
          contextVariableName: null,
          event: {
            name: 'fetchPatientRelatives',
            eventType: 'http-request',
            http: {
              method: 'get',
              endpoint: '/cms/patientRelatives',
              paramsVariables: [patientUserIdVariable],

              queryFilters: [
                {
                  contextVariableName: '', // si esto es vacio se usa el payload
                  prop: 'text',

                  targetFilterName: 'name',
                  filterOperator: '$contains',
                },
              ],
              url: null,
            },
          },
        },
        optionIdProp: 'id',
        optionLabelProps: ['name'],
        optionLabelPropsSeparator: '',
        noOptionsText: 'Search by name',
      },
      {
        id: '1',
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'eg. joe@doe.com',
        errorMsg: 'invalid email.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        initialValue: '',

        tooltip: 'Esto es un tooltip',
      },
      {
        id: '11',
        name: 'select',
        label: 'SELECT',
        type: 'select',
        placeholder: 'eg. Seleccione una opcion',
        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: 'op-1',
        dataSource: { contextVariableName: 'testSelectOptions' },

        tooltip: 'Esto es un select',
      },

      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'dropzone',
        placeholder: 'eg. Joe Doe',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
      },
    ],
  };

  const step2 = {
    title: 'Second step',
    subTitle: 'Sub title',
    iconName: 'tabler:user',
    stepName: 'secondStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'eg. Joe Doe',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: 'Hola',
      },
      {
        id: '12',
        name: 'selectAsync',
        label: 'SELECT Async',
        type: 'select-async',
        placeholder: 'eg. Seleccione una opcion',
        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        // initialValue: 'op-1',
        dataSource: {
          contextVariableName: null,
          event: {
            name: 'fetchPatientRelatives',
            eventType: 'http-request',
            http: {
              method: 'get',
              endpoint: '/cms/patientRelatives',
              paramsVariables: [patientUserIdVariable],

              queryFilters: [
                {
                  contextVariableName: '', // si esto es vacio se usa el payload
                  prop: 'text',

                  targetFilterName: 'name',
                  filterOperator: '$contains',
                },
              ],
              url: null,
            },
          },
        },
        optionIdProp: 'id',
        optionLabelProps: ['name'],
        optionLabelPropsSeparator: '',
        noOptionsText: 'Search by name',
      },
      {
        id: '1',
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'eg. joe@doe.com',
        errorMsg: 'invalid email.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        initialValue: '',

        tooltip: 'Esto es un tooltip',
      },
      {
        id: '11',
        name: 'select',
        label: 'SELECT',
        type: 'select',
        placeholder: 'eg. Seleccione una opcion',
        errorMsg: 'invalid selection.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: 'op-1',
        dataSource: { contextVariableName: 'testSelectOptions' },

        tooltip: 'Esto es un select',
      },
    ],
  };

  const form = {
    id: '1',
    // schema: schemas.create,

    requiredVariables: [
      {
        variableAlias: 'testSelectOptions',
        contextVariableName: 'testSelectOptions',
      },
      patientUserIdVariable,
    ],
    requiredEvents: ['onPatientRelativeBack', 'onPatientRelativeSubmit', 'submitPatientRelative'],
    preDefinedEvents: [
      {
        name: 'submitPatientRelative',
        eventType: 'http-request',
        http: {
          method: 'post',
          endpoint: '/cms/patientRelatives',
          paramsVariables: [patientUserIdVariable],
          url: null,
        },
        dataSourceSchema: null,
        dependencies: [],
      },
    ],

    // preload: [{ ...dataSource1, variableName: dataSource1.variableName }], // puede overradear
    steps: [step1, step2],
    postload: [],
    footer: {
      // TODO No se esta usando
      actions: [
        {
          component: {
            id: '5',
            name: 'submitButton',
            label: 'Next',
            type: 'button',

            dimensions: { xs: 12, sm: 12 },
          },
          isSubmit: true,
          isCancel: false,
          submitLabel: 'Confirm',
        },
        {
          component: {
            id: '6',
            name: 'backButton',
            label: 'Back',
            type: 'button',

            dimensions: { xs: 12, sm: 12 },
          },
          isSubmit: false,
          isBack: true,
          attachEvents: ['onPatientRelativeBack'],
        },
      ],
    },

    submitEvents: [{ name: 'submitPatientRelative' }, { name: 'onPatientRelativeSubmit' }],
    // submitEvents: [{ name: 'onPatientRelativeSubmit' }],
  };

  return form;
};

const getPathologyForm = () => {
  const step1 = {
    title: 'Basic Info',
    subTitle: 'Sub title',
    iconName: 'tabler:code',
    stepName: 'firstStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'eg. Down',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: '',
      },
      {
        id: '1',
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'eg. Any description',
        errorMsg: 'invalid field.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        initialValue: '',
      },
    ],
  };

  const step2 = {
    title: 'Step 2',
    subTitle: 'adsdasjkdjksal',
    iconName: 'tabler:user',
    stepName: 'secondStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'kjdasjlkalsjkds',
        type: 'text',
        placeholder: 'eg. Down',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: '',
      },
      {
        id: '1',
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'eg. Any description',
        errorMsg: 'invalid field.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        initialValue: '',
      },
    ],
  };

  const form = {
    id: 'pathologyForm',

    // schema: schemas.create,

    requiredEvents: ['createPathology'],
    preDefinedEvents: [
      {
        name: 'createPathology',
        eventType: 'http-request',
        http: {
          method: 'post',
          endpoint: '/cms/pathologies',
          paramsVariables: [],
          url: null,
        },
        dataSourceSchema: null,
        dependencies: [],
      },
    ],

    steps: [step1, step2],
    postload: [],

    submitEvents: [{ name: 'createPathology' }],
    // submitEvents: [{ name: 'onPatientRelativeSubmit' }],
  };

  return form;
};

const getUserDefinedRolForm = () => {
  const step1 = {
    title: 'Basic Info',
    subTitle: 'Sub title',
    iconName: 'tabler:code',
    stepName: 'firstStep',

    components: [
      {
        id: '1',
        name: 'name',
        label: 'Name',
        type: 'text',
        placeholder: 'eg. Down',
        errorMsg: 'name is required.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: true },
        initialValue: '',
      },
      {
        id: '2',
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: 'eg. Any description',
        errorMsg: 'invalid field.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },
        initialValue: '',
      },
      {
        id: '3',
        name: 'isSchemaRelated',
        label: 'Is Schema Related',
        type: 'boolean',
        placeholder: '',
        errorMsg: 'invalid field.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },

        hidden: { create: true, edit: false },
      },
      {
        id: '3',
        name: 'relatedSchemaId',
        label: 'Related Schema Id',
        type: 'text',
        placeholder: '',
        errorMsg: 'invalid field.',

        dimensions: { xs: 12, sm: 12 },
        validation: { isRequired: false },

        hidden: { create: true, edit: false },
      },
    ],
  };

  const form = {
    id: 'userDefinedRolForm',

    // schema: schemas.create,

    steps: [step1],
    postload: [],

    // submitEvents: [{ name: 'createPathology' }],
    // submitEvents: [{ name: 'onPatientRelativeSubmit' }],
  };

  return form;
};

exports.getForm = async function (req, res) {
  try {
    const { id } = req.params;

    let form = null;

    console.log('Required form: ' + id);
    if (id === 'entitySchema') {
      form = getCMSEntitySchemaForm();
    } else if (id === 'entitySchemaField') {
      form = getCMSEntitySchemaFieldForm();
    } else if (id === '1') {
      form = getForm1();
    } else if (id === 'pathologyForm') {
      form = getPathologyForm();
    } else if (id === 'userDefinedRolForm') {
      form = getUserDefinedRolForm();
    }

    return res.send(form);
  } catch (err) {
    return ErrorHelper.handleError(req, res, err);
  }
  // get(req, res, Collections.APP_CREATOR_FORMS);
};

exports.patchForm = async function (req, res) {
  const { userId } = res.locals;
  const auditUid = userId;

  await patch(req, res, auditUid, Collections.APP_CREATOR_FORMS, schemas.update);
};

exports.removeForm = async function (req, res) {
  await remove(req, res, Collections.APP_CREATOR_FORMS);
};

exports.createForm = async function (req, res) {
  const { userId } = res.locals;
  const auditUid = userId;

  await create(req, res, auditUid, Collections.APP_CREATOR_FORMS, schemas.create);
};
