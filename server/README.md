# Docker Notes
- docker run -d \
    --name test-mysql \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=readstore \
    -e MYSQL_USER=web \
    -e MYSQL_PASSWORD=rootpassword \
    -p 3306:3306 \
    mysql:latest
- docker exec -it test-mysql mysql -u root -p
