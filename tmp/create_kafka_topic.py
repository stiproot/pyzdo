import requests

url = "http://localhost:9021/2.0/kafka/MkU3OEVBNTcwNTJENDM2Qg/topics"
payload = {}
headers = {
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Cookie": "ui-auth-localhost%3A8091=11c196a366fe6c4bd038c7ca80ac5992",
    "Referer": "http://localhost:9021/clusters/MkU3OEVBNTcwNTJENDM2Qg/management/topics/topic_projectm_cmd_insights_gather/settings",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "X-Requested-By": "749fa0f5-5b44-41f4-9edf-cdad1085fb7c",
    "X-Requested-With": "undefined",
    "sec-ch-ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

topics = [
    "topic_projectm_cmd_insights_gather",
    "topic_projectm_cmd_insights_structure",
    "topic_projectm_cmd_persist",
]


async def create_topics():
    pass


if __name__ == "__main__":
    create_topics(topics)
