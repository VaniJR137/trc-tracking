const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const { Department, Venue } = require("../models/userModel"); // Adjust path if needed
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/bulk-upload/departments",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required." });
    }

    const departments = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        try {
          const normalizedRow = {};
          for (const key in row) {
            const lowerKey = key.toLowerCase().trim();
            normalizedRow[lowerKey] = row[key]?.trim();
          }

          // Flexible detection for department name and code
          let departmentName = null;
          let departmentCode = null;

          for (const key in normalizedRow) {
            if (!departmentName && key.includes("name")) {
              departmentName = normalizedRow[key];
            }
            if (!departmentCode && key.includes("code")) {
              departmentCode = normalizedRow[key];
            }
          }

          if (departmentName && departmentCode) {
            departments.push({
              departmentName,
              departmentCode,
            });
          } else {
            console.log("Skipping invalid row:", row);
          }
        } catch (err) {
          console.error("Error processing row:", row, err.message);
        }
      })
      .on("end", async () => {
        try {
          if (departments.length === 0) {
            return res.status(400).json({
              message: "Upload failed: No valid department data found in CSV.",
            });
          }

          // Perform bulk insert or update logic here
          await Department.bulkCreate(departments, {
            updateOnDuplicate: ["departmentCode", "departmentName"],
          });

          res.status(200).json({
            message: "Departments uploaded successfully.",
            count: departments.length,
          });
        } catch (error) {
          console.error("Bulk upload failed:", error.message);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }
);

router.post(
  "/bulk-upload/venues",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required." });
    }

    const rawRows = [];

    try {
      const stream = fs.createReadStream(req.file.path).pipe(csv());

      stream.on("data", (row) => {
        rawRows.push(row);
      });

      stream.on("end", async () => {
        fs.unlinkSync(req.file.path);

        const venues = [];

        for (const row of rawRows) {
          try {
            const keys = Object.keys(row);
            const venueIdKey = keys.find((k) => k.toLowerCase().includes("id"));
            const venueNameKey = keys.find((k) =>
              k.toLowerCase().includes("name")
            );
            const deptCodeKey = keys.find((k) =>
              k.toLowerCase().includes("code")
            );

            const venueId = row[venueIdKey]?.trim();
            const venueName = row[venueNameKey]?.trim();
            const deptCode = row[deptCodeKey]?.trim();

            let department_id = null;

            if (deptCode) {
              const dept = await Department.findOne({
                where: { departmentCode: deptCode.trim() },
              });
              if (dept) department_id = dept.id;
            }

            if (venueId && venueName && department_id) {
              venues.push({ venueId, venueName, department_id });
            } else {
              console.warn("Skipping invalid row:", row);
            }
          } catch (err) {
            console.error("Error processing row:", row, err.message);
          }
        }

        if (venues.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid venue data found in CSV." });
        }

        try {
          await Venue.bulkCreate(venues, { ignoreDuplicates: true });
          res
            .status(200)
            .json({
              message: `${venues.length} venues uploaded successfully.`,
            });
        } catch (err) {
          console.error("Database error:", err.message);
          res.status(500).json({ message: "Failed to upload venues." });
        }
      });

      stream.on("error", (error) => {
        fs.unlinkSync(req.file.path);
        console.error("CSV parsing error:", error.message);
        res.status(500).json({ message: "Failed to read uploaded file." });
      });
    } catch (outerErr) {
      fs.unlinkSync(req.file.path);
      console.error("Unexpected error:", outerErr.message);
      res.status(500).json({ message: "Unexpected server error." });
    }
  }
);


module.exports = router;
