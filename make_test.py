import json
import numpy as np
from pprint import pprint

PLAYERS = ["SMD", "Norimi"]

tests = []
for player in PLAYERS:
    for violin in ["A", "B", "C"]:
        # Inter-Session variability : 1 vs 2
        tests.append(
            (
                {"player": player, "violin": violin, "session": 1},
                {"player": player, "violin": violin, "session": 2},
            )
        )

        # Inter-Session variability : before (1 or 2) vs after (3)
        # There should be no effect for violins B and C, but maybe an effect for violin A
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

    # Inter-violin variability : A vs B and C vs A
    for violin1, violin2 in [("A", "B"), ("C", "A")]:
        session = int(np.random.choice([1, 2, 3]))
        tests.append(
            (
                {"player": player, "violin": violin1, "session": session},
                {"player": player, "violin": violin2, "session": session},
            )
        )

    # Inter-Take variability : variability between two takes on the same day
    violin = np.random.choice(["A", "B", "C"])
    session = np.random.choice([1, 2, 3])
    tests.append(
        (
            {"player": player, "violin": f"{violin}", "session": f"{session}"},
            {"player": player, "violin": f"{violin}", "session": f"{session}na"},
        )
    )

# For PLAYER[0], we add a same excerpt comparison
# The distance should be minimal (X = Y)
tests.append(
    (
        {"player": PLAYERS[0], "violin": "A", "session": 1},
        {"player": PLAYERS[0], "violin": "A", "session": 1},
    )
)

# Inter-Player variability
tests.append(
    (
        {"player": PLAYERS[0], "violin": "A", "session": 1},
        {"player": PLAYERS[1], "violin": "A", "session": 1},
    )
)


pprint(tests)
print(len(tests))

# with open("test.json", "w") as f:
#     json.dump(tests, f)
