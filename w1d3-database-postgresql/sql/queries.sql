-- Q1	Insert một student mới.
INSERT INTO students (full_name, email, student_code)
VALUES ('Mai Hoang', 'mai.hoang@example.edu', 'STU006');

-- Q2	Insert một event mới cho một club đã có.
INSERT INTO events (club_id, title, start_time, capacity)
SELECT id, 'Campus Robotics Demo', '2026-06-20 14:00:00+07', 60
FROM clubs
WHERE name = 'Tech Club';


-- Q3	Update thông tin một event, ví dụ title, start_time hoặc capacity. 
UPDATE events
SET
    title = 'Web Development Basics: HTML, CSS & JavaScript',
    capacity = 45
WHERE title = 'Web Development Basics';


-- Q4	Cancel hoặc delete một registration có điều kiện rõ ràng.
UPDATE event_registrations er
SET registration_status = 'CANCELLED'
    FROM students s, events e, clubs c
WHERE er.student_id = s.id
  AND er.event_id = e.id
  AND e.club_id = c.id
  AND s.email = 'an.nguyen@example.edu'
  AND e.title = 'AI Workshop: Intro to Machine Learning'
  AND c.name = 'Tech Club'
  AND e.start_time = '2026-06-01 09:00:00+07'
    RETURNING
    er.id AS registration_id,
    s.full_name AS student_name,
    e.title AS event_title,
    c.name AS club_name,
    er.registration_status,
    er.registered_at;

-- Q5	Select danh sách event kèm tên club.
SELECT
    e.id AS event_id,
    e.title AS event_title,
    c.name AS club_name,
    e.start_time,
    e.capacity
FROM events e
JOIN clubs c ON c.id = e.club_id
ORDER BY e.start_time;

-- Q6	Select danh sách student đã đăng ký một event cụ thể.
SELECT
    s.id AS student_id,
    s.full_name,
    s.email,
    er.registration_status,
    er.registered_at
FROM event_registrations er
JOIN students s ON s.id = er.student_id
JOIN events e ON e.id = er.event_id
WHERE e.title = 'AI Workshop: Intro to Machine Learning'
  AND er.registration_status = 'REGISTERED'
ORDER BY s.full_name;

-- Q7	Count số lượng registration theo từng event.
SELECT
    e.id AS event_id,
    e.title AS event_title,
    c.name AS club_name,
    COUNT(er.id) AS total_registration_rows,
    COUNT(er.id) FILTER (WHERE er.registration_status = 'REGISTERED') AS active_registered_count
FROM events e
JOIN clubs c ON c.id = e.club_id
LEFT JOIN event_registrations er ON er.event_id = e.id
GROUP BY e.id, e.title, c.name
ORDER BY active_registered_count DESC, e.start_time;
