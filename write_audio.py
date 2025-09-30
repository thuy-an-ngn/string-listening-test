import os
import pandas as pd
import scipy.io
import librosa

dataset = pd.read_pickle(
    "/home/hugo/Thèse/identification/data/processed/dataset_cnsm.pkl"
)
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

if not os.path.exists("audio/raw"):
    os.makedirs("audio/raw")

for i, row in dataset.iterrows():
    offset = row["start"]
    offset -= 1

    duration = row["end"] - offset
    duration = 10

    audio, sr = librosa.load(
        str(row["file"]), sr=None, offset=offset, duration=duration, mono=False
    )
    scipy.io.wavfile.write(
        f"audio/raw/{row.violin}-{row.player}-{row.session}.wav", sr, audio.T
    )
