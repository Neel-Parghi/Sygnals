FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore Sygnals.Api.csproj

RUN dotnet publish Sygnals.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
EXPOSE 10000

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Sygnals.Api.dll"]
