FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine as restore-build-publish

WORKDIR /src

COPY ./src/azdo_proxy_api/. .

RUN dotnet restore .

RUN dotnet publish . --no-restore --configuration Release --output /publish

from mcr.microsoft.com/dotnet/aspnet:7.0 as final

RUN mkdir /app

WORKDIR /app

COPY --from=restore-build-publish /publish /app

USER $APP_UID

ENTRYPOINT ["dotnet", "./azdo_proxy_api.dll"]
