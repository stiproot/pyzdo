FROM python:3.11-slim-buster

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY ./tmp/pm_common-0.0.1.tar.gz /app/
RUN tar -xvf /app/*.tar.gz -C /app/. && \
  pip install /app/pm_common-0.0.1/.

COPY . /app/

CMD ["python", "azdo_proxy_worker.py"]
