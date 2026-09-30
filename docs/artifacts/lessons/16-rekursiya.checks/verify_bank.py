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


def safe_expression(source, names, calls):
    """Parse the small arithmetic language used by the authored recurrences."""
    tree = ast.parse(source, mode='eval')
    allowed = (
        ast.Expression, ast.Constant, ast.Name, ast.Load, ast.BinOp,
        ast.UnaryOp, ast.BoolOp, ast.Compare, ast.Call,
        ast.Add, ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod, ast.Pow,
        ast.UAdd, ast.USub, ast.Not, ast.And, ast.Or,
        ast.Eq, ast.NotEq, ast.Lt, ast.LtE, ast.Gt, ast.GtE,
    )
    for node in ast.walk(tree):
        if not isinstance(node, allowed):
            raise ValueError('unsupported expression syntax')
        if isinstance(node, ast.Constant) and type(node.value) not in (int, bool):
            raise ValueError('unsupported literal')
        if isinstance(node, ast.Name) and node.id not in names:
            raise ValueError('unknown name')
        if isinstance(node, ast.Call) and (
            not isinstance(node.func, ast.Name)
            or node.func.id not in calls
            or len(node.args) != 1
            or node.keywords
        ):
            raise ValueError('unsupported call')
    return tree.body


def evaluate(node, values):
    """Evaluate only validated arithmetic and recurrence calls, without Python eval."""
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.Name):
        return values[node.id]
    if isinstance(node, ast.BinOp):
        left, right = evaluate(node.left, values), evaluate(node.right, values)
        if isinstance(node.op, ast.Add):
            return left + right
        if isinstance(node.op, ast.Sub):
            return left - right
        if isinstance(node.op, ast.Mult):
            return left * right
        if isinstance(node.op, ast.Div):
            return Fraction(left) / Fraction(right)
        if isinstance(node.op, ast.FloorDiv):
            return left // right
        if isinstance(node.op, ast.Mod):
            return left % right
        if isinstance(node.op, ast.Pow):
            return left ** right
    if isinstance(node, ast.UnaryOp):
        operand = evaluate(node.operand, values)
        if isinstance(node.op, ast.UAdd):
            return +operand
        if isinstance(node.op, ast.USub):
            return -operand
        if isinstance(node.op, ast.Not):
            return not operand
    if isinstance(node, ast.BoolOp):
        if isinstance(node.op, ast.And):
            result = True
            for item in node.values:
                result = evaluate(item, values)
                if not result:
                    return result
            return result
        result = False
        for item in node.values:
            result = evaluate(item, values)
            if result:
                return result
        return result
    if isinstance(node, ast.Compare):
        left = evaluate(node.left, values)
        for op, comparator in zip(node.ops, node.comparators, strict=True):
            right = evaluate(comparator, values)
            if isinstance(op, ast.Eq):
                ok = left == right
            elif isinstance(op, ast.NotEq):
                ok = left != right
            elif isinstance(op, ast.Lt):
                ok = left < right
            elif isinstance(op, ast.LtE):
                ok = left <= right
            elif isinstance(op, ast.Gt):
                ok = left > right
            elif isinstance(op, ast.GtE):
                ok = left >= right
            else:
                raise ValueError('unsupported comparison')
            if not ok:
                return False
            left = right
        return True
    if isinstance(node, ast.Call):
        if not isinstance(node.func, ast.Name):
            raise ValueError('unsupported call')
        return values[node.func.id](evaluate(node.args[0], values))
    raise ValueError('unsupported expression syntax')


def build(defs):
    env={}
    def mk(fn):
        rules=[
            (safe_expression(cond, {'n'}, set()),
             safe_expression(expr, {'n','F','G','f'}, {'F','G','f'}))
            for f,cond,expr in defs if f==fn
        ]
        @lru_cache(None)
        def f(n):
            for c,e in rules:
                if evaluate(c, {'n':n}):
                    return evaluate(e, {'n':n,'F':env['F'],'G':env.get('G'),'f':env['F']})
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
    body=re.search(r'\(*\s*[FGf]\(',q)
    if not body:
        raise ValueError('no query expression')
    # Keep every character of the expression so a suffix such as .attribute or
    # [index] reaches the AST validator instead of being silently truncated.
    expr=re.split(r'\?(?=\s|$)|\.(?=\s|$)',q[body.start():],maxsplit=1)[0].strip()
    expr=re.sub(r'(\d)\s+(\d{3})(?!\d)',r'\1\2',expr)
    expr=re.sub(r'(?<![A-Za-z])f\(','F(',expr)
    expr=implicit(expr)
    expr=expr.replace('F(n=','F(')
    # fix unbalanced trailing ')' from prose
    while expr.count(')')>expr.count('('): expr=expr[:expr.rfind(')')]
    expr=re.sub(r'\b10\*\*\{?(\d+)\}?',r'10**\1',expr)
    tree=safe_expression(expr, {'F','G'}, {'F','G'})
    val=evaluate(tree, {'F':env['F'],'G':env.get('G')})
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
