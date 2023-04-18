docker run --env=DB_HOST=<<host>> --env=DB_USERNAME=postgres --env=DB_PASSWORD=<<password>> --env=DB_PORT=5432 --env=DB_NAME=food --env=PORT=8080 --env=GOOGLE_MAPS_API_KEY=<<google-maps-api-key>> --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin --env=NODE_VERSION=18.15.0 --env=YARN_VERSION=1.22.19 --env=HOST=0.0.0.0 --workdir=/app --runtime=runc -d food-api:latest

