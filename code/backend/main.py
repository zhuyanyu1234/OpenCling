from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import asyncpg
import aioredis
import os

# 在文件开头添加
from dotenv import load_dotenv
load_dotenv()

# 修改配置类
class Settings(BaseModel):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    REDIS_URL: str = os.getenv("REDIS_URL")
    INVITATION_CODE: str = os.getenv("INVITATION_CODE")

settings = Settings()

# 数据库连接池
async def get_db():
    conn = await asyncpg.connect(settings.DATABASE_URL, timeout=30)
    try:
        yield conn
    finally:
        await conn.close()

# Redis连接


# 应用实例必须最先初始化
app = FastAPI()

# Redis连接池
redis_pool = None

async def create_redis_pool():
    global redis_pool
    redis_pool = await aioredis.create_redis_pool(settings.REDIS_URL)
    return redis_pool

@app.on_event("shutdown")
async def shutdown():
    if redis_pool:
        redis_pool.close()
        await redis_pool.wait_closed()

# 邀请码验证中间件
async def verify_invitation_code(redis: aioredis.Redis = Depends(create_redis_pool), invitation_code: str = Header(...)):
    if invitation_code != settings.INVITATION_CODE:
        raise HTTPException(status_code=403, detail="Invalid invitation code")
    return invitation_code

@app.on_event("startup")
async def startup():
    # 初始化数据库表
    conn = await asyncpg.connect(settings.DATABASE_URL)
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    ''')
    await conn.close()

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)