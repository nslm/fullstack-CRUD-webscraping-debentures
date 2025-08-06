from fastapi import APIRouter

router = APIRouter()

@router.post("/api/debentures")
def add_debenture():
    pass

@router.get("/api/debentures")
def all_debentures():
    pass

@router.put("/api/debentures")
def update_debenture():
    pass

@router.delete("/api/debentures")
def delete_debenture():
    pass
