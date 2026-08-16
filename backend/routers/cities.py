from fastapi import *
from sqlalchemy.ext.asyncio import *
from sqlalchemy import *
from ..db_depends import get_async_db
from ..models.user import User as UserModel
from ..models.saved_city import SavedCity
from ..schemas import SavedCityCreate, SavedCityResponse
from ..auth import get_current_user

router = APIRouter(prefix="/cities", tags=["cities"])

@router.get("/", response_model=list[SavedCityResponse])
async def get_saved_cities(db: AsyncSession = Depends(get_async_db), current_user: UserModel = Depends(get_current_user)):
    result = await db.scalars(select(SavedCity).where(SavedCity.user_id == current_user.id, SavedCity.is_active == True))
    return result.all()

@router.post("/", response_model=SavedCityResponse, status_code=201)
async def create_city(city: SavedCityCreate, db: AsyncSession = Depends(get_async_db), current_user: UserModel = Depends(get_current_user)):
    existing = await db.scalars(select(SavedCity).where(SavedCity.user_id == current_user.id, SavedCity.city_name == city.city_name, SavedCity.is_active == True))
    if existing.first():
        raise HTTPException(status_code=409, detail="City already saved")
    db_city = SavedCity(user_id=current_user.id, city_name=city.city_name)
    db.add(db_city)
    await db.commit()
    await db.refresh(db_city)
    return db_city

@router.delete("/{city_id}", status_code=200)
async def delete_city(city_id: int, db: AsyncSession = Depends(get_async_db), current_user: UserModel = Depends(get_current_user)):
    city = await db.get(SavedCity, city_id)
    if not city or not city.is_active:
        raise HTTPException(status_code=404, detail="City not found or already deleted")
    if city.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own cities")
    city.is_active = False
    await db.commit()
    return {"message": "City deleted successfully"}