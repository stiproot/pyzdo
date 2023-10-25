#FROM python:3.11-alpine as build
FROM python:3.11-slim-buster as build
WORKDIR /app
#RUN apk add make gcc g++ linux-headers libcrypto1.1 libssl1.1 libcouchbase libcouchbase-dev
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ .
EXPOSE 8000

# CMD ["sh", "-c", "nginx -g 'daemon off;' & uvicorn main:app --host 0.0.0.0 --port 8001"]
# CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port 8001"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
