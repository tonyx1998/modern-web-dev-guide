.PHONY: setup dev build test verify

setup:
	mise install 2>/dev/null || true
	npm ci

dev:
	npm start

build:
	npm run build

test:
	npm run typecheck

verify:
	npm run validate-prereqs
	npm run typecheck
	npm run build
