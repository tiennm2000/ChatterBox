import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware";
import {
  getAllContacts,
  getContactsForDMList,
  searchContacts,
} from "../controllers/ContactController";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/get-contacts-for-dm", verifyToken, getContactsForDMList);
contactsRoutes.get("/get-all-contacts", verifyToken, getAllContacts);

export default contactsRoutes;
