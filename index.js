const http = require('http');

const server = http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
    response.end("Initial index file of Yomium. Hello World! 건덕동의 오픈웹툰 플랫폼 요미움 개발 프로젝트");
});

const port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
