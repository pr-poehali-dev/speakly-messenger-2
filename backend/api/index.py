"""
API для работы с мессенджером Speakly
Обрабатывает запросы: регистрация, авторизация, чаты, сообщения, звонки
"""
import json
import os
import psycopg2
from datetime import datetime

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event, context):
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        if path == 'register':
            return register_user(event)
        elif path == 'login':
            return login_user(event)
        elif path == 'get_chats':
            return get_user_chats(event)
        elif path == 'get_messages':
            return get_chat_messages(event)
        elif path == 'send_message':
            return send_message(event)
        elif path == 'search_users':
            return search_users(event)
        elif path == 'create_chat':
            return create_chat(event)
        elif path == 'upload_file':
            return upload_file(event)
        else:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Action not found'}),
                'isBase64Encoded': False
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def register_user(event):
    data = json.loads(event.get('body', '{}'))
    phone = data.get('phone')
    name = data.get('name')
    username = data.get('username', f'user{phone[-4:]}')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO users (username, name, phone) VALUES (%s, %s, %s) RETURNING id, username, name, phone",
        (username, name, phone)
    )
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'id': user[0],
            'username': user[1],
            'name': user[2],
            'phone': user[3]
        }),
        'isBase64Encoded': False
    }

def login_user(event):
    data = json.loads(event.get('body', '{}'))
    phone = data.get('phone')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, username, name, phone, avatar, verified, enot_coins, balance_rub FROM users WHERE phone = %s",
        (phone,)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user:
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User not found'}),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'id': user[0],
            'username': user[1],
            'name': user[2],
            'phone': user[3],
            'avatar': user[4],
            'verified': user[5],
            'enotCoins': user[6],
            'balanceRub': user[7]
        }),
        'isBase64Encoded': False
    }

def get_user_chats(event):
    user_id = event.get('queryStringParameters', {}).get('user_id')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT DISTINCT c.id, c.name, c.is_group, c.avatar,
               (SELECT text FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
               (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_time
        FROM chats c
        JOIN chat_members cm ON c.id = cm.chat_id
        WHERE cm.user_id = %s
        ORDER BY last_time DESC
    """, (user_id,))
    
    chats = []
    for row in cur.fetchall():
        chats.append({
            'id': row[0],
            'name': row[1],
            'isGroup': row[2],
            'avatar': row[3],
            'lastMessage': row[4] or '',
            'time': row[5].strftime('%H:%M') if row[5] else '',
            'unread': 0
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(chats),
        'isBase64Encoded': False
    }

def get_chat_messages(event):
    chat_id = event.get('queryStringParameters', {}).get('chat_id')
    user_id = event.get('queryStringParameters', {}).get('user_id')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT m.id, m.text, m.file_url, m.file_type, m.created_at, m.sender_id, u.name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.chat_id = %s
        ORDER BY m.created_at ASC
    """, (chat_id,))
    
    messages = []
    for row in cur.fetchall():
        messages.append({
            'id': row[0],
            'text': row[1],
            'fileUrl': row[2],
            'fileType': row[3],
            'time': row[4].strftime('%H:%M'),
            'isMine': row[5] == int(user_id),
            'sender': row[6]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(messages),
        'isBase64Encoded': False
    }

def send_message(event):
    data = json.loads(event.get('body', '{}'))
    chat_id = data.get('chat_id')
    sender_id = data.get('sender_id')
    text = data.get('text')
    file_url = data.get('file_url')
    file_type = data.get('file_type')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO messages (chat_id, sender_id, text, file_url, file_type) VALUES (%s, %s, %s, %s, %s) RETURNING id, created_at",
        (chat_id, sender_id, text, file_url, file_type)
    )
    result = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'id': result[0],
            'time': result[1].strftime('%H:%M')
        }),
        'isBase64Encoded': False
    }

def search_users(event):
    query = event.get('queryStringParameters', {}).get('query', '')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, username, name, avatar FROM users WHERE username ILIKE %s OR name ILIKE %s LIMIT 20",
        (f'%{query}%', f'%{query}%')
    )
    
    users = []
    for row in cur.fetchall():
        users.append({
            'id': row[0],
            'username': row[1],
            'name': row[2],
            'avatar': row[3]
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(users),
        'isBase64Encoded': False
    }

def create_chat(event):
    data = json.loads(event.get('body', '{}'))
    user_id = data.get('user_id')
    target_user_id = data.get('target_user_id')
    is_group = data.get('is_group', False)
    name = data.get('name')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    cur.execute(
        "INSERT INTO chats (name, is_group) VALUES (%s, %s) RETURNING id",
        (name, is_group)
    )
    chat_id = cur.fetchone()[0]
    
    cur.execute(
        "INSERT INTO chat_members (chat_id, user_id) VALUES (%s, %s), (%s, %s)",
        (chat_id, user_id, chat_id, target_user_id)
    )
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'chat_id': chat_id}),
        'isBase64Encoded': False
    }

def upload_file(event):
    import boto3
    import base64
    
    data = json.loads(event.get('body', '{}'))
    file_data = data.get('file')
    file_name = data.get('file_name')
    file_type = data.get('file_type')
    
    file_bytes = base64.b64decode(file_data)
    
    s3 = boto3.client('s3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    
    key = f'speakly/{file_name}'
    s3.put_object(Bucket='files', Key=key, Body=file_bytes, ContentType=file_type)
    
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': cdn_url}),
        'isBase64Encoded': False
    }
