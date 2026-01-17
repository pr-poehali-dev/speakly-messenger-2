-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    avatar TEXT,
    banner TEXT,
    bio TEXT,
    verified BOOLEAN DEFAULT false,
    enot_coins INTEGER DEFAULT 0,
    balance_rub INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица чатов
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    is_group BOOLEAN DEFAULT false,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Участники чатов
CREATE TABLE IF NOT EXISTS chat_members (
    chat_id INTEGER REFERENCES chats(id),
    user_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (chat_id, user_id)
);

-- Сообщения
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id),
    sender_id INTEGER REFERENCES users(id),
    text TEXT,
    file_url TEXT,
    file_type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Звонки
CREATE TABLE IF NOT EXISTS calls (
    id SERIAL PRIMARY KEY,
    caller_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    is_video BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending',
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Транзакции кошелька
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(20) NOT NULL,
    amount INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_members_user_id ON chat_members(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_receiver_id ON calls(receiver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
