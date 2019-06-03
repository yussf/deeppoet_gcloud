from starlette.applications import Starlette
from starlette.responses import HTMLResponse, PlainTextResponse
from starlette.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
import uvicorn, aiohttp, asyncio, re, sys
from io import BytesIO
from poem import *

path = Path(__file__).parent

app = Starlette()
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_headers=['X-Requested-With', 'Content-Type'])

if __name__ == '__main__':
    if 'serve' in sys.argv: app.mount('/static', StaticFiles(directory='app/static'))
    if 'test' in sys.argv: app.mount('/static', StaticFiles(directory='./static'))


@app.route('/getpoem')
def index(request):
    init = request.query_params['init']
    poem = write_poem(init)
    return PlainTextResponse(poem)

@app.route('/getWordsList')
def index(request):
    return PlainTextResponse(open("words").read())
    
@app.route('/')
def index(request):
    html = path/'view/index.html'
    return HTMLResponse(open(html).read())

if __name__ == '__main__':
    if 'serve' in sys.argv: uvicorn.run(app, host='0.0.0.0', port=8080)
    if 'test' in sys.argv: uvicorn.run(app, host='localhost', port=3000)

