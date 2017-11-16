.PHONY: build
build:
	docker-compose build

.PHONY: run
run:
	docker-compose up

.PHONY: stop
stop:
	docker-compose stop

.PHONY: clean
clean:
	docker-compose rm -f -s -v