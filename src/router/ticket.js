import { Router } from "express";
import { checkJwt } from "../middleware/permission.js";
import {
  cancelTicketController,
  completedAllProductTicketController,
  completedProductController,
  createMultipleTicketsControlller,
  createTicketController,
  deleteProductTicketController,
  deleteTicketController,
  finishedTicketController,
  getAllTicketsController,
  getTicketsByIdController,
  getTicketsController,
  joinAllProductsTicketController,
  receivedTicketController,
  updateTableTicketController,
  updateTicketController,
  updateWaiterTicketController,
} from "../controllers/ticketController.js";

const router = Router();

router.post("/:id", [checkJwt], createTicketController);
router.put("/update/:id", [checkJwt], updateTicketController);
router.get("/", [checkJwt], getTicketsController);
router.delete("/delete/:id", [checkJwt], deleteTicketController);
router.delete("/cancel/:id", [checkJwt], cancelTicketController);
router.put("/received/:id", [checkJwt], receivedTicketController);
router.put("/finished/:id", [checkJwt], finishedTicketController);
router.put("/completed/:id", [checkJwt], completedProductController);
router.put(
  "/complete-all/:id",
  [checkJwt],
  completedAllProductTicketController
);
router.get("/join-product/:id", [checkJwt], joinAllProductsTicketController);
router.get("/tickets", [checkJwt], getAllTicketsController);
router.post(
  "/create/multiple-tickets",
  [checkJwt],
  createMultipleTicketsControlller
);
router.get("/:id", [checkJwt], getTicketsByIdController);
router.patch("/updateTable/:id", [checkJwt], updateTableTicketController);
router.patch("/updateWaiter/:id", [checkJwt], updateWaiterTicketController);
router.delete(
  "/deleteProductTicket/:id",
  [checkJwt],
  deleteProductTicketController
);
export default router;
