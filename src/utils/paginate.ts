export default async (query: any, queryBuilder: any) : Promise<any> => {
  const _page = (parseInt(query.page as string) || 1) - 1;
  const _perPage = parseInt(query.perPage as string) || 10;

  return queryBuilder.page(_page, _perPage);
};
