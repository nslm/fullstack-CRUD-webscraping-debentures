import os
from dotenv import load_dotenv



def load_config(env: str = "dev"):
    base_dir = os.path.dirname(__file__)
    
    if env == "test":
        env_path = os.path.join(base_dir, "..", "tests", ".env.test")
    else:
        env_path = os.path.join(base_dir, "..", "..", ".env.dev")

    load_dotenv(env_path)

    return {
        "POSTGRES_HOST": os.getenv("POSTGRES_HOST"),
        "POSTGRES_PORT": os.getenv("POSTGRES_PORT"),
        "POSTGRES_DB": os.getenv("POSTGRES_DB"),
        "POSTGRES_USER": os.getenv("POSTGRES_USER"),
        "POSTGRES_PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "FRONTEND_ORIGIN": os.getenv("FRONTEND_ORIGIN"),
    }

