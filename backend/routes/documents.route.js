import express from "express";
import {
  createDocument,
  getAllDocumentForUser,
  getDocumentById,
  saveDocument,
  shareDocument,
  updateDocName,
} from "../services/document.service.js";

const router = express.Router();

router.get("/get-doc-by-id/:id", async (req, res) => {
  const { id } = req.params;
  const document = await getDocumentById(id);
  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }
  res.status(200).json(document);
});

router.get("/all-docs/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  const documents = await getAllDocumentForUser(userId);
  res.status(200).json(documents);
});

router.get("/create", async (req, res) => {
  const userId = req.user.sub;
  const data = await createDocument(userId);
  res.status(200).json(data);
});

router.post("/update-doc-name/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const document = await updateDocName(id, name);
  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }
  res.status(200).json(document);
});

router.post("/share-doc/:docId", async (req, res) => {
  const { docId } = req.params;
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const document = await shareDocument(docId, email);
  if (!document) {
    return res
      .status(404)
      .json({ message: "Document not found or user not found" });
  }
  res.status(200).json(document);
});

router.post("/save-doc/:docId", async (req, res) => {
  const { docId } = req.params;
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const document = await saveDocument(docId, content);

  res.status(200).json({ message: "Document saved successfully" });
});

export default router;
