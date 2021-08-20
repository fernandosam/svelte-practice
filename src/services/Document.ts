/*
enum Type {
  LOCAL,
  MY_SQL,
}

export type Collection = {
  type: Type;
  entities: Array<Entity>;
};

export type Entity = {
  nome: string;
  documents: Array<Document>;
};
*/

export type Document = {
  id?: number;
  data: any;
  timestamp?: Date;
};

function generateDocumentId(documents: Array<Document>) {
  return documents.length ? Math.max(...documents.map((t) => t.id)) + 1 : 1;
}

export function createDocument(document: Document, documents: Array<Document>) {
  document.id = generateDocumentId(documents);
  document.timestamp = new Date();
  documents = [...documents, document];
  return documents;
}

export function updateDocument(document: Document, documents: Array<Document>) {
  function indexFound(value: Document) {
    return value.id === document.id;
  }
  const i = documents.findIndex(indexFound);
  documents[i] = { ...documents[i], ...document };
  return { key: i, value: documents[i] };
}

export function removeDocument(document: Document, documents: Array<Document>) {
  function idFound(value: Document) {
    return value.id !== document.id;
  }
  documents = documents.filter(idFound);
  return documents;
}
