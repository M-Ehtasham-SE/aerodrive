-- ==============================================================================
-- COMPLEX VIEWS
-- ==============================================================================

USE aerodrive_db;

-- Description: A complex view combining Multiple Tables with Aggregation and Grouping.
-- It shows each branch, the total number of vehicles it holds, and the average daily rate of those vehicles.

CREATE OR REPLACE VIEW v_branch_vehicle_stats AS
SELECT 
    b.BranchID,
    b.BranchName,
    b.City,
    COUNT(v.VehicleID) AS TotalVehicles,
    SUM(CASE WHEN v.Status = 'Available' THEN 1 ELSE 0 END) AS AvailableVehicles,
    ROUND(AVG(m.DailyRate), 2) AS AverageDailyRate
FROM 
    branch b
LEFT JOIN 
    vehicle v ON b.BranchID = v.BranchID
LEFT JOIN 
    model m ON v.ModelID = m.ModelID
GROUP BY 
    b.BranchID, b.BranchName, b.City;

-- Description: A complex view tracking active damage reports and calculating total estimated 
-- repair costs for each vehicle currently in the system.
CREATE OR REPLACE VIEW v_vehicle_damage_summary AS
SELECT 
    v.RegistrationNo,
    m.ModelName,
    COUNT(dr.ReportID) AS TotalDamageIncidents,
    SUM(dr.RepairCost) AS TotalEstimatedRepairCost
FROM 
    vehicle v
JOIN 
    model m ON v.ModelID = m.ModelID
JOIN 
    damage_report dr ON v.VehicleID = dr.VehicleID
WHERE 
    dr.Status IN ('Pending', 'In Review')
GROUP BY 
    v.VehicleID, v.RegistrationNo, m.ModelName
HAVING 
    COUNT(dr.ReportID) > 0;
