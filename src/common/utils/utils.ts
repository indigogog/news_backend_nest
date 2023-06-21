export function removeNullFromProperties(documentProperties: any) {
  Object.keys(documentProperties).forEach(
    (k) =>
      (documentProperties[k] === 'null' ||
        documentProperties[k] === '' ||
        documentProperties[k] === null ||
        documentProperties[k] === undefined) &&
      delete documentProperties[k],
  );
  return documentProperties;
}
