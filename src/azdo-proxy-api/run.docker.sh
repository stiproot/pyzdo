#!/bin/sh

docker build -f Dockerfile -t img-pyzdo-azdo-proxy-api-$1 .

docker run -it --detach \
	--network pyzdo \
	--name pyzdo-azdo-proxy-api-$1 \
	-p 8000:80 \
	-p 8001:443 \
	-e ASPNETCORE_URLS="https://+;http://+" \
	-e ASPNETCORE_HTTPS_PORT=8001 \
	-e ASPNETCORE_ENVIRONMENT=Development \
	-e ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/aspnetcore-localhost-F49228DDFD1771875A1B6D9415EC27363D3DA105.pfx \
	-v ${HOME}/.aspnet/dev-certs/https/:/root/.aspnet/https/ \
	img-pyzdo-azdo-proxy-api-$1

# -p 8000:80 \
# -p 8001:443 \
# -e ASPNETCORE_URLS="https://+;http://+" \
# -e ASPNETCORE_HTTPS_PORT=8001 \
# -e ASPNETCORE_ENVIRONMENT=Development \
# -e ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/aspnetcore-localhost-F49228DDFD1771875A1B6D9415EC27363D3DA105.pfx \

##################

# -e ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/aspnetcore-localhost-F49228DDFD1771875A1B6D9415EC27363D3DA105.pfx \
# -e ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/azdo.proxy.api.pfx \
# -e ASPNETCORE_Kestrel__Certificates__Default__Path=/usr/local/share/ca-certificates/nscacert.pem \
# -p 5079:5079 \
# -e ASPNETCORE_Kestrel__Certificates__Default__Path=/usr/local/share/ca-certificates/aspnet.pfx \
# -e ASPNETCORE_Kestrel__Certificates__Default__Password=crypticpassword \
# -e ASPNETCORE_Kestrel__Certificates__Default__Path=/usr/local/share/ca-certificates/ \

# docker run --rm -it -p 8000:80 -p 8001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=8001 -e ASPNETCORE_ENVIRONMENT=Development -v ${HOME}/.microsoft/usersecrets/:/root/.microsoft/usersecrets -v ${HOME}/.aspnet/https:/root/.aspnet/https/ aspnetapp
