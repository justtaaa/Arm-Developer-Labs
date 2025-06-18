import re
import os
import glob
from collections import OrderedDict
import itertools
import matplotlib.pyplot as plt

# Define a consistent color palette
PALETTE = ['#080225',  # deep navy
           '#7233F7',  # vivid purple
           '#0057FF',  # bright blue
           '#02EAEA',  # teal
           '#6F6F6F',  # medium gray
           '#F3F3F3']  # light gray

def get_latest_tally_file(directory):
    """
    Returns the path to the most recently modified tally file in the given directory.
    """
    pattern = os.path.join(directory, 'tally_*.txt')
    files = glob.glob(pattern)
    if not files:
        raise FileNotFoundError(f"No tally files found in {directory}")
    # Choose by modification time
    latest = max(files, key=os.path.getmtime)
    return latest


def read_tally(path):
    """
    Reads a tally file and returns an OrderedDict mapping each key
    to another OrderedDict of {value: count}, preserving the order.
    """
    tally = OrderedDict()
    current_key = None

    key_pattern = re.compile(r"^Key:\s*(.+)")
    entry_pattern = re.compile(r"^\s*'(.+)':\s*(\d+)")

    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            key_match = key_pattern.match(line)
            if key_match:
                current_key = key_match.group(1)
                tally[current_key] = OrderedDict()
                continue

            if current_key:
                ent_match = entry_pattern.match(line)
                if ent_match:
                    val, cnt = ent_match.groups()
                    tally[current_key][val] = int(cnt)

    return tally


def plot_tally(tally_data, figsize=(10, 6), rotate_xticks=45):
    """
    Given a tally_data dict from read_tally, creates plots for each key,
    using a shared color palette for both bar and pie charts.
    """
    # Keys to plot as pie charts instead of bar charts
    pie_keys = {'requires-team', 'sw-hw', 'support-level', 'status'}

    for key, counter in tally_data.items():
        labels = list(counter.keys())
        counts = list(counter.values())
        # Generate colors cycling through the palette
        colors = [PALETTE[i % len(PALETTE)] for i in range(len(labels))]

        plt.figure(figsize=figsize)
        if key in pie_keys:
            # Pie chart with palette
            plt.pie(counts,
                    labels=labels,
                    autopct='%1.1f%%',
                    startangle=140,
                    colors=colors)
            plt.title(key)
            plt.axis('equal')  # Equal aspect ratio ensures pie is drawn as a circle.
        else:
            # Bar chart with palette
            plt.bar(range(len(labels)), counts, color=colors)
            plt.title(key)
            plt.xticks(range(len(labels)), labels, rotation=rotate_xticks, ha='right')
            plt.ylabel('Count')
            plt.tight_layout()

        plt.show()


if __name__ == "__main__":
    # Automatically find and read the most recent tally file
    directory = "tally_outputs"
    latest_file = get_latest_tally_file(directory)
    print(f"Reading tally data from: {latest_file}")
    tally = read_tally(latest_file)
    plot_tally(tally)
