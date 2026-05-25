INSERT INTO students (full_name, email, student_code) VALUES
('An Nguyen', 'an.nguyen@example.edu', 'STU001'),
('Binh Tran', 'binh.tran@example.edu', 'STU002'),
('Chi Le', 'chi.le@example.edu', 'STU003'),
('Dung Pham', 'dung.pham@example.edu', 'STU004'),
('Linh Vo', 'linh.vo@example.edu', 'STU005');

INSERT INTO clubs (name, description) VALUES
('Tech Club', 'A campus club for students interested in programming, AI, and software engineering.'),
('English Club', 'A club for English practice, debating, and public speaking.'),
('Music Club', 'A club for students who enjoy singing, instruments, and live performance.');

INSERT INTO events (club_id, title, start_time, capacity)
SELECT id, 'AI Workshop: Intro to Machine Learning', '2026-06-01 09:00:00+07', 40
FROM clubs
WHERE name = 'Tech Club';

INSERT INTO events (club_id, title, start_time, capacity)
SELECT id, 'Web Development Basics', '2026-06-05 13:30:00+07', 35
FROM clubs
WHERE name = 'Tech Club';

INSERT INTO events (club_id, title, start_time, capacity)
SELECT id, 'English Debate Night', '2026-06-03 18:00:00+07', 30
FROM clubs
WHERE name = 'English Club';

INSERT INTO events (club_id, title, start_time, capacity)
SELECT id, 'Public Speaking Bootcamp', '2026-06-08 10:00:00+07', 25
FROM clubs
WHERE name = 'English Club';

INSERT INTO events (club_id, title, start_time, capacity)
SELECT id, 'Acoustic Music Night', '2026-06-12 19:00:00+07', 50
FROM clubs
WHERE name = 'Music Club';

INSERT INTO event_registrations (student_id, event_id, registration_status) VALUES
(
    (SELECT id FROM students WHERE email = 'an.nguyen@example.edu'),
    (SELECT id FROM events WHERE title = 'AI Workshop: Intro to Machine Learning'),
    'REGISTERED'
),
(
    (SELECT id FROM students WHERE email = 'binh.tran@example.edu'),
    (SELECT id FROM events WHERE title = 'AI Workshop: Intro to Machine Learning'),
    'REGISTERED'
),
(
    (SELECT id FROM students WHERE email = 'chi.le@example.edu'),
    (SELECT id FROM events WHERE title = 'Web Development Basics'),
    'REGISTERED'
),
(
    (SELECT id FROM students WHERE email = 'dung.pham@example.edu'),
    (SELECT id FROM events WHERE title = 'English Debate Night'),
    'REGISTERED'
),
(
    (SELECT id FROM students WHERE email = 'linh.vo@example.edu'),
    (SELECT id FROM events WHERE title = 'English Debate Night'),
    'REGISTERED'
),
(
    (SELECT id FROM students WHERE email = 'an.nguyen@example.edu'),
    (SELECT id FROM events WHERE title = 'Public Speaking Bootcamp'),
    'REGISTERED'
),
(
    (SELECT id FROM students WHERE email = 'chi.le@example.edu'),
    (SELECT id FROM events WHERE title = 'Acoustic Music Night'),
    'ATTENDED'
),
(
    (SELECT id FROM students WHERE email = 'binh.tran@example.edu'),
    (SELECT id FROM events WHERE title = 'Acoustic Music Night'),
    'REGISTERED'
);
