.PHONY: run clean

run:
	python3 -m venv .venv && \
	. .venv/bin/activate && \
	pip install -r requirements.txt && \

graphs:
	python3 -m venv .venv && \
	. .venv/bin/activate && \
	pip install -r requirements.txt && \
	python3 create_graphs.py

stats:
	python3 -m venv .venv && \
	. .venv/bin/activate && \
	pip install -r requirements.txt && \
	python3 generate_stats.py