from fastapi import *
from fastapi.middleware.cors import *
from .routers import users_router, cities_router
from .database import async_engine, Base
from .models import User, SavedCity

app = FastAPI(title="FastAPI Погода", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(cities_router)

@app.on_event("startup")
async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API погоды!"}