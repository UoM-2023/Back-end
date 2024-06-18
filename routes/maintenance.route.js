const express = require("express");
const Completed_Maintenance_Request = require("../controller/completedMaintenance.controller");
const Internal_Maintenance_Request = require("../controller/InternalMaintenanceReq.controller");
const New_Maintenance_Request = require("../controller/newMaintenanceReq.controller");

const router = express.Router();

//completed maintenance request
router.post(
  "/Completed_Mnt_Req",
  Completed_Maintenance_Request.add_Completed_Mnt_Request
);
router.get(
  "/Completed_Mnt_Req",
  Completed_Maintenance_Request.get_All_Completed_Mnt_Request
);
router.get(
  "/Completed_Mnt_Req/:id",
  Completed_Maintenance_Request.get_A_Completed_Mnt_Request
);
router.put(
  "/Completed_Mnt_Req/:id",
  Completed_Maintenance_Request.update_completed_Mnt_Request
);
router.delete(
  "/Completed_Mnt_Req/:id",
  Completed_Maintenance_Request.delete_Completed_Mnt_Request
);

//Internal maintenance requests
router.post(
  "/Internal_Mnt_Req",
  Internal_Maintenance_Request.add_Internal_Mnt_Request
);
router.get(
  "/Internal_Mnt_Req",
  Internal_Maintenance_Request.get_All_Internal_Mnt_Requests
);
router.get(
  "/Internal_Mnt_Req/:id",
  Internal_Maintenance_Request.get_A_Internal_Mnt_Request
);
router.put(
  "/Internal_Mnt_Req/:id",
  Internal_Maintenance_Request.update_Internal_Mnt_Request
);
router.delete(
  "/Internal_Mnt_Req/:id",
  Internal_Maintenance_Request.delete_Internal_Mnt_Request
);

//new maintenance requests

router.post("/New_Mnt_Req", New_Maintenance_Request.add_Maintenance_Request);
router.get(
  "/New_Mnt_Req",
  New_Maintenance_Request.get_All_Maintenance_Requests
);
router.get(
  "/New_Mnt_Req/:id",
  New_Maintenance_Request.get_A_Maintenance_Request
);
router.get(
  "/New_Mnt_ReqDate/:Mnt_Request_id",
  New_Maintenance_Request.get_A_Maintenance_RequestDate
);
router.get(
  "/New_Mnt_Req_By_User/:Unit_id",
  New_Maintenance_Request.getMaintenanceRequestsByUser
);
router.put(
  "/Update_Mnt_Req/:id",
  New_Maintenance_Request.update_Maintenance_Request
);
router.delete(
  "/New_Mnt_Req/:id",
  New_Maintenance_Request.delete_Maintenance_Request
);
router.put(
  "/New_Mnt_Req/status/:id",
  New_Maintenance_Request.update_Maintenance_Request_Status
);

module.exports = router;
