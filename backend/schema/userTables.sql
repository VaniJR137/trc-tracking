CREATE TABLE usermailid (
  id INT AUTO_INCREMENT PRIMARY KEY,
  emailid VARCHAR(255) NOT NULL UNIQUE
);
CREATE TABLE login (
  Id VARCHAR(50) PRIMARY KEY, 
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20)  CHECK (role IN ('admin', 'technician', 'user'))
);

CREATE TABLE userdetails (
    rollnumber varchar(255) PRIMARY KEY,
    name VARCHAR(100),
    mailid VARCHAR(100) UNIQUE,
    role VARCHAR(10) CHECK (role IN ('Student', 'Faculty')),
    department VARCHAR(100),
    batch VARCHAR(9) -- e.g., '2021-2025'
);
INSERT INTO `userdetails` (`rollnumber`, `name`, `mailid`, `role`, `department`, `batch`) VALUES ('7376212IT261', 'VANI J R', 'vani.it21@bitsathy.ac.in', 'faculty', 'IT', NULL);

CREATE TABLE complaint_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  mailid VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(100) ,
  batch VARCHAR(20),
  systemType VARCHAR(100) NOT NULL,
  serialNumber VARCHAR(100) NOT NULL,
  rdepartment VARCHAR(100) NOT NULL,
  lab VARCHAR(100) NOT NULL,
  problemType VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  Acceptance VARCHAR(50) DEFAULT 'Pending',   
  Remarks  TEXT ,      -- ✅ default value set
  status VARCHAR(50) DEFAULT 'Pending',
  technicianId VARCHAR(100),
  technicianInfo VARCHAR(100),
  TechnicianComments TEXT,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
create table department (
  id INT AUTO_INCREMENT PRIMARY KEY,
  departmentName VARCHAR(100) NOT NULL UNIQUE,
  departmentCode VARCHAR(10) NOT NULL UNIQUE


);
create table venue (
  venueId varchar(100)NOT NULL PRIMARY KEY,
  department_id INT NOT NULL,
  venueName VARCHAR(100) NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE ON UPDATE CASCADE
);