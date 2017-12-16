# MergeSort
def mergesort(a, p, r):
    if p < r:
        q = floor((p + r)/2)
        a = mergesort(a, p, q)
        b = mergesort(a, q+1, r)
        merge(a, p, q, r)

def merge(a, p, q, r):
    n1 = q - p + 1
    n2 = r - q
    l[1 : n1] = a[p : p + n1 - 1]
    r[1 : n2] = a[q+1 : q + n2]
    l[n1 + 1] = infinity (sentinel)
    r[n2 + 1] = infinity (sentinel)
    i = 1
    j = 1
    for k = p to r do
    	if (l[k] <= r[j]):
    		a[k] = l[i++]
    	else
    		a[k] = r[j++]


# Divide and Conquer Meta Logic
if (P is small):
	solve P directly
else:
	split P into subproblems P1, ... , Pn
	combine P1, ..., Pn into P solution


# Longest Path In Tree
def MaxTreePath(T, x): # x is root of tree T
	# C reps longest path in T
	# R reps longest path in T ending at x
	if (T single node)
		C = [x]
		R = [x]
	else
		T1, ... , Tk are subtrees attached to x
		new roots x1, ... , xk attached to x
		for i = 1 to k
			Cs[i], Rs[i] = MaxTreePath(Ti, xi)

		R = concatenate(longest(Rs[i]), x)
		LongestSubtreePath = longest(Cs[i])
		LongestSubtreePathThroughX = 
			concatenate(R, secondLongest(Rs[i]))

		C = longest(LongestSubtreePath, 
			LongestSubtreePathThroughX)


# Closest Pair of Points
def ClosestPair():
	xlist = points sorted by x-coords
	ylist = points sorted by y-coords

	split current points by xlist
	(alternate to ylist every call)

	dl = ClosestPair(left_half)
	dr = ClosestPair(right_half)
	d = min(dl, dr)

	look at 2d x d box surrounding boundary
	d0 = ClosestPair(2d x d box)

	return min(d, d0)

# Kruskal Minimum Spanning Tree
def mstKruskal(G):
	A = [] # to hold result
	for every vertex v in G:
		create a single-vertex graph of v

	sort edges by weigth ascending

	for every edge (u, v) in G:
		# if keeping edge doesn't cause a cycle
		if (findset(u) != findset(v)):
			# add the edge to results
			A.append([u,v])
			# merge trees
			union(u, v)

# Longest common subsequence
def LCS(X, Y, m, n):
	# (m+1) x (n+1) matrix, where L[i][j] holds
	# length of lcs between X[0 ... i], Y[0 ... j]
	L[m+1][n+1];
	for i = 0 to m
		for j = 0 to n
			if (i == 0 || j == 0):
				L[i][j] = 0
			else if (X[i-1] == Y[j-1]):
	        	L[i][j] = L[i-1][j-1] + 1
	        else:
	         	L[i][j] = max(L[i-1][j], L[i][j-1])
	return L[m][n]


# Rod Cutting (Bottom Up)
def bottomUpCutRod(p,n):
	r[0] = 0
	for j = 1 to n
	    q = -infinity
	    for i = 1 to j
	        q = max(q, p[i] + r[j-1])
	    r[j] = q
	return r[n]

# Rod Cutting top down
def memoCutRod(p,n)
	for i = 0 to n
	    r[i] = -infinity
    return memoaux(p,n,r)

def memoaux(p,n,r):
    if r[n] >= 0
        return r[n]
    if n == 0 
        return 0
    else
        q = -infinity
        for i = 1 to n
            q = max(q, p[i] + memoaux(p, n-i, r))
	r[n] = q
	return q

# Dijkstra's algorithm
def dijstra(G):
	R = []  # R reps {reached vertices}      
	C = [a] # C reps {candidate vertices}, a reps start
	B = []  # vector containing weights of path from a to v[i]
	    
	choose c with lowest B value
	append c to R

	for each neighbour d of c that isn't in R
	    calculate weight of path ac + weight(c,d)
	    if path ac < B[d]
	        B[d] = ac

# Minimum Cost Path
def minCost(weights):
	mv[][] # memoization m x n matrix
	# stores lowest weight path to (i, j)
	l[][] # stores pointer to neighbour
	# that lowest path came from

	initialize mv[0][0] to 0
	initialize the rest of mv to -infinity
	initialize l[] to -1s

	return minCostAux(weights, m, n)

def minCostAux(weights, i, j):
	if (mv[i][j] >= 0):
		return mv[i][j]

	cost1 = minCostAux(weights, i, j-1) 
		+ weights[(i, j-1) --> (i, j)]
	cost2 = minCostAux(weights, i-1, j) 
		+ weights[(i-1, j) --> (i, j)]
	mv[i][j] = min(cost1, cost2)

	if (cost1 > cost2):
		l[i][j] = 1
	else:
		l[i][j] = 0
	return mv[i][j]

def minCoins(n):
	C = [c1, c2, __, ck] # available coin amounts
	solutions = [] # initialize to -infinities
	for ci in C:
		solutions[ci] = 1
	if solution[n] > 0:
	    return solution[n]
	else if (n < 0):
		return infinity
	else:
	    min_1 = 1 + mincoins(n-c1)
	    ...
		min_k = 1 + mincoins(n-ck)
	    solution[n] = min(min_1, ... , min_k)
	return solution[n]

# Prim's algorithm for mst
def mst_prim(G, w, r):
	for each edge u
		u.key = infinity
		u.parent = null
	r.key = 0
	Q = [V]  # candidates for adding in
	while Q != empty
		u = extractfromMinHeap(Q)
		for each v adjacent to u
			if v is element of Q && weight(u,v) < u.key
			v.parent = u
			v.key = weight(u,v)
			end


def seamCarving(g):
	p[0,__,n][0,__,m] # bit matrix with each i,j
	# entry flagged for whether a path exists
	# from node i,j to the left side
	# white = 1, black = 0, stored in g[i][j]
	for i = 0 to n
	    for j = 1 to m
	        p[i][j] = 0
	    p[i][0] = g[i][0]

	for i = 0 to n
		if (find_paths_aux(g, i, m-1) == 1):
			return True
	return False

def seamCarving(g, i, j):
	if (p[i][j] == 1):
	    return 1
	else if (g[i][j] == 0):
	    return 0

	n1 = find_paths_aux(g, i+1, j+1)
	n2 = find_paths_aux(g, i+1, j)
	n3 = find_paths_aux(g, i+1, j-1)
	p[i][j] = max(0, n1, n2, n3)

	% path exists if any column m bits = 1 
	% complexity = O(nm)


















	
