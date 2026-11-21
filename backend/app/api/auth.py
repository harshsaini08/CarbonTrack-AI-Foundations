from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == creds.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials or user not found"
        )
    # Check demo password
    expected = f"pbkdf2:{creds.password}"
    if user.hashed_password != expected and creds.password != "adminpassword" and creds.password != "demo":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    return {
        "access_token": f"token-{user.role}-{user.id}",
        "token_type": "bearer",
        "user": user
    }

@router.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/switch-role")
def switch_active_role(role: str, user_id: int = 1, db: Session = Depends(get_db)):
    valid_roles = ["admin", "sustainability_manager", "auditor"]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {valid_roles}")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).filter(User.role == role).first()
    if user:
        user.role = role
        db.commit()
        db.refresh(user)
        return {"status": "success", "active_role": role, "user": user}
    return {"status": "role changed", "active_role": role}
