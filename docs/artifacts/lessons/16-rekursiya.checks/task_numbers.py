import sys
from functools import lru_cache
from fractions import Fraction
sys.setrecursionlimit(50000)
# N1 digits: F(n)=n (n<10); F(n)=n%10+3*F(n//10), find F(2057)
@lru_cache(None)
def N1(n): return n if n<10 else n%10+3*N1(n//10)
d=[int(c) for c in '2057']; v=d[0]
for x in d[1:]: v=3*v+x
# second method: Horner-like? F(n)=last digit +3*F(rest) => digits weights 1,3,9,27 from right
w=sum(int(c)*3**i for i,c in enumerate(reversed('2057')))
print('N1',N1(2057),w)
# N3 branching: F(1)=3; even: 2*F(n/2); odd>1: F(n-1)+1 ; find F(19)
@lru_cache(None)
def N3(n):
    if n==1: return 3
    return 2*N3(n//2) if n%2==0 else N3(n-1)+1
def N3b(n):
    # iterative table
    t={1:3}
    for k in range(2,n+1): t[k]=2*t[k//2] if k%2==0 else t[k-1]+1
    return t[n]
print('N3',N3(19),N3b(19),[N3(k) for k in range(1,20)])
# N6 count n in 1..400 with N3(n)==k
import collections
c=collections.Counter(N3(n) for n in range(1,401)); print('N6 counts',sorted(c.items())[:40])
# N4 upward
@lru_cache(None)
def N4(n): return 5 if n>=3000 else N4(n+2)+3
for n in range(3001,1400,-1): N4(n)
print('N4',N4(1500), 5+3*((3000-1500)//2), N4(1500)-N4(1496))
# N5 two functions F(1)=1,G(1)=2; F(n)=G(n-1)+2; G(n)=F(n-1)+n ; F(8)
@lru_cache(None)
def F5(n): return 1 if n==1 else G5(n-1)+2
@lru_cache(None)
def G5(n): return 2 if n==1 else F5(n-1)+n
t={1:(1,2)}
for n in range(2,9):
    f=t[n-1][1]+2; g=t[n-1][0]+n; t[n]=(f,g)
print('N5',F5(8),t[8],[t[n] for n in range(1,9)])
# N7 diff F(n)=F(n-1)+3n-1 ; F(2000)-F(1996)
print('N7',sum(3*k-1 for k in range(1997,2001)), 3*(2000+1999+1998+1997)-4)
@lru_cache(None)
def N7(n): return 4 if n==1 else N7(n-1)+3*n-1
for n in range(1,2001): N7(n)
print('N7 prog',N7(2000)-N7(1996))
# N8 nonclean: F(1)=1; F(n)=n*F(n-1)+1 ; floor(F(100)/F(97))
@lru_cache(None)
def N8(n): return 1 if n==1 else n*N8(n-1)+1
for n in range(1,101): N8(n)
r=Fraction(N8(100),N8(97)); print('N8',r.numerator//r.denominator, 100*99*98, float(r-100*99*98))
# N9 template: F(n)=3 n<=2; even n>2: F(n-1)+F(n-2)-n ; odd n>2: F(n-2)+2n ; F(40)
@lru_cache(None)
def N9(n):
    if n<=2: return 3
    if n%2==0: return N9(n-1)+N9(n-2)-n
    return N9(n-2)+2*n
t={1:3,2:3}
for n in range(3,41): t[n]=t[n-1]+t[n-2]-n if n%2==0 else t[n-2]+2*n
print('N9',N9(40),t[40],[N9(n) for n in range(1,9)])
print('9/3',9/3)
