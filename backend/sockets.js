export const socketHandler = (io) => {
  const skt = io.of("/documents");

  skt.on("connection", (socket) => {
    console.log("a user connected to document namespace");
    socket.on("join-document", (data) => {
      console.log("join-document", data);
      socket.join(data.docId);
      console.log(`User joined document: ${data.docId}`);
    });

    socket.on("send-data", (data) => {
      const { docId, content } = data;
      skt.to(docId).emit("receive-data", content);
      console.log(`Data sent to document: ${docId}`);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected from document namespace");
    });
  });
};
