from pydantic import *

class SavedCityCreate(BaseModel):
    city_name: str = Field(min_length=1, max_length=100)

class SavedCityResponse(BaseModel):
    id: int
    user_id: int
    city_name: str

    model_config = {"from_attributes": True}

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=100)
    city: str | None = Field(None, max_length=100)

class UserUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    city: str | None = Field(None, max_length=100)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    city: str | None
    is_active: bool

    model_config = {"from_attributes": True}