from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints import cmd, qry

app = FastAPI()

# origins = [
#     "http://localhost",
#     "http://localhost:3000",
#     "http://localhost:8000",
# ]

app.add_middleware(
    CORSMiddleware,
    # allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cmd.router, prefix="/cb")
app.include_router(qry.router, prefix="/cb")
