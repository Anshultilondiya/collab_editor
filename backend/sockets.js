import { OTController } from "./services/ot.service.js";

const documents = {};

export const socketHandler = (io) => {
  const skt = io.of("/documents");

  skt.on("connection", (socket) => {
    console.log("user connected to document namespace");
    let documentId = null;
    let clientId = socket.id;

    socket.on("join", (docId) => {
      documentId = docId;
      socket.join(docId);

      console.log("user joined document", docId);

      if (!documents[docId]) {
        documents[docId] = new OTController();
      }

      console.log("documents", documents);

      const doc = documents[docId];
      socket.emit("init", {
        text: doc.text,
        revision: doc.operations.length,
      });
    });

    socket.on("operation", (data) => {
      if (!documentId) return;

      const doc = documents[documentId];
      const transformedOp = doc.applyOperation(clientId, data.operation);

      // Broadcast to other clients
      socket.to(documentId).emit("remoteOperation", {
        operation: transformedOp,
        revision: doc.operations.length,
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected from document namespace");
    });
  });
};
