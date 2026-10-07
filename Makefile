# Undangan pernikahan — perintah singkat.  Ketik `make` untuk melihat daftar.
IMAGE ?= undangan-nikah-arif
NAME  ?= undangan-nikah-arif
PORT  ?= 8090

.DEFAULT_GOAL := help
.PHONY: help install dev build preview docker-build up down restart logs backup deploy clean

help: ## Tampilkan daftar perintah
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  \033[36mmake %-13s\033[0m %s\n", $$1, $$2}'

node_modules: package.json package-lock.json
	npm install
	@touch node_modules

install: node_modules ## Install dependency npm

dev: node_modules ## Development (hot reload + API ucapan) di http://localhost:5173
	@trap 'kill 0' INT TERM EXIT; \
	DATA_DIR=./data node server/index.js & \
	npm run dev

build: node_modules ## Build file statis ke folder dist/
	npm run build

preview: build ## Lihat hasil build (+ API) di http://localhost:3000
	DATA_DIR=./data STATIC_DIR=./dist node server/index.js

docker-build: ## Build image Docker
	docker build -t $(IMAGE) .

up: docker-build ## Jalankan container di http://localhost:8090 (ganti: PORT=3000)
	-@docker rm -f $(NAME) >/dev/null 2>&1
	docker run -d --name $(NAME) -p $(PORT):3000 -v $(NAME)-data:/data --restart unless-stopped $(IMAGE)
	@echo "✓ Buka http://localhost:$(PORT)/?to=Budi+Santoso"

down: ## Hentikan dan hapus container
	-docker rm -f $(NAME)

restart: down up ## Build ulang dan jalankan lagi

logs: ## Lihat log container
	docker logs -f $(NAME)

backup: ## Unduh ucapan & RSVP dari VM ke backup/wishes-<tanggal>.json
	@mkdir -p backup
	ssh -p 20262 root@103.147.32.28 'docker exec undangan-arif cat /data/wishes.json' > backup/wishes-$$(date +%Y%m%d-%H%M).json
	@ls -1t backup | head -1

deploy: ## Update VM (git pull + docker compose) — push dulu ke GitHub
	./deploy/deploy.sh

clean: ## Hapus dist/ dan image Docker
	rm -rf dist
	-docker rmi $(IMAGE)
