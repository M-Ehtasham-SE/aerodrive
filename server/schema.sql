CREATE DATABASE IF NOT EXISTS aerodrive_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE aerodrive_db;

CREATE TABLE IF NOT EXISTS person (
  PersonID    INT AUTO_INCREMENT PRIMARY KEY,
  FirstName   VARCHAR(50) NOT NULL,
  LastName    VARCHAR(50) NOT NULL,
  Street      VARCHAR(100),
  City        VARCHAR(50),
  ZipCode     VARCHAR(20),
  Phone       VARCHAR(20) NOT NULL,
  AlternatePhone VARCHAR(20),
  Password    VARCHAR(255) NOT NULL,
  CreatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer (
  PersonID    INT PRIMARY KEY,
  CNIC        VARCHAR(15) UNIQUE NOT NULL,
  LicenseNo   VARCHAR(30) UNIQUE NOT NULL,
  DateOfBirth DATE NOT NULL,
  Occupation  VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES person(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS branch (
  BranchID INT AUTO_INCREMENT PRIMARY KEY,
  BranchName VARCHAR(100) NOT NULL,
  Street VARCHAR(100),
  City VARCHAR(50),
  ZipCode VARCHAR(20),
  Phone VARCHAR(20)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff (
  PersonID    INT PRIMARY KEY,
  Position    VARCHAR(50),
  HireDate    DATE,
  Salary      DECIMAL(10,2),
  ShiftType   ENUM('Morning','Evening','Night'),
  StartTime   TIME,
  EndTime     TIME,
  Qualifications TEXT,
  BranchID    INT,
  FOREIGN KEY (PersonID) REFERENCES person(PersonID) ON DELETE CASCADE,
  FOREIGN KEY (BranchID) REFERENCES branch(BranchID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS manager (
  PersonID        INT PRIMARY KEY,
  Department      VARCHAR(100),
  ManagedBranch   VARCHAR(100),
  ReportsTo       INT,
  BonusPercentage DECIMAL(5,2),
  FOREIGN KEY (PersonID) REFERENCES staff(PersonID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clerk (
  PersonID          INT PRIMARY KEY,
  CounterNo         INT,
  DailyTransactions INT DEFAULT 0,
  Supervisor        VARCHAR(100),
  TerminalID        VARCHAR(50),
  FOREIGN KEY (PersonID) REFERENCES staff(PersonID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic (
  PersonID          INT PRIMARY KEY,
  Specialization    ENUM('Engine','Transmission','Electrical','General'),
  ToolKit           VARCHAR(200),
  WorkshopAssigned  VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES staff(PersonID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS emergency_contact (
  PersonID INT,
  Relationship VARCHAR(50),
  Priority INT,
  CustomerID INT,
  PRIMARY KEY (PersonID),
  FOREIGN KEY (PersonID) REFERENCES person(PersonID) ON DELETE CASCADE,
  FOREIGN KEY (CustomerID) REFERENCES customer(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS model (
  ModelID          INT AUTO_INCREMENT PRIMARY KEY,
  ModelName        VARCHAR(100) NOT NULL,
  Brand            VARCHAR(100) NOT NULL,
  Category         VARCHAR(50),
  SeatingCapacity  INT,
  Transmission     ENUM('Manual','Automatic','CVT'),
  FuelAverage      DECIMAL(5,2),
  DailyRate        DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicle (
  VehicleID      INT AUTO_INCREMENT PRIMARY KEY,
  RegistrationNo VARCHAR(50) UNIQUE NOT NULL,
  LicensePlate   VARCHAR(30) UNIQUE NOT NULL,
  Mileage        INT DEFAULT 0,
  Status         ENUM('Available','Rented','Maintenance','Reserved','Retired') DEFAULT 'Available',
  FuelType       ENUM('Petrol','Diesel','Electric','Hybrid'),
  Year           YEAR,
  Color          VARCHAR(30),
  CurrentCity    VARCHAR(50),
  ParkingSpot    VARCHAR(50),
  ModelID        INT NOT NULL,
  BranchID       INT NOT NULL,
  FOREIGN KEY (ModelID) REFERENCES model(ModelID),
  FOREIGN KEY (BranchID) REFERENCES branch(BranchID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS car (
  VehicleID     INT PRIMARY KEY,
  Doors         INT,
  TrunkCapacity DECIMAL(5,2),
  ACType        VARCHAR(50),
  BootSpace     DECIMAL(5,2),
  FOREIGN KEY (VehicleID) REFERENCES vehicle(VehicleID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bike (
  VehicleID      INT PRIMARY KEY,
  EngineCapacity INT,
  BikeType       ENUM('Sport','Cruiser','Standard'),
  HelmetIncluded BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (VehicleID) REFERENCES vehicle(VehicleID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS truck (
  VehicleID    INT PRIMARY KEY,
  LoadCapacity DECIMAL(8,2),
  Axles        INT,
  CargoType    ENUM('Open','Closed','Refrigerated'),
  Height       DECIMAL(5,2),
  FOREIGN KEY (VehicleID) REFERENCES vehicle(VehicleID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reservation (
  ReservationID   INT AUTO_INCREMENT PRIMARY KEY,
  ReservationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PickupDate      DATE NOT NULL,
  PickupTime      TIME,
  ReturnDate      DATE NOT NULL,
  ReturnTime      TIME,
  PaymentDetails  VARCHAR(255),
  Status          ENUM('Pending','Confirmed','Active','Completed','Cancelled') DEFAULT 'Pending',
  SpecialRequests TEXT,
  CustomerID      INT NOT NULL,
  VehicleID       INT NOT NULL,
  FOREIGN KEY (CustomerID) REFERENCES customer(PersonID),
  FOREIGN KEY (VehicleID)  REFERENCES vehicle(VehicleID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contract (
  ContractNo        VARCHAR(30) PRIMARY KEY,
  PickupDate        DATE,
  ReturnDate        DATE,
  BaseCharge        DECIMAL(10,2),
  TotalCharge       DECIMAL(10,2),
  PaymentStatus     ENUM('Pending','Partial','Paid'),
  MileageAtStart    INT,
  MileageAtEnd      INT,
  TermsAndConditions TEXT,
  ReservationID     INT UNIQUE,
  CustomerID        INT,
  VehicleID         INT,
  FOREIGN KEY (ReservationID) REFERENCES reservation(ReservationID),
  FOREIGN KEY (CustomerID)    REFERENCES customer(PersonID),
  FOREIGN KEY (VehicleID)     REFERENCES vehicle(VehicleID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment (
  PaymentID     INT AUTO_INCREMENT PRIMARY KEY,
  PaymentDate   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Amount        DECIMAL(10,2) NOT NULL,
  PaymentStatus ENUM('Paid','Pending','Failed') DEFAULT 'Pending',
  PaymentType   ENUM('Cash','Card','Online') NOT NULL,
  ReservationID INT,
  ContractNo    VARCHAR(30),
  FOREIGN KEY (ReservationID) REFERENCES reservation(ReservationID),
  FOREIGN KEY (ContractNo)    REFERENCES contract(ContractNo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cash (
  PaymentID INT PRIMARY KEY,
  CashierName VARCHAR(100),
  ReceiptNo VARCHAR(50),
  ChangeGiven DECIMAL(10,2),
  FOREIGN KEY (PaymentID) REFERENCES payment(PaymentID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS card (
  PaymentID INT PRIMARY KEY,
  CardType ENUM('Visa','Mastercard','Amex','Discover'),
  CardLast4 VARCHAR(4),
  TransactionID VARCHAR(100),
  AuthorizationCode VARCHAR(100),
  FOREIGN KEY (PaymentID) REFERENCES payment(PaymentID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS online_payment (
  PaymentID INT PRIMARY KEY,
  PaymentGateway ENUM('Stripe','PayPal','JazzCash','Easypaisa'),
  TransactionReference VARCHAR(100),
  QRCode VARCHAR(255),
  WalletType ENUM('Mobile','Web'),
  FOREIGN KEY (PaymentID) REFERENCES payment(PaymentID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS damage_report (
  ReportID INT AUTO_INCREMENT PRIMARY KEY,
  ReportDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  DamagePart VARCHAR(100),
  DamageSide VARCHAR(50),
  Severity ENUM('Low','Medium','High','Critical'),
  IncidentDetails TEXT,
  Description TEXT,
  Status ENUM('Pending','In Review','Resolved') DEFAULT 'Pending',
  RepairCost DECIMAL(10,2),
  InsuranceClaim BOOLEAN DEFAULT FALSE,
  VehicleID INT,
  ContractNo VARCHAR(30),
  FOREIGN KEY (VehicleID) REFERENCES vehicle(VehicleID),
  FOREIGN KEY (ContractNo) REFERENCES contract(ContractNo)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS maintenance (
  MaintenanceID INT AUTO_INCREMENT PRIMARY KEY,
  ScheduledDate DATE,
  CompletedDate DATE,
  ServiceType VARCHAR(100),
  MileageAtService INT,
  Description TEXT,
  Status ENUM('Scheduled','In Progress','Completed','Cancelled') DEFAULT 'Scheduled',
  LaborCost DECIMAL(10,2),
  PartsCost DECIMAL(10,2),
  TotalCost DECIMAL(10,2),
  VehicleID INT,
  MechanicID INT,
  FOREIGN KEY (VehicleID) REFERENCES vehicle(VehicleID),
  FOREIGN KEY (MechanicID) REFERENCES mechanic(PersonID)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS insurance (
  PolicyNo VARCHAR(50) PRIMARY KEY,
  InsuranceCompany VARCHAR(100),
  StartDate DATE,
  EndDate DATE,
  CoverageType VARCHAR(100),
  MaxCoverage DECIMAL(12,2),
  Status ENUM('Active','Expired','Cancelled') DEFAULT 'Active',
  VehicleID INT,
  FOREIGN KEY (VehicleID) REFERENCES vehicle(VehicleID)
) ENGINE=InnoDB;

-- Multivalued attribute tables (14 total)
CREATE TABLE IF NOT EXISTS customer_email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PersonID INT,
  Email VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES customer(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customer_payment_method (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PersonID INT,
  PaymentMethod VARCHAR(50),
  FOREIGN KEY (PersonID) REFERENCES customer(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff_email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PersonID INT,
  Email VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES staff(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff_skill (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PersonID INT,
  Skill VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES staff(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff_certification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PersonID INT,
  Certification VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES staff(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mechanic_certification (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PersonID INT,
  Certification VARCHAR(100),
  FOREIGN KEY (PersonID) REFERENCES mechanic(PersonID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS branch_email (
  id INT AUTO_INCREMENT PRIMARY KEY,
  BranchID INT,
  Email VARCHAR(100),
  FOREIGN KEY (BranchID) REFERENCES branch(BranchID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS branch_social (
  id INT AUTO_INCREMENT PRIMARY KEY,
  BranchID INT,
  Platform VARCHAR(50),
  Handle VARCHAR(100),
  FOREIGN KEY (BranchID) REFERENCES branch(BranchID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS model_color (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ModelID INT,
  Color VARCHAR(50),
  FOREIGN KEY (ModelID) REFERENCES model(ModelID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS model_feature (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ModelID INT,
  Feature VARCHAR(100),
  FOREIGN KEY (ModelID) REFERENCES model(ModelID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS insurance_peril (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PolicyNo VARCHAR(50),
  Peril VARCHAR(100),
  FOREIGN KEY (PolicyNo) REFERENCES insurance(PolicyNo) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS insurance_exclusion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PolicyNo VARCHAR(50),
  Exclusion VARCHAR(100),
  FOREIGN KEY (PolicyNo) REFERENCES insurance(PolicyNo) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS damage_photo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ReportID INT,
  PhotoURL VARCHAR(255),
  FOREIGN KEY (ReportID) REFERENCES damage_report(ReportID) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contract_charge (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ContractNo VARCHAR(30),
  ChargeDescription VARCHAR(100),
  Amount DECIMAL(10,2),
  FOREIGN KEY (ContractNo) REFERENCES contract(ContractNo) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS maintenance_part (
  id INT AUTO_INCREMENT PRIMARY KEY,
  MaintenanceID INT,
  PartName VARCHAR(100),
  PartCost DECIMAL(10,2),
  Quantity INT,
  FOREIGN KEY (MaintenanceID) REFERENCES maintenance(MaintenanceID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Derived view
CREATE OR REPLACE VIEW v_customer AS
  SELECT c.*, p.FirstName, p.LastName, p.Phone, p.Street, p.City, p.ZipCode,
         TIMESTAMPDIFF(YEAR, c.DateOfBirth, CURDATE()) AS Age
  FROM customer c
  JOIN person p ON c.PersonID = p.PersonID;
