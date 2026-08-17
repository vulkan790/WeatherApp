from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users_router, cities_router

app = FastAPI(title="FastAPI Погода", version="0.1.0")

origins = [
    "https://weather-app-mu-nine-21.vercel.app",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(cities_router)

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API погоды!"}