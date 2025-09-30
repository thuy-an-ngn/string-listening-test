import json
import pandas as pd
import scipy.io
import librosa
import numpy as np

dataset = pd.read_pickle(
    "/home/hugo/Thèse/identification/data/processed/dataset_cnsm.pkl"
)
##
missing = dataset[
    (dataset.player == "SMD")
    & (dataset.condition == "non-aveugle")
    & (dataset.violin == "C")
    & (dataset.extract == "tchai")
    & (dataset.session == 2)
]
dataset = dataset[
    (dataset.session.isin([1, 2, 3]))
    # & (dataset.condition == "aveugle")
    & (dataset.player.isin(["Norimi", "SMD"]))
    # & (~dataset.extract.isin(["free", "?"]))
    & (dataset.extract.isin(["tchai"]))
].drop_duplicates(subset=["player", "violin", "extract", "session", "condition"])
dataset = pd.concat([dataset, missing], ignore_index=True)
dataset.rename(columns={"extract": "excerpt"}, inplace=True)
dataset["session"] = dataset["session"].apply(str)
dataset.loc[dataset.condition == "non-aveugle", "session"] += "na"

print(dataset)

for i, row in dataset.iterrows():
    offset = row["start"]
    offset -= 1
    duration = row["end"] - offset
    duration = 10
    audio, sr = librosa.load(
        str(row["file"]), sr=None, offset=offset, duration=duration, mono=False
    )
    scipy.io.wavfile.write(
        f"audio/{row.violin}-{row.player}-{row.session}.wav", sr, audio.T
    )

patterns = (
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
)

# tests = []
# for violin in ["A", "B", "C"]:
#     for player in ["Paul", "Clara", "SMD"]:
#         pattern = patterns[np.random.choice(4)]
#         tests.append(
#             (
#                 {"player": player, "violin": violin, "session": pattern[0]},
#                 {"player": player, "violin": violin, "session": pattern[1]},
#                 {"player": player, "violin": violin, "session": pattern[2]},
#             )
#         )
#         ref = f"{player}:{violin}:{pattern[0]}"
#         a = f"{player}:{violin}:{pattern[1]}"
#         b = f"{player}:{violin}:{pattern[2]}"
#         print(f"{ref}\t{a}\t{b}")
# with open("test.json", "w") as f:
#     json.dump(tests, f)


tests = []
for player in ["SMD", "Clara"]:
    for violin in ["A", "B", "C"]:
        tests.append(
            (
                {"player": player, "violin": violin, "session": 1},
                {"player": player, "violin": violin, "session": 2},
            )
        )
        tests.append(
            (
                {
                    "player": player,
                    "violin": violin,
                    "session": int(np.random.choice([1, 2])),
                },
                {"player": player, "violin": violin, "session": 3},
            )
        )

    for violin1, violin2 in [("A", "B"), ("C", "A")]:
        session = int(np.random.choice([1, 2, 3]))
        tests.append(
            (
                {"player": player, "violin": violin1, "session": session},
                {"player": player, "violin": violin2, "session": session},
            )
        )

    tests.append(
        (
            {"player": player, "violin": "A", "session": 1},
            {"player": player, "violin": "A", "session": 1},
        )
    )

tests.append(
    (
        {"player": "SMD", "violin": "A", "session": 1},
        {"player": "Clara", "violin": "A", "session": 1},
    )
)

# with open("test2.json", "w") as f:
#    json.dump(tests, f)
