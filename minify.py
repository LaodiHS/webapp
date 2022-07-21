import httpx 

 async with httpx.AsyncClient() as client:
        resp = await client.get('url')

        
async def make_request(client, url):
async def main():
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(make_request(client, url) for url in url_list))
        # do something with results