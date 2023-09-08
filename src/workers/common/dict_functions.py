def get_nested_property(data, keys, delimiter=".", default=None):
    keys = keys.split(delimiter)
    for key in keys:
        print("get_nested_property", "key: ", key)
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            print("get_nested_property", "key: ", key, "defaulting to: ", default)
            return default
    return data
