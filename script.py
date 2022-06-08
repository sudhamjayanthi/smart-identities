from aifc import Error
import json

tokens = json.load(open("test.json"))

for i, token in enumerate(tokens):
    try: token.pop("extensions")
    except : pass

    token["id"] = i

json.dump(tokens, open("tokens.json", "w+"))