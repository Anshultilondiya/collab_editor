import prisma from "./../db/index.js";

export const createDocument = async (userId) => {
  const docs = await prisma.document.create({
    data: {
      title: "Untitled",
      content: "",
      authorId: userId,
    },
  });
  return docs;
};

export const getAllDocumentForUser = async (userId) => {
  const ownedDocuments = await prisma.document.findMany({
    where: {
      authorId: userId,
    },
  });

  const sharedDocuments = await prisma.document.findMany({
    where: {
      sharedWith: {
        some: {
          id: userId,
        },
      },
    },
  });
  const documents = [...ownedDocuments, ...sharedDocuments];

  // Remove duplicates based on document ID
  const uniqueDocuments = Array.from(
    new Map(documents.map((doc) => [doc.id, doc])).values()
  );

  const uniqueSharedDocuments = uniqueDocuments.filter(
    (doc) => doc.authorId !== userId
  );
  const uniqueOwnedDocuments = uniqueDocuments.filter(
    (doc) => doc.authorId === userId
  );

  const docs = {
    shared: uniqueSharedDocuments,
    owned: uniqueOwnedDocuments,
  };

  return docs;
};

export const getDocumentById = async (documentId) => {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });
  return document;
};

export const updateDocName = async (documentId, name) => {
  const document = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      title: name,
    },
  });
  console.log("name-update", document);
  return document;
};

export const shareDocument = async (documentId, email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    console.log("User not found");
    return null; // User not found
  }

  const sharedDocument = await prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      sharedWith: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  return sharedDocument;
};
