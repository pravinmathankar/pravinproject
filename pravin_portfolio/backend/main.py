from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

app = FastAPI(title='Operations Exception Desk API', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

cases = [
    {'id':'EXC-1001','type':'HOLDING_MISMATCH','severity':'HIGH','state':'OPEN','source':'internal_holdings.csv','description':'Position differs from expected holding.'},
    {'id':'EXC-1002','type':'AMBIGUOUS_CASH','severity':'MEDIUM','state':'INVESTIGATING','source':'cash_ledger.jsonl','description':'Cash entry needs investigation.'},
    {'id':'EXC-1003','type':'PRICE_MISMATCH','severity':'LOW','state':'OPEN','source':'exchange_reference.csv','description':'Reference price differs from source.'}
]

class Note(BaseModel):
    author: str
    text: str

@app.get('/')
def root():
    return {'service':'Operations Exception Desk API','status':'running','docs':'/docs'}

@app.get('/health')
def health():
    return {'status':'healthy','timestamp':datetime.utcnow().isoformat()+'Z'}

@app.get('/cases')
def get_cases(severity: Optional[str]=None, state: Optional[str]=None, case_type: Optional[str]=Query(None, alias='type')):
    result=cases
    if severity: result=[c for c in result if c['severity'].lower()==severity.lower()]
    if state: result=[c for c in result if c['state'].lower()==state.lower()]
    if case_type: result=[c for c in result if c['type'].lower()==case_type.lower()]
    return {'count':len(result),'items':result}

@app.get('/cases/{case_id}')
def get_case(case_id: str):
    for case in cases:
        if case['id']==case_id: return case
    raise HTTPException(404,'Case not found')

@app.post('/cases/{case_id}/notes')
def add_note(case_id: str, note: Note):
    case=get_case(case_id)
    return {'case_id':case_id,'note':note.model_dump(),'created_at':datetime.utcnow().isoformat()+'Z','audit':'recorded'}

@app.post('/cases/{case_id}/transition')
def transition(case_id: str, state: str):
    for case in cases:
        if case['id']==case_id:
            case['state']=state.upper()
            return case
    raise HTTPException(404,'Case not found')

@app.get('/imports')
def imports():
    return {'items':[{'id':'IMP-001','source':'internal_holdings.csv','state':'COMPLETED','rows':1200},{'id':'IMP-002','source':'cash_ledger.jsonl','state':'COMPLETED','rows':842}]}
