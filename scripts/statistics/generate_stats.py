#!/usr/bin/env python3
import os
import sys
import yaml
from collections import defaultdict, Counter
from datetime import date

# Directories containing project markdown files
PROJECT_DIRS = [
    '../../Projects/Projects',
    '../../Projects/Extended-Team-Projects'
]

# Timestamped output directory (optional customization)
OUTPUT_DIR = 'tally_outputs'

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_front_matter(path):
    """
    Reads the file at `path` and returns its front-matter as a dict,
    or None if no valid front-matter is found.
    """
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    if len(lines) < 3 or not lines[0].strip() == '---':
        return None

    # find the closing '---'
    for idx, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            end = idx
            break
    else:
        return None

    yaml_block = ''.join(lines[1:end])
    try:
        data = yaml.safe_load(yaml_block)
        if isinstance(data, dict):
            return data
    except yaml.YAMLError:
        pass
    return None


def tally_front_matter(directories):
    """
    Walks each directory in `directories`, finds .md files,
    extracts front-matter, and tallies values for each key,
    excluding 'title'.
    """
    tally = defaultdict(Counter)

    for directory in directories:
        if not os.path.isdir(directory):
            print(f"Warning: '{directory}' is not a valid directory, skipping.")
            continue

        for root, _, files in os.walk(directory):
            for fname in files:
                if fname.lower().endswith('.md'):
                    path = os.path.join(root, fname)
                    fm = extract_front_matter(path)
                    if fm:
                        for key, val in fm.items():
                            # Skip the 'title' key
                            if key == 'title':
                                continue
                            # Normalize lists vs scalars
                            if isinstance(val, list):
                                for v in val:
                                    tally[key][str(v)] += 1
                            else:
                                tally[key][str(val)] += 1
    return tally


def output_tally(tally, output_path):
    """
    Writes the tally to a file at `output_path`.
    """
    with open(output_path, 'w', encoding='utf-8') as f:
        for key, counter in tally.items():
            f.write(f"Key: {key}\n")
            for val, count in counter.most_common():
                f.write(f"  {val!r}: {count}\n")
            f.write("\n")


if __name__ == '__main__':
    # Use the specified project directories
    directories = PROJECT_DIRS

    # Generate today's date string
    today_str = date.today().strftime('%Y-%m-%d')
    # Construct output filename
    output_filename = f"tally_{today_str}.txt"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Compute and write tally
    tally = tally_front_matter(directories)
    output_tally(tally, output_path)

    print(f"Tally written to {output_path}")
