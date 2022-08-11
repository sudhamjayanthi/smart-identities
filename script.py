import json

tokens = [token for token in json.load(
    open("test.json")) if token["chainId"] == 10]

for i, token in enumerate(tokens):
    try:
        token.pop("extensions")
    except:
        pass

    token["id"] = i

json.dump(tokens, open("tokens.json", "w+"))
