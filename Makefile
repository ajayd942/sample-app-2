# Remote host — set via env var or ~/.ssh/config alias
# Usage: make remote-deploy REMOTE_HOST=user@your-server
REMOTE_HOST ?= opc@wedding-server

# Build the application JAR
build-jar:
	mvn clean install

# Build the Docker image
build:
	docker-compose build

# Rebuild only the frontend image (useful for npm dependency changes)
rebuild-frontend:
	docker-compose build --no-cache frontend

# Start the application stack (App, DB, Redis)
run:
	docker-compose up -d

# Stop the application stack
down:
	docker-compose down

# A clean command to stop containers and remove the data volume
clean: down
	docker volume rm sample-app-2_postgres_data || true
	rm -rf data/postgres

# Automates deploying locally built images exactly like they run locally, to the Oracle instance
remote-deploy: build
	@echo "Exporting images..."
	docker save sample-app-2-app sample-app-2-frontend | gzip > sample-app-images.tar.gz
	@echo "Transferring files..."
	rsync -avz -e "ssh -o StrictHostKeyChecking=no" sample-app-images.tar.gz docker-compose.yml data/postgres $(REMOTE_HOST):~/
	@echo "Deploying on remote instance..."
	ssh -o StrictHostKeyChecking=no $(REMOTE_HOST) 'docker load -i sample-app-images.tar.gz && docker-compose up -d && rm -f ~/sample-app-images.tar.gz && docker image prune -f'
	rm -f sample-app-images.tar.gz
	@echo "Done! Deployment complete and remote cleaned up."

.PHONY: build-jar build rebuild-frontend run down clean remote-deploy
