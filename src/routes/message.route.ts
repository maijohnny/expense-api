import express from  "express";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller";
import { isAuthenticated } from "../middlewares/auth";

const messageRouter = express.Router();
messageRouter.post('/', isAuthenticated, sendMessage);
messageRouter.get('/:receiverId', isAuthenticated, getMessages);
messageRouter.delete('/:messageId', isAuthenticated, deleteMessage);

export default messageRouter;