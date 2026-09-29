import json,re,sys,ast,threading
from fractions import Fraction
from functools import lru_cache
sys.setrecursionlimit(10**6)
threading.stack_size(512*1024*1024)
rows=json.load(open(sys.argv[1]))
def norm(s):
    import unicodedata
    s=unicodedata.normalize('NFC',s)
    s=re.sub(r'(?<=\d)\s(?=\d{3}\b)','',s)
    s=s.replace('⋅','*').replace('∙','*').replace('х','*') if False else s.replace('⋅','*').replace('∙','*')
    s=s.replace('×','*').replace('·','*').replace('−','-').replace('–','-').replace('—','-')
    s=s.replace('≤','<=').replace('≥','>=').replace('≠','!=').replace('\\%','%').replace('\\','')
    s=s.replace(' ',' ').replace('^','**')
    return s
def implicit(e):
    e=re.sub(r'(?<![A-Za-z0-9_])(\d+)\s*([nFGf(])',r'\1*\2',e)
    e=re.sub(r'\)\s*(?=[\(nFGf\d])',')*',e)
    e=re.sub(r'(?<=\d)\s+(?=\d)','',e)
    return e
def cond_py(c):
    c=c.strip().rstrip('.;,')
    c=re.sub(r'(?<=\d)\s+(?=\d{3}\b)','',c)
    c=re.sub(r'\b(не\s*чётн|нечётн|нечетн)\w*','PAR1',c)
    c=re.sub(r'\b(чётн|четн)\w*','PAR0',c)
    c=re.sub(r'\b(значени\w+|числ\w+|при этом|для)\b','',c)
    c=re.sub(r'\bи\b',' and ',c)
    c=re.sub(r'\b(не\s*)?(чётное|нечётное|четное|нечетное)\b',lambda m:'n%2==1' if m.group(0).startswith(('не','нечет','нечёт')) else 'n%2==0',c)
    c=re.sub(r'\bили\b',' or ',c)
    c=re.sub(r'\b(при|если|когда)\b','',c)
    c=c.replace('PAR0','n%2==0').replace('PAR1','n%2==1')
    c=re.sub(r'(n%2==\d)\s+(?=n\s*[<>=!])',r'\1 and ',c)
    c=re.sub(r'(?<=[\d)])\s+(?=n%2==)',' and ',c)
    c=re.sub(r'\s+n\s*$','',c)
    c=re.sub(r'n\s+(?=n%2==)','',c)
    c=re.sub(r'(?<![<>=!])=(?!=)','==',c)
    c=re.sub(r'\b(and|or)\s+(and|or)\b',r'\1',c)
    c=re.sub(r'^\s*(and|or)\s+','',c); c=re.sub(r'\s+(and|or)\s*$','',c)
    c=re.sub(r'(?<![A-Za-z])n\s+n%2','n%2',c)
    return c.strip()
def parse(text):
    defs=[]  # (fn, cond, expr)
    for line in text.split('\n'):
        l=norm(line).strip()
        m=re.match(r'^(?:\(.*?\)\s*)?([FGf])\(n\)\s*=\s*(?:([FGf])\(n\)\s*=\s*)?(.*)$',l)
        if not m: continue
        fn=m.group(1).upper(); rest=m.group(3)
        fns=[fn]+([m.group(2).upper()] if m.group(2) else [])
        mm=re.match(r'^(.*?)[,;]?\s*\b(при|если|когда)\b\s*(.*)$',rest)
        if mm: expr,cond=mm.group(1),mm.group(3)
        else:
            mm=re.match(r'^(.*?),\s*(n\s*[<>=].*)$',rest)
            if mm: expr,cond=mm.group(1),mm.group(2)
            else: expr,cond=rest,'True'
        expr=expr.strip().rstrip(',;.')
        for f in fns: defs.append((f,cond_py(cond) if cond!='True' else 'True',implicit(expr)))
    return defs
