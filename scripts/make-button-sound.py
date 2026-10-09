import math, struct, wave
# Original short, non-melodic futuristic confirmation click. No external samples.
rate=48000;length=.115;frames=[];seed=417
for n in range(round(rate*length)):
 t=n/rate;seed=(1664525*seed+1013904223)&0xffffffff;noise=(seed/4294967296*2-1)
 attack=min(1,t/.0025);env=attack*math.exp(-t*52)*(min(1,(length-t)/.012))
 chirp=math.sin(2*math.pi*(1050*t-1700*t*t))
 shimmer=math.sin(2*math.pi*2340*t)*math.exp(-t*32)
 tick=noise*math.exp(-t*240)
 value=.32*env*(.67*chirp+.16*shimmer+.17*tick)
 frames.append(struct.pack('<h',max(-32767,min(32767,round(value*32767)))))
with wave.open('game/assets/audio/button-tap.wav','wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(b''.join(frames))
