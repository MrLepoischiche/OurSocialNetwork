CREATE TABLE groups (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    creator_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(creator_id) REFERENCES users(id)
);

CREATE TABLE group_members (
    group_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    status TEXT CHECK(status IN ('invited', 'requested', 'accepted')) NOT NULL,
    PRIMARY KEY(group_id, user_id),
    FOREIGN KEY(group_id) REFERENCES groups(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE group_events (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    event_time TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(group_id) REFERENCES groups(id),
    FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE event_rsvps (
    event_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    response TEXT CHECK(response IN ('going', 'not_going')) NOT NULL,
    PRIMARY KEY (event_id, user_id),
    FOREIGN KEY(event_id) REFERENCES group_events(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
