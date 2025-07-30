const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserMail = sequelize.define(
  "usermailid",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    emailid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // ⬅️ disables createdAt and updatedAt
  }
);


const UserCredential = sequelize.define(
  "login",
  {
    Id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "technician", "user"),
      allowNull: false,
      defaultValue: "admin",
    },
  },
  {
    freezeTableName: true, // Prevents Sequelize from pluralizing table name
    timestamps: false, // Disables createdAt and updatedAt
  }
);

// models/UserDetails.js
const UserDetails  = 
   sequelize.define("userdetails", {
    rollnumber: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    mailid: DataTypes.STRING,
    role: DataTypes.STRING,
    department: DataTypes.STRING,
    batch: DataTypes.STRING,
  }, {
    freezeTableName: true,
    timestamps: false
  });

// models/ComplaintDetails.js
const ComplaintDetails = sequelize.define(
  "complaint_details",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    mailid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    systemType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rdepartment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lab: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problemType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Acceptance: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Pending",
    },
    Remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Pending",
    },
    technicianId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    technicianInfo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    TechnicianComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);
const Department = sequelize.define(
  "department",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // Adds createdAt and updatedAt
  }
);
const Venue = sequelize.define(
  "venue",
  {
    venueId: {
      type: DataTypes.STRING(100), // Integer ID as per SQL
      allowNull: false,
      primaryKey: true, // Primary key
      unique: true, // Ensure uniqueness
      // No autoIncrement: true
    },
    department_id: {
      type: DataTypes.INTEGER, // Should match Department's primary key type
      allowNull: false,
    },
    venueName: {
      type: DataTypes.STRING(100), // VARCHAR(100)
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false, // Disable createdAt and updatedAt
  }
);

const SystemType = sequelize.define(
  "system_type",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    typeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const SystemFault = sequelize.define(
  "system_fault",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    faultName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);



module.exports = {
  UserMail,
  UserCredential,
  UserDetails,
  ComplaintDetails,
  Department,
  Venue,
  SystemType,
  SystemFault
};
