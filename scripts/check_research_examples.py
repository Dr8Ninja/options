#!/usr/bin/env python3
"""Check original pedagogical reference arithmetic; not a trading or application library."""
import math,json
from pathlib import Path
N=lambda x:(1+math.erf(x/math.sqrt(2)))/2
pdf=lambda x:math.exp(-x*x/2)/math.sqrt(2*math.pi)
S=K=100.;r=.05;s=.2;T=1.
d1=(math.log(S/K)+(r+s*s/2)*T)/(s*math.sqrt(T));d2=d1-s*math.sqrt(T)
c=S*N(d1)-K*math.exp(-r*T)*N(d2);p=K*math.exp(-r*T)*N(-d2)-S*N(-d1)
values={'call':c,'put':p,'parity':c-p,'delta':N(d1),'gamma':pdf(d1)/(S*s*math.sqrt(T)),'vega_per_decimal':S*pdf(d1)*math.sqrt(T),'theta_per_elapsed_year':-S*pdf(d1)*s/(2*math.sqrt(T))-r*K*math.exp(-r*T)*N(d2)}
expected={'call':10.45058357,'put':5.57352602,'parity':4.87705755,'delta':.63683065,'gamma':.01876202,'vega_per_decimal':37.52403469,'theta_per_elapsed_year':-6.41402755}
for k,v in expected.items():assert abs(values[k]-v)<1e-7,(k,values[k],v)
# Independent discrete replication sequence converges toward the continuous benchmark.
def tree(n):
 dt=T/n;u=math.exp(s*math.sqrt(dt));d=1/u;prob=(math.exp(r*dt)-d)/(u-d);assert 0<prob<1
 a=[max(S*u**j*d**(n-j)-K,0) for j in range(n+1)]
 for i in range(n,0,-1):a=[math.exp(-r*dt)*((1-prob)*a[j]+prob*a[j+1]) for j in range(i)]
 return a[0]
prices=[tree(n) for n in [100,400]];assert abs(prices[1]-c)<abs(prices[0]-c)<.03
assert math.isclose(.8*1-.2*5,-.2)
assert math.isclose(100*.8*1.2,96)
assert math.isclose(math.sqrt(.25*.04+.25*.04+2*.25*.2*.2*.5),math.sqrt(.03))
assert [(max(x-100,0)-max(x-105,0)-2) for x in [90,100,110]]==[-2,-2,3]
assert [(-max(x-100,0)+2*max(x-110,0)+1) for x in [115,130]]==[-4,11]
assert math.isclose(.2**2-.18**2,.0076)
result={'status':'PASS','as_of':'2026-09-22','scope':'Selected original arithmetic and European benchmark examples, not all project implementations or empirical replication','bsm_values':values,'binomial_prices_n100_n400':prices,'asserted_examples':['expectancy','drawdown','dispersion covariance','vertical','ratio backspread','variance units']}
(Path(__file__).resolve().parents[1]/'research/numerical-checks-p01.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
