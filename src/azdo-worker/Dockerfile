FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY ./tmp/pyzdo_core-0.0.1.tar.gz /app/
RUN tar -xvf /app/*.tar.gz -C /app/. && \
  pip install /app/pyzdo_core-0.0.1/.

COPY . /app/

CMD ["python", "azdo_worker.py"]
