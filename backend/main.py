from fastapi import *
from fastapi.middleware.cors import *
from .routers import users_router, cities_router

app = FastAPI(title="FastAPI Погода", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.options("/{full_path:path}")
async def options_handler():
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

app.include_router(users_router)
app.include_router(cities_router)

@app.get("/")
async def root():
    return {"message": "Добро пожаловать в API погоды!"}