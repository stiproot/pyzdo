def get_nested_property(data, keys, delimiter=".", default=None):
    keys = keys.split(delimiter)
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return default
    return data
