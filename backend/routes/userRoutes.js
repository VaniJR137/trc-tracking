const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/auth/google", userController.loginUser);
router.post("/login", userController.loginWithCredentials);
router.post("/requestComplaint", userController.submitComplaint);
router.get("/complaints/:userId", userController.getComplaintsByUser);
router.get("/complainttechnician/:Id", userController.getComplaintsByTechnician);
router.get("/technician", userController.getTechnicianUsers);

router.get("/complaintsAdmin", userController.getAllComplaints);
router.post("/addbyadmin", userController.addByAdmin);
router.put("/complaints/:id/acceptance", userController.updateAcceptance);
router.put("/comments/:id", userController.updateTechnicianComments);

router.put("/complaints/:id/update", userController.updateComplaint);

module.exports = router;
