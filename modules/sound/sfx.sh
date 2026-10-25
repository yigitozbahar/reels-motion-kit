#!/bin/zsh
# sfx.sh: the sound library. Every effect is synthesised with ffmpeg alone (no downloads, no licences) into media/sfx/.
# Story-agnostic: stories pick sounds by name.
#   ./motion sfx                 make them all
#   ./motion sfx doorbell drone  make just these
set -e
cd "${0:A:h}/../../media" && mkdir -p sfx && cd sfx
F=(ffmpeg -loglevel error -y)
R=48000
typeset -A MAKE

# beds and ambience
MAKE[drone]="-f lavfi -i sine=f=55:d=20:r=$R -f lavfi -i sine=f=58.3:d=20:r=$R -f lavfi -i anoisesrc=c=brown:d=20:a=0.5:r=$R -filter_complex [0][1]amix=2[s];[2]lowpass=f=160[n];[s][n]amix=2:weights=1|0.8,tremolo=f=0.12:d=0.5,afade=t=in:d=2,afade=t=out:st=18:d=2,volume=1.6"
                                            # two low sines beating + a brown rumble, a slow swell (20 s, loops)
MAKE[hum]="-f lavfi -i aevalsrc=0.25*sin(2*PI*100*t)+0.12*sin(2*PI*200*t)+0.06*sin(2*PI*300*t)+0.04*sgn(sin(2*PI*100*t)):d=10:s=$R -af lowpass=f=2500,volume=0.8"
                                            # a fluorescent tube's mains hum (10 s, loops)
MAKE[heartbeat]="-f lavfi -i aevalsrc=sin(2*PI*52*t)*(exp(-28*mod(t\,0.857))+0.75*gte(mod(t\,0.857)\,0.25)*exp(-28*(mod(t\,0.857)-0.25))):d=6:s=$R -af lowpass=f=140,volume=2.2"
                                            # lub-dub at 70 bpm (6 s, loops)
# hits
MAKE[stinger]="-f lavfi -i aevalsrc=0.8*sin(2*PI*41*t)*exp(-1.4*t)+0.12*(sin(2*PI*1975*t)+sin(2*PI*2093*t))*exp(-0.7*t)*min(1\,t*4):d=4:s=$R -af aecho=0.8:0.7:120:0.3"
                                            # a low boom under two clashing high tones (4 s): a reveal
MAKE[light-flicker]="-f lavfi -i aevalsrc=(0.5*(random(0)*2-1)+0.4*sin(2*PI*100*t))*gt(sin(2*PI*6.7*t)+sin(2*PI*15.1*t)+0.6*sin(2*PI*2.3*t)\,0.9):d=2.5:s=$R -af highpass=f=60,lowpass=f=6000,volume=0.7"
                                            # crackles, the hum cutting in and out (2.5 s)
MAKE[tick-run]="-f lavfi -i aevalsrc=0.6*(random(0)*2-1)*exp(-260*mod(t\,0.045+0.03*sin(7*t)))*min(1\,(1.6-t)*3):d=1.6:s=$R -af highpass=f=1200,lowpass=f=6000,volume=0.8"
                                            # a rapid run of ticks (1.6 s): a tally, results coming in
# objects
MAKE[phone-buzz]="-f lavfi -i aevalsrc=0.5*sgn(sin(2*PI*165*t))*lt(mod(t\,0.6)\,0.32):d=1.2:s=$R -af lowpass=f=900,highpass=f=80"
                                            # two vibration pulses (1.2 s)
MAKE[doorbell]="-f lavfi -i aevalsrc=0.4*(sin(2*PI*659.25*t)+0.3*sin(2*PI*1318.5*t))*exp(-4*t)+0.4*gte(t\,0.45)*(sin(2*PI*523.25*(t-0.45))+0.3*sin(2*PI*1046.5*(t-0.45)))*exp(-3*(t-0.45)):d=2.2:s=$R -af aecho=0.8:0.5:35:0.25"
                                            # an apartment ding-dong, E5 then C5 (2.2 s)
MAKE[elevator-ding]="-f lavfi -i aevalsrc=0.45*(sin(2*PI*1046.5*t)+0.5*sin(2*PI*2093*t)+0.25*sin(2*PI*3139*t)+0.15*sin(2*PI*1568*t))*exp(-2.6*t):d=2.5:s=$R -af aecho=0.8:0.6:40:0.2"
                                            # a struck bell, decaying (2.5 s)
MAKE[door-slide]="-f lavfi -i anoisesrc=c=pink:d=2:a=0.6:r=$R -f lavfi -i sine=f=62:d=2:r=$R -filter_complex [0]bandpass=f=450:w=500[a];[1]volume=0.4[b];[a][b]amix=2,volume=sin(PI*t/2):eval=frame,volume=2"
                                            # elevator doors: band-passed noise swelling and fading + a motor (2 s)
MAKE[paper-slide]="-f lavfi -i anoisesrc=c=white:d=0.9:a=0.5:r=$R -af highpass=f=1800,lowpass=f=7000,volume=0.9*sin(PI*t/0.9)*(0.7+0.3*sin(2*PI*23*t)):eval=frame"
                                            # paper under a door: a dry, high scrape (0.9 s)
MAKE[lock-turn]="-f lavfi -i aevalsrc=(0.7*(random(0)*2-1)+0.5*sin(2*PI*2400*t))*(exp(-90*t)+exp(-90*abs(t-0.35))*gte(t\,0.35))+0.6*sin(2*PI*110*(t-0.62))*exp(-14*(t-0.62))*gte(t\,0.62):d=0.9:s=$R -af bandpass=f=1800:w=3000,volume=1.4"
                                            # two metal clicks and a clunk (0.9 s)
MAKE[footsteps-stairs]="-f lavfi -i aevalsrc=(0.55*(random(0)*2-1)+0.8*sin(2*PI*75*t))*exp(-32*mod(t\,0.82))*(0.25+0.75*t/9):d=9:s=$R -af lowpass=f=1100,aecho=0.8:0.55:90|170:0.35|0.2,volume=1.4"
                                            # slow steps coming closer, in a stairwell echo (9 s)

names=(${@:-${(ok)MAKE}})
for n in $names; do
  [[ -n ${MAKE[$n]} ]] || { echo "no sound named $n (have: ${(ok)MAKE})"; exit 1; }
  $F ${(s: :)MAKE[$n]} $n.wav
done
echo "media/sfx: $names"
