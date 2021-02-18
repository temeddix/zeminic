import heapq

V = int(input("vertices : "))
E = int(input("edges : "))

def makeGraph(v):
	Graph = []
	for i in range(v):
		Graph.append([])
	return Graph

def appendEdge(graph,v1,v2,w):
	graph[v1].append((w,v2))
	graph[v2].append((w,v1))

def findShortest(graph,start,infi=99999999):
	V = len(graph)
	Shortest = [infi]*V
	Candidates = []
	Determined = [False]*V
	Searched = [False]*V

	Focus = start

	heapq.heappush(Candidates,(0,Focus))

	while Candidates:

		print("Candidates")
		for w,v in Candidates:
			print(v)

		w,Focus = heapq.heappop(Candidates)

		if Determined[Focus]:
			print()
			print(Focus,"already determined.. continue")
			print()
			continue

		Determined[Focus] = True
		Shortest[Focus] = w
		print("Current Focus point",Focus)

		#현재 focus 정점과
		#직접적으로 연결되어 있으며
		#determined 되지 않은 정점들을
		#찾아서 거리 업데이트 해주고
		#후보로 추가
		directConnected = graph[Focus]
		for w,v in directConnected:
			if not Determined[v]:
				if Shortest[v] > Shortest[Focus]+w:
					print("updated",v,"as",Shortest[Focus]+w)
					Shortest[v] = Shortest[Focus]+w
					heapq.heappush(Candidates,(Shortest[v],v))
		
		print()
		

	return Shortest

Graph = makeGraph(V)

print("VERTEX1 VERTEX2 WEIGHT")
for i in range(E):
	print("Edge %d of %d"%(i+1,E))
	v1,v2,w = tuple(map(int,input().split()))
	appendEdge(Graph,v1,v2,w)

print("Graph")
for i in range(len(Graph)):
	print(i,Graph[i])

S = int(input("starting point : "))

Shortest = findShortest(Graph,S)

print("Shortest",Shortest)