def build(defs):
    env={}
    class Div(ast.NodeTransformer):
        def visit_BinOp(self,n):
            self.generic_visit(n)
            if isinstance(n.op,ast.Div): return ast.Call(ast.Name('_div',ast.Load()),[n.left,n.right],[])
            return n
    def mk(fn):
        rules=[(compile(cond,'c','eval'),compile(ast.fix_missing_locations(Div().visit(ast.parse(expr,mode='eval'))),'e','eval')) for f,cond,expr in defs if f==fn for cond,expr in [(cond,expr)]]
        @lru_cache(None)
        def f(n):
            for c,e in rules:
                if eval(c,{'n':n}):
                    return eval(e,{'n':n,'F':env['F'],'G':env.get('G'),'f':env['F'],'_div':lambda a,b:Fraction(a)/Fraction(b) if b else (_ for _ in ()).throw(ZeroDivisionError())})
            raise ValueError('no rule %s'%n)
        return f
    for fn in {d[0] for d in defs}: env[fn]=mk(fn)
    return env
def query(text):
    lines=[norm(l).strip() for l in text.split('\n') if l.strip()]
    q=None
    for l in lines[::-1]:
        if re.search(r'[FGf]\(\s*\(?[\d(]',l) and re.search(r'Чему|Найд|Определ|Вычисл|значени|сумм|Что',l,re.I): q=l;break
    return q
def solve(text):
    defs=parse(text)
    if not defs: raise ValueError('no defs')
    env=build(defs)
    q=query(text)
    if not q: raise ValueError('no query')
    body=re.search(r'([FGf]\(.*[\)\d])',q.replace('f(','F(')) if False else re.search(r'(\(*\s*[FGf]\(.*[\)0-9])',q)
    expr=body.group(1).strip()
    expr=re.sub(r'(\d)\s+(\d{3})(?!\d)',r'\1\2',expr)
    expr=re.sub(r'(?<![A-Za-z])f\(','F(',expr)
    expr=implicit(expr)
    expr=expr.replace('F(n=','F(')
    # fix unbalanced trailing ')' from prose
    while expr.count(')')>expr.count('('): expr=expr[:expr.rfind(')')]
    expr=re.sub(r'\b10\*\*\{?(\d+)\}?',r'10**\1',expr)
    tree=ast.parse(expr,mode='eval')
    class Div(ast.NodeTransformer):
        def visit_BinOp(self,n):
            self.generic_visit(n)
            if isinstance(n.op,ast.Div): return ast.Call(ast.Name('_div',ast.Load()),[n.left,n.right],[])
            return n
    tree=ast.fix_missing_locations(Div().visit(tree))
    val=eval(compile(tree,'q','eval'),{'F':env['F'],'G':env.get('G'),'_div':lambda a,b:Fraction(a)/Fraction(b)})
    t=text.lower()
    val=Fraction(val)
    cands=set()
    if val.denominator==1: cands.add(str(val.numerator))
    cands.add(str(val.numerator//val.denominator))
    v=val.numerator//val.denominator
    cands.add(str(sum(map(int,str(abs(v))))))
    for k in (2,3,4,5,6,7,8,9): cands.add(str(v%10**k)) 
    for m in (10000,1000,100,10,7,1000000007,998244353): cands.add(str(v%m))
    cands.add(str(len(str(abs(v)))))
    return val,cands,v
res={'match':[],'mismatch':[],'unparsed':[]}
def work():
    for r in rows:
        try:
            if '[CODE]' in r['text']: raise ValueError('code')
            val,c,v=solve(r['text'])
            ans=[a.strip() for a in r['ans']]
            # primary interpretation: choose by keywords
            t=r['text'].lower()
            if 'сумм' in t and 'цифр' in t: p=str(sum(map(int,str(abs(v)))))
            elif 'младш' in t or 'остат' in t or '%' in t and 'значение' in t: p=None
            elif 'целую часть' in t or 'целая часть' in t: p=str(v)
            else: p=str(val.numerator) if val.denominator==1 else str(v)
            ok = (p in ans) if p else any(a in c for a in ans)
            res['match' if ok else 'mismatch'].append((r['id'],ans,p or sorted(c)[:3]))
        except Exception as e:
            res['unparsed'].append((r['id'],repr(e)[:80]))
t=threading.Thread(target=work);t.start();t.join()
print({k:len(v) for k,v in res.items()})
json.dump(res,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
