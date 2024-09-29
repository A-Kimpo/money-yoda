export default async (reqQuery: Record<string, any>, queryBuilder: any) => {
  for (const [key, value] of Object.entries(reqQuery)) {
    if (key) {
      queryBuilder = queryBuilder.where(`${key}`, value);
    }
  }

  return queryBuilder;
}
