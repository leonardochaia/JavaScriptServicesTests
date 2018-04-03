FROM microsoft/aspnetcore-build:2.0 AS build

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD ./app/ClientApp/package.json /code/ClientApp/package.json
RUN cd /code/ClientApp && npm install

WORKDIR /code

ADD ./app/ .

RUN dotnet restore

RUN dotnet publish --output /output --configuration Release

FROM microsoft/aspnetcore:2.0

ENV NODE_VERSION 6.11.3
ENV NODE_DOWNLOAD_URL https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz
ENV NODE_DOWNLOAD_SHA 610705D45EB2846A9E10690678A078D9159E5F941487ACA20C6F53B33104358C

RUN curl -SL "$NODE_DOWNLOAD_URL" --output nodejs.tar.gz \
    && echo "$NODE_DOWNLOAD_SHA nodejs.tar.gz" | sha256sum -c - \
    && tar -xzf "nodejs.tar.gz" -C /usr/local --strip-components=1 \
    && rm nodejs.tar.gz \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

COPY --from=build /output /app

WORKDIR /app

#ENV ASPNETCORE_URLS http://+:5000

ENTRYPOINT [ "dotnet", "ssr.dll" ]