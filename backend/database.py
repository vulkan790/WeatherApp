from sqlalchemy import *
from sqlalchemy.orm import *
from sqlalchemy.ext.asyncio import *

DATABASE_URL = "postgresql://postgres:xohm08r8TbtbA647@db.cuoyymbzzlobknuxfaof.supabase.co:5432/postgres"

async_engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(async_engine, expire_on_commit=False, class_=AsyncSession)

class Base(DeclarativeBase):
    pass