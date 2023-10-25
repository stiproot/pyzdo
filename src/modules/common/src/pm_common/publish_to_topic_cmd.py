from json import dumps as json_dumps


class PublishToTopicCmd:
    def __init__(
        self,
        topic: str,
        key: str,
        payload: dict,
    ):
        self.topic = topic
        self.key = key
        self.payload = payload

    def _to_dict_(self) -> dict:
        return {
            "topic": self.topic,
            "key": self.key,
            "payload": self.payload,
        }

    def _serialize_(self) -> str:
        return json_dumps(self._to_dict_())
