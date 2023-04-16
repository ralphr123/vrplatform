export const getFirstAndLastName = (name: string) => {
  const splitName = name.split(" ");
  const lastName = splitName.length > 1 ? splitName.slice(1).join(" ") : "";
  return [splitName[0], lastName];
};
