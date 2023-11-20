/* eslint-disable no-console */

// grants[ {companyId, rols: [ENTERPRISE_SALES, ENTERPRISE_ADMIN]}]
// appRols: decodedToken.appRols, // [APP_ADMIN]

// const COLLECTION_SCHEMAS = 'schemas';

export const userIsGranted = function ({
  userAppRols,
  userEnterpriseRols,
  userOrgRols,

  targetAppRols,
  targetOrgRols,
  targetEnterpriseRols,

  companyId,
}) {
  if (!targetAppRols && !targetOrgRols && !targetEnterpriseRols) return true;

  if (
    userAppRols &&
    targetAppRols &&
    userAppRols.find((element) => {
      return targetAppRols.includes(element);
    })
  ) {
    return true;
  }

  if (
    userOrgRols &&
    targetOrgRols &&
    userOrgRols.find((element) => {
      return targetOrgRols.includes(element);
    })
  ) {
    return true;
  }

  if (targetEnterpriseRols) {
    const userEnterpriseRol = userEnterpriseRols.find((rol) => {
      return rol.companyId === companyId;
    });

    if (userEnterpriseRol) {
      const rol = userEnterpriseRol.rols.find((element) => {
        return targetEnterpriseRols.includes(element);
      });

      if (rol) return true;
    }
  }

  return false;
};

export const isAuthorized = function ({
  allowSameUser,
  hasAppRole,
  hasOrgRole,

  hasEnterpriseRole,
  isEnterpriseEmployee,
}: any) {
  return async (req, res, next) => {
    const SYS_ADMIN_EMAIL = process.env.SYS_ADMIN_EMAIL;

    const {
      enterpriseRols,
      appRols,
      orgRols,

      email,
      userId,
    } = res.locals;
    const { companyId, userId: paramUserId } = req.params;

    if (email === SYS_ADMIN_EMAIL) return next();

    // console.log('userId: ', userId, 'paramUserId: ', paramUserId);
    if (allowSameUser && paramUserId && userId === paramUserId) return next();

    if (
      isEnterpriseEmployee &&
      companyId &&
      enterpriseRols &&
      enterpriseRols.find((erol) => {
        return erol.companyId === companyId;
      })
    ) {
      return next();
    }

    if (
      userIsGranted({
        userAppRols: appRols,
        userEnterpriseRols: enterpriseRols,
        userOrgRols: orgRols,

        targetAppRols: hasAppRole,
        targetOrgRols: hasOrgRole,

        targetEnterpriseRols: hasEnterpriseRole,
        companyId,
      })
    ) {
      return next();
    }

    // eslint-disable-next-line no-console
    console.error(
      'ERROR: role required',
      'role :',
      enterpriseRols,
      'appRols: ',
      appRols,
      'orgRols: ',
      orgRols,
      'hasAppRole: ',
      hasAppRole
    );

    return res.status(403).send({ message: 'role required' });
  };
};
