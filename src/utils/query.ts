export const toQueryParams = (filter: any) => {
  const { search, ...params } = filter;

  let where: any;
  if (search) {
    const keys = Object.keys(search);
    const searchPrisma = keys.map((item) => {
      return {
        [item]: {
          contains: search[item],
        },
      };
    });
    where = searchPrisma.reduce((acc, curr) => {
      return {
        ...acc,
        ...curr,
      };
    }, {});
  }
  const filterKeys = Object.keys(params);
  const filters = filterKeys.map((item) => {
    return {
      [item]: parseInt(params[item]),
    };
  });
  const newFilters = filters.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});
  return {
    ...newFilters,
    ...where,
  };
};
