#!/bin/sh

# dotnet dev-certs https -ep mandy.pfx -p crypticpassword

# dotnet dev-certs https -ep ${HOME}/.aspnet/dev-certs/https/azdo.proxy.api.pfx -p crypticpassword

# dotnet dev-certs https --trust

# 90538191-9fbe-45ac-991e-7b47f7fb5457

# dotnet build --id 90538191-9fbe-45ac-991e-7b47f7fb5457

dotnet user-secrets -p ./src/Azdo.Proxy.Api/Azdo.Proxy.Api.csproj set "Kestrel:Certificates:Development:Password" "crypticpassword"
