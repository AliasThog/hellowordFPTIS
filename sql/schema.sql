CREATE TABLE students (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    student_code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clubs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    club_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_events_club
        FOREIGN KEY (club_id)
        REFERENCES clubs(id),

    CONSTRAINT chk_events_capacity_positive
        CHECK (capacity>0)
);

CREATE TABLE event_registrations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    registration_status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_registrations_student
        FOREIGN KEY (student_id)
        REFERENCES students(id),

    CONSTRAINT fk_event_registrations_event
        FOREIGN KEY (event_id)
        REFERENCES events(id),

    CONSTRAINT chk_event_registrations_status
        CHECK (registration_status IN ('REGISTERED', 'CANCELLED', 'ATTENDED')),

    CONSTRAINT uq_event_registrations_student_event
        UNIQUE (student_id, event_id)
);

