# Undangan pernikahan — perintah singkat.  Ketik `make` untuk melihat daftar.
IMAGE ?= undangan-nikah-arif
NAME  ?= undangan-nikah-arif
PORT  ?= 8090

.DEFAULT_GOAL := help
.PHONY: help install dev build preview docker-build up down restart logs deploy clean

help: ## Tampilkan daftar perintah
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  \033[36mmake %-13s\033[0m %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: node_modules ## Install dependency npm

dev: node_modules ## Jalankan mode development (hot reload) di http://localhost:5173
	npm run dev

build: node_modules ## Build file statis ke folder dist/
	npm run build

preview: build ## Lihat hasil build di http://localhost:4173
	npm run preview

docker-build: ## Build image Docker
	docker build -t $(IMAGE) .

up: docker-build ## Jalankan container di http://localhost:8090 (ganti: PORT=3000)
	-@docker rm -f $(NAME) >/dev/null 2>&1
	docker run -d --name $(NAME) -p $(PORT):80 --restart unless-stopped $(IMAGE)
	@echo "✓ Buka http://localhost:$(PORT)/?to=Budi+Santoso"

down: ## Hentikan dan hapus container
	-docker rm -f $(NAME)

restart: down up ## Build ulang dan jalankan lagi

logs: ## Lihat log container
	docker logs -f $(NAME)

deploy: ## Update VM (git pull + docker compose) — push dulu ke GitHub
	./deploy/deploy.sh

clean: ## Hapus dist/ dan image Docker
	rm -rf dist
	-docker rmi $(IMAGE)
