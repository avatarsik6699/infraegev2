import json,re,collections,sys
d=json.load(open('content/practice-bank/bank.json'))
def flat(t):
    out=[]
    for b in t['statement']:
        dd=b['data']
        if 'spans' in dd: out.append(''.join(s['text'] for s in dd['spans']))
        elif 'markdown' in dd: out.append(dd['markdown'])
        elif 'code' in dd: out.append(dd['code'])
        elif 'variants' in dd: out.append(dd['variants'][0]['code'])
    return '\n'.join(out)
P={
 'digits_div_mod':r'//\s*10|%\s*10|\\%\s*10',
 'halving':r'//\s*2|/\s*2\b',
 'parity_branch':r'чётн|нечётн|четн|нечетн|%\s*2',
 'upward_n_plus_k':r'F\(n\s*\+\s*\d',
 'two_functions':r'\bG\(',
 'two_previous':r'F\(n\s*[-−–]\s*2\)',
 'step_minus_3plus':r'F\(n\s*[-−–]\s*[3-9]\)',
 'huge_argument':r'10\^|10\*\*|\d{4,}\)',
 'count_n':r'[Сс]колько',
 'procedure_output':r'def |print|вывод|процедур',
 'ratio':r'F\([^)]*\)\s*/\s*F\(',
 'difference':r'F\([^)]*\)\s*[−–-]\s*\d*\s*\*?\s*F\(',
 'threshold_constant':r'при n\s*[<≥>≤]=?\s*\d{2,}',
}
rows=[]
for t in d['tasks']:
    x=t['task']
    if 'rekursiya' not in json.dumps(x,ensure_ascii=False) or not x['catalog_visible']: continue
    s=flat(x)
    rows.append({'id':x['id'],'title':x['title'],'difficulty':x['difficulty'],
      'tags':[k for k,p in P.items() if re.search(p,s)],'answer':x['checker']['answer_variants'][:1]})
cnt=collections.Counter(k for r in rows for k in r['tags'])
json.dump({'note':'regex-классификация, категории пересекаются; воспроизводится scripts из аудита','total':len(rows),
 'tag_counts':dict(cnt.most_common()),'difficulty':dict(collections.Counter(r['difficulty'] for r in rows)),
 'no_tag':sum(1 for r in rows if not r['tags']),'tasks':rows},
 open('docs/artifacts/lessons/16-rekursiya.bank-tags.json','w'),ensure_ascii=False,indent=1)
print(len(rows),dict(cnt.most_common()), sum(1 for r in rows if not r['tags']))
