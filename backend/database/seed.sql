-- Insert Demo Admin
-- Password is 'admin123' (hash generated for bcrypt)
INSERT INTO users (name, email, password, role) 
VALUES ('System Admin', 'admin@hostel.com', '$2b$10$YourHashedPasswordHere_ReplaceWithRealHash', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert Demo Staff
INSERT INTO users (name, email, password, role, staff_specialty) 
VALUES 
('Rajesh Kumar', 'staff1@hostel.com', '$2b$10$YourHashedPasswordHere_ReplaceWithRealHash', 'staff', 'Plumbing'),
('Suresh Singh', 'staff2@hostel.com', '$2b$10$YourHashedPasswordHere_ReplaceWithRealHash', 'staff', 'Electrical')
ON CONFLICT (email) DO NOTHING;

-- Insert Demo Student
INSERT INTO users (name, email, password, role, hostel_name, block_name, room_number) 
VALUES ('Rahul Sharma', 'student@hostel.com', '$2b$10$YourHashedPasswordHere_ReplaceWithRealHash', 'student', 'Boys Hostel 1', 'A', '101')
ON CONFLICT (email) DO NOTHING;
