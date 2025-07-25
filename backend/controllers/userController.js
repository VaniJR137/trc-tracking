const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "137inav";
const { Op } = require("sequelize");
const { UserMail, UserCredential,UserDetails,ComplaintDetails,Department,Venue } = require("../models/userModel");
exports.loginUser = async (req, res) => {
  const { emailid } = req.body;

  try {
    const user = await UserMail.findOne({ where: { emailid } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not registered" });
    }

    // ✅ Generate JWT token after verifying user
    const token = jwt.sign(
      { emailid, role: "user" }, // Optional: Use dynamic role if available
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Return the token to the frontend
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token, // ⬅️ Send token
      user: { emailid }, // Optional additional data
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginWithCredentials = async (req, res) => {
  const { userid, password } = req.body;

  try {
    const user = await UserCredential.findByPk(userid);

    if (!user) {
      return res.status(401).json({ message: "Invalid userid or password" });
    }

    const isPlainPasswordMatch = user.dataValues.password === password;
    const isHashedPasswordMatch = await bcrypt.compare(
      password,
      user.dataValues.password
    );

    if (!isPlainPasswordMatch && !isHashedPasswordMatch) {
      return res.status(401).json({ message: "Invalid userid or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { userid: user.Id, role: user.role }, // payload
      JWT_SECRET,
      { expiresIn: "1d" } // expires in 1 day
    );

    res.status(200).json({
      message: "Login successful",
      token, 
      role: user.role,
    });
  } catch (error) {
    console.error("Credential login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.addByAdmin = async (req, res) => {
  const { Id, name, phone, password, role } = req.body;

  try {
    await UserCredential.create({
      Id,
      name,
      phone,
      password, // plain password directly inserted
      role,
    });

    return res.status(201).json({ message: "User successfully inserted" });
  } catch (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ message: "Failed to insert user" });
  }
};

exports.addDepartment = async (req, res) => {
  const { departmentName,departmentCode } = req.body;

  try {
    await Department.create({
      departmentName,
      departmentCode
    });

    return res.status(201).json({ message: "Department successfully added" });
  } catch (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ message: "Failed to add department" });
  }
};
exports.addVenue = async (req, res) => {
  const { venueId,department_id, venueName } = req.body;

  try {
    await Venue.create({
      venueId,
      department_id,
      venueName,
    });

    return res.status(201).json({ message: "Venue successfully added" });
  } catch (error) {
    console.error("Insert error:", error);
    return res.status(500).json({ message: "Failed to add venue" });
  }
};

exports.submitComplaint = async (req, res) => {
  try {
    const {
      userId,
      rdepartment,
      systemType,
      serialNumber,
      lab,
      problemType,
      details,
    } = req.body;

    let complaintPayload = {
      systemType,
      serialNumber,
      rdepartment,
      lab,
      problemType,
      details,
      Acceptance: "Pending",
      status: "Pending",
      technicianId: null,
    };

    // First, check if user exists in UserDetails
    const user = await UserDetails.findOne({ where: { mailid: userId } });

    if (user) {
      complaintPayload = {
        ...complaintPayload,
        userId: user.rollnumber,
        name: user.name,
        rollno: user.rollnumber,
        mailid: user.mailid,
        role: user.role,
        department: user.department,
        batch: user.batch || null,
      };
    } else {
      // Else check in UserCredential (login table)
      const userCredential = await UserCredential.findOne({
        where: { Id: userId },
      });

      if (!userCredential) {
        return res
          .status(404)
          .json({
            message: "User not found in either UserDetails or UserCredential",
          });
      }

      complaintPayload = {
        ...complaintPayload,
        userId: userCredential.Id,
        name: userCredential.name,
        rollno: null,
        mailid: userCredential.phone, // phone as mailid as per your request
        role: userCredential.role,
        department: null,
        batch: null,
      };
    }

    // Create complaint
    const complaint = await ComplaintDetails.create(complaintPayload);

    res.status(200).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Complaint submission error:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    return res.status(200).json(departments);
  } catch (error) {
    console.error("Fetch departments error:", error);
    return res.status(500).json({ message: "Failed to fetch departments" });
  }
};
// Example Express Controller
exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    res.json(venues);  // ✅ Must send array of venues
  } catch (error) {
    console.error("Failed to fetch venues:", error.message);
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};


exports.getComplaintsByUser = async (req, res) => {
  const { userId } = req.params; // or req.query.userId

  try {
    let mailidToSearch = null;

    // First, check in UserDetails by mailid
    const user = await UserDetails.findOne({ where: { mailid: userId } });

    if (user) {
      mailidToSearch = user.mailid;
    } else {
      // If not found in UserDetails, check in UserCredential by Id
      const userCredential = await UserCredential.findOne({
        where: { Id: userId },
      });

      if (userCredential) {
        mailidToSearch = userCredential.phone; // phone is stored as mailid in complaints
      } else {
        return res
          .status(404)
          .json({ message: "User not found in UserDetails or UserCredential" });
      }
    }

    // Fetch complaints using the resolved mailid (email or phone)
    const complaints = await ComplaintDetails.findAll({
      where: { mailid: mailidToSearch },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching user complaints:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await ComplaintDetails.findAll({
      order: [["createdAt", "DESC"]], // Optional: sort by most recent
    });

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateAcceptance = async (req, res) => {
  const { id } = req.params;
  const { Acceptance, Remarks } = req.body; // include Remarks

  try {
    const complaint = await ComplaintDetails.findByPk(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.Acceptance = Acceptance;

    // If Rejected, store remarks
    if (Acceptance === "Rejected" && Remarks) {
      complaint.Remarks = Remarks; // Make sure `Remarks` exists in your model
    }

    // Optionally clear technician info if rejected
    if (Acceptance === "Rejected") {
      complaint.technicianId = null;
      complaint.technicianInfo = null;
      complaint.status = null;
    }

    await complaint.save();

    res.status(200).json({ message: "Acceptance updated", complaint });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateComplaint = async (req, res) => {
  const { id } = req.params;
  const { technicianId, technicianInfo, status } = req.body;

  try {
    const complaint = await ComplaintDetails.findByPk(id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Update technician ID and combined info
    if (technicianId) complaint.technicianId = technicianId;
    if (technicianInfo) complaint.technicianInfo = technicianInfo;

    // Optionally update status
    if (status) complaint.status = status;

    await complaint.save();

    res.json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getComplaintsByTechnician = async (req, res) => {
  const { Id } = req.params; // technician's login ID

  try {
    const complaints = await ComplaintDetails.findAll({
      where: { technicianId: Id }, // ✅ use technicianId not Id
      order: [["createdAt", "DESC"]],
    });

    if (!complaints.length) {
      return res
        .status(404)
        .json({ message: "No complaints found for this technician." });
    }

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTechnicianUsers = async (req, res) => {
  try {
    const technicians = await UserCredential.findAll({
      where: { role: "technician" }
    });

    res.status(200).json({ technicians });
  } catch (error) {
    console.error("Error fetching technicians:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.updateTechnicianComments = async (req, res) => {
  const { id } = req.params;
  const { TechnicianComments } = req.body;

  try {
    const complaint = await ComplaintDetails.findByPk(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.TechnicianComments = TechnicianComments;

    await complaint.save();

    res.status(200).json({ message: "Technician comment updated", complaint });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
  