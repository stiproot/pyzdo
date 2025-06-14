export const buildCoreQry = (scope, collection, id, projectId) => {
  const qry = {
    payload: {
      ql:
        `select * from ` +
        `pyzdo.${scope}.${collection} ` +
        `where id = '${id}' and __metadata__.project_id = '${projectId}'`,
      params: [],
    },
    filter: {
      node_type: collection,
    },
  };

  return qry;
};
