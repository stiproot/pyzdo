from environs import Env
from typing import Optional


class EnvVarProvider:
    def __init__(self):
        self._env = Env()
        self._env.read_env(".env")

    def get_env_var(self, name: str, default: Optional[str] = "") -> str:
        var = self._env(name)
        if var is None or var == "":
            return default
        return var
