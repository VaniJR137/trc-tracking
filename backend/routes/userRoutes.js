const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");

router.post("/auth/google", userController.loginUser);
router.post("/login", userController.loginWithCredentials);
router.post("/requestComplaint",authenticateToken, userController.submitComplaint);
router.get(
  "/complaints/:userId",
  authenticateToken,userController.getComplaintsByUser
);
router.get(
  "/complainttechnician/:Id",
  authenticateToken,userController.getComplaintsByTechnician
);
router.get("/technician", authenticateToken,userController.getTechnicianUsers);
router.post("/addDepartment", authenticateToken, userController.addDepartment);
router.post("/addVenue", authenticateToken, userController.addVenue);
router.get("/complaintsAdmin",authenticateToken, userController.getAllComplaints);
router.post("/addbyadmin", authenticateToken,userController.addByAdmin);
router.put(
  "/complaints/:id/acceptance",
  authenticateToken,userController.updateAcceptance
);
router.put(
  "/comments/:id",
  authenticateToken,userController.updateTechnicianComments
);

router.put(
  "/complaints/:id/update",
  authenticateToken,userController.updateComplaint
);
router.get("/getDepartments", authenticateToken, userController.getDepartments);
router.get("/getVenues", authenticateToken, userController.getVenues);

module.exports = router;
