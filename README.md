# 제미넴 - 오픈 웹툰 플랫폼

## 참여자
* 김동현
* 박건규
* 정덕

## 가장 중요한 명령어들
개발(Development)을 위해 변동사항을 감지하는 자동(Hot-reload) 컴파일 켜기
```
npm run serve
```
배포(Production)를 위해 용량을 최소화하여(Minify) 컴파일하기
```
npm run build
```
콘솔이 싫다면? 화면으로 뷰(Vue)와 웹팩(Webpack)을 제어하기
```
vue ui
```
백엔드 서버를 테스트 용도로 내 컴퓨터에서 직접 돌려보고 싶다면?
```
npx pm2 start server.js
```