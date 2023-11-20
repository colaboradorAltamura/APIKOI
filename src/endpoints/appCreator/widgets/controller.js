/* eslint-disable no-unused-vars */

const { Collections } = require('../../../types/collectionsTypes');

const schemas = require('./schemas');

const {
  find,

  patch,
  remove,
  create,
} = require('../../../vs-core-firebase/helpers/firestoreHelper');

// const COLLECTION_NAME = Collections.APP_CREATOR_WIDGETS;

exports.findWidgets = async function (req, res) {
  await find(req, res, Collections.APP_CREATOR_WIDGETS);
};

const getWidget1 = () => {
  const widget = {
    id: '1',
    // schema: schemas.create,

    title: 'Pathologies',

    requiredVariables: [],
    requiredEvents: ['getPathologies'],

    type: 'table',
    preDefinedEvents: [
      {
        name: 'getPathology',
        eventType: 'http-request',
        http: {
          method: 'get',
          endpoint: '/cms/pathologies',
          paramsVariables: [
            {
              variableAlias: 'pathologyId',
              contextVariableName: '', // si esto es vacio se usa el payload
              prop: 'id',
            },
          ],
          url: null,
        },
        dataSourceSchema: 'pathology', // se usaria unicamente en el CMS para validar los campos que asocio a la tabla por ejemplo
        dependencies: ['someFieldType'],
      },
      {
        name: 'getPathologies',
        eventType: 'http-request',
        http: {
          method: 'get',
          endpoint: '/cms/pathologies',
          paramsVariables: [],
          url: null,
        },
        dataSourceSchema: 'pathology', // se usaria unicamente en el CMS para validar los campos que asocio a la tabla por ejemplo
        dependencies: ['someFieldType'],
      },
      {
        name: 'createPathology',
        eventType: 'http-request',
        http: {
          method: 'post',
          endpoint: '/cms/pathologies',
          paramsVariables: [],
          url: null,
        },
        dataSourceSchema: 'pathology', // se usaria unicamente en el CMS para validar los campos que asocio a la tabla por ejemplo
      },
    ],

    preloadEvents: [
      { name: 'getPathologies', destinationContextVariableName: 'pathologiesDataSource' },
    ],

    components: [
      {
        id: '1',
        name: 'pathologies-table',
        type: 'table',
        dimensions: { xs: 12, sm: 12 },

        // table specific
        relatedFormId: 'pathologyForm',
        dataSourceContextVariableName: 'pathologiesDataSource',
        dataSourceContextVariableNamePropPath: ['items'],
        columns: [
          {
            cellType: 'text',
            name: 'id',
            propPath: ['id'],
            action: {
              sidebarEditor: {
                initialValuesEvent: {
                  name: 'getPathology',
                  destinationContextVariableName: '',
                },
              },
              // actionRoute: {
              //   paramsVariables: [
              //     {
              //       variableAlias: 'rowId',
              //       contextVariableName: '', // si esto es vacio se usa el payload
              //       prop: 'id',
              //     },
              //   ],
              //   url: '/pathologies',
              // },
            },
          },
          { cellType: 'text', name: 'name', propPath: ['name'] },
        ], // propPath: ['address', 'location']
      },
    ],
  };

  return widget;
};

exports.getWidget = async function (req, res) {
  const { id } = req.params;

  let element = null;

  if (id === '1') {
    element = getWidget1();
  } else if (id === 2) {
  }

  return res.send(element);

  // get(req, res, Collections.APP_CREATOR_WIDGETS);
};

exports.patchWidget = async function (req, res) {
  const { userId } = res.locals;
  const auditUid = userId;

  await patch(req, res, auditUid, Collections.APP_CREATOR_WIDGETS, schemas.update);
};

exports.removeWidget = async function (req, res) {
  await remove(req, res, Collections.APP_CREATOR_WIDGETS);
};

exports.createWidget = async function (req, res) {
  const { userId } = res.locals;
  const auditUid = userId;

  await create(req, res, auditUid, Collections.APP_CREATOR_WIDGETS, schemas.create);
};
