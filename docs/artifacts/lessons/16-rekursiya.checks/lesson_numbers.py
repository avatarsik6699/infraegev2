import sys
from functools import lru_cache
from fractions import Fraction
sys.setrecursionlimit(100000)

# S1
def F1(n): return 1 if n==1 else 2*F1(n-1)+1
print('S1 F(5)=',F1(5))
# S3 trace F(4)
out=[]
def F(n):
    out.append(f"вызов {n}")
    if n==1:
        out.append(f"база {n}"); return 1
    r=2*F(n-1)+1
    out.append(f"возврат {n} -> {r}")
    return r
F(4); print('S3 trace:',out)
# repeated calls of F(3) with F(1)=F(2)=1
def count3(n):
    c=[0]
    def f(k):
        if k==3: c[0]+=1
        return 1 if k<=2 else f(k-1)+f(k-2)
    v=f(n); return v,c[0]
for n in (10,15,20,25): print('F(3) calls for F(%d):'%n,count3(n))
# total calls formula
def calls(n): return 1 if n<=2 else 1+calls(n-1)+calls(n-2)
@lru_cache(None)
def fib(n): return 1 if n<=2 else fib(n-1)+fib(n-2)
for n in (20,30,40): print('total calls F(%d)='%n, 2*fib(n)-1, 'fib',fib(n))
# S4 two prev: F(1)=2,F(2)=3 -> F(6)
a,b=2,3
for n in range(3,7): a,b=b,a+b
print('S4 F(6)=',b)
# tribonacci 1,1,2 -> T(7)
t=[1,1,2]
while len(t)<9: t.append(sum(t[-3:]))
print('trib',t)
# S6 loop: F(1)=2, F(n)=3F(n-1)-1
f=2; seq=[f]
for n in range(2,6): f=3*f-1; seq.append(f)
print('S6 seq',seq)
# S7 branching
@lru_cache(None)
def B(n):
    if n==1: return 1
    if n%2==0: return B(n//2)+3
    return B(n-1)+1
print('S7 B(21)=',B(21),[ (n,B(n)) for n in (1,2,4,5,10,20,21)])
# S8 digits
@lru_cache(None)
def D(n): return n if n<10 else n%10+2*D(n//10)
print('S8 D(472)=',D(472),'D(10**30)',D(10**30), 10**30/10, int(10**30/10)==10**29)
# S9 upward
@lru_cache(None)
def U(n): return 7 if n>=4200 else U(n+4)+2
for n in range(4203,95,-1): U(n)
print('S9 U(100)=',U(100),'U(96)=',U(96),'diff',U(100)-U(96))
# depth check default recursion
sys.setrecursionlimit(1000)
@lru_cache(None)
def U2(n): return 7 if n>=4200 else U2(n+4)+2
try: U2(100)
except RecursionError: print('S9 default limit -> RecursionError')
sys.setrecursionlimit(100000)
# S10 two functions
@lru_cache(None)
def FF(n): return 1 if n<=2 else FF(n-1)+GG(n-2)
@lru_cache(None)
def GG(n): return 2 if n<=2 else GG(n-1)+FF(n-1)
print('S10',[(n,FF(n),GG(n)) for n in range(1,9)], 'F(10)=',FF(10),'G(10)=',GG(10))
# S11 count
cnt=sum(1 for n in range(1,201) if B(n)==13); print('S11 count n<=200 with B(n)=13:',cnt,[n for n in range(1,201) if B(n)==13])
print('S11 values 1..12',[B(n) for n in range(1,13)])
# S12 ratio
print('S12 ratio F100/F98',100*99)
# difference F(n)=F(n-1)+2n+3, F(1)=5
@lru_cache(None)
def Df(n): return 5 if n==1 else Df(n-1)+2*n+3
for n in range(1,1001): Df(n)
print('S12 diff F(1000)-F(997)=',Df(1000)-Df(997), 2003+2001+1999)
# non-clean ratio F(n)=n F(n-1)-1, F(1)=1
@lru_cache(None)
def NC(n): return 1 if n==1 else n*NC(n-1)-1
for n in range(1,201): NC(n)
r=Fraction(NC(200),NC(197)); print('S12 nonclean floor',r.numerator//r.denominator, 200*199*198, 'frac deficit', float(200*199*198-r))
# S12 bigger: 200*199 + 200 +1
print('deficit numerator', 200*199+200+1)
