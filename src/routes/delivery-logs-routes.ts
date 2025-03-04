import { Router } from "express"

import { DeliveryLogsController } from "@/controllers/deliveries-logs-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogsController()

deliveriesLogsRoutes.post("/",
  ensureAuthenticated,
  verifyUserAuthorization(["sale"]),
  deliveryLogsController.create
)
deliveriesLogsRoutes.get("/:delivery_id/show",
  ensureAuthenticated,
  verifyUserAuthorization(["sale", "customer"]),
  deliveryLogsController.show
)

export { deliveriesLogsRoutes }