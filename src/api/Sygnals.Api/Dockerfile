FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore Sygnals.Api.csproj

RUN dotnet publish Sygnals.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
# Listen on 8080 (the .NET 8 container default) and keep memory low on small free-tier containers.
ENV ASPNETCORE_HTTP_PORTS=8080 \
    DOTNET_gcServer=0
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Sygnals.Api.dll"]
