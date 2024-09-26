export default (datesStrings: string[]) => {
  return datesStrings.map((string) => new Date(string));
};
