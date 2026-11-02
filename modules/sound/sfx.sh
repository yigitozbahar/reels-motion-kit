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
# weather
MAKE[rain]="-f lavfi -i anoisesrc=c=pink:d=12:a=0.6:r=$R -af highpass=f=500,lowpass=f=8000,tremolo=f=0.4:d=0.25"
                                            # steady rain on a window (12 s, loops)
MAKE[thunder]="-f lavfi -i anoisesrc=c=brown:d=5:a=0.7:r=$R -af lowpass=f=260,volume=2.5*exp(-0.8*t)*min(1\,t*6)*(0.75+0.25*sin(2*PI*2.3*t)):eval=frame,aecho=0.8:0.6:280:0.4"
                                            # a roll of thunder, near then fading (5 s)
# engines and machines
MAKE[engine-start]="-f lavfi -i aevalsrc=lt(t\,1.1)*0.28*sgn(sin(2*PI*(26+14*t)*t))*(0.6+0.4*sin(2*PI*11*t))+gte(t\,1.1)*min(1\,(t-1.1)*5)*(0.6*sin(2*PI*52*t)+0.4*(random(0)*2-1))*(exp(-16*mod(t\,0.11))+0.8*exp(-16*mod(t+0.045\,0.11))):d=3.5:s=$R -af lowpass=f=700,volume=1.5"
                                            # a starter grinding, then a big twin catching and revving (3.5 s; it fires at 1.1 s)
MAKE[engine-idle]="-f lavfi -i aevalsrc=(0.55*sin(2*PI*48*t)+0.35*(random(0)*2-1))*(exp(-22*mod(t\,0.17))+0.85*exp(-22*mod(t+0.07\,0.17))):d=8.5:s=$R -af lowpass=f=420,volume=1.8"
                                            # a big twin idling, its uneven double beat (8.5 s, loops)
MAKE[fob-beep]="-f lavfi -i aevalsrc=0.35*sin(2*PI*2700*t)*(lt(t\,0.07)+gte(t\,0.14)*lt(t\,0.21)):d=0.4:s=$R"
                                            # a remote key's double beep (0.4 s)
MAKE[relay]="-f lavfi -i aevalsrc=0.7*(random(0)*2-1)*exp(-70*t)+0.6*sin(2*PI*85*t)*exp(-16*t):d=0.7:s=$R -af lowpass=f=2200,aecho=0.8:0.55:70|160:0.35|0.2,volume=1.2"
                                            # a heavy light switch or relay clunking in a big concrete space (0.7 s)
MAKE[whisper]="-f lavfi -i anoisesrc=c=white:d=3:a=0.5:r=$R -af bandpass=f=2800:w=2400,volume=90*(0.5+0.5*sin(2*PI*4.6*t))*(0.4+0.6*sin(PI*t/3)):eval=frame,aecho=0.8:0.4:40:0.3"
                                            # breathy, syllable-like hiss rising and falling: a whisper with no words (3 s)
# the house
MAKE[knock]="-f lavfi -i aevalsrc=(0.7*sin(2*PI*120*t)+0.5*(random(0)*2-1))*(exp(-38*t)+gte(t\,0.3)*exp(-38*(t-0.3))+gte(t\,0.6)*exp(-38*(t-0.6))):d=1.6:s=$R -af lowpass=f=1400,aecho=0.8:0.5:60|140:0.3|0.15,volume=1.4"
                                            # three knocks on a wooden door (1.6 s; at 0, 0.3, 0.6 s)
MAKE[bangle]="-f lavfi -i aevalsrc=lt(t\,0.7)*0.25*(random(0)*2-1)*(0.6+0.4*sin(2*PI*31*t))+gte(t\,0.7)*0.35*(sin(2*PI*2350*t)+0.6*sin(2*PI*3710*t)+0.4*sin(2*PI*5230*t))*exp(-6*(t-0.7)):d=2:s=$R -af highpass=f=900,volume=1.0"
                                            # metal scraping across a floor, then a small ring as it stops (2 s; it rings at 0.7 s)
MAKE[chairs]="-f lavfi -i anoisesrc=c=brown:d=1.6:a=0.6:r=$R -af bandpass=f=380:w=300,volume=1.8*(0.5+0.5*sin(2*PI*7*t))*sin(PI*t/1.6):eval=frame,aecho=0.8:0.5:50:0.3"
                                            # a chair pushed back across a floor (1.6 s)

MAKE[lullaby]="-f lavfi -i aevalsrc=0.22*(gte(t\,0.0)*(sin(2*PI*392*(1-0.006*sin(2*PI*0.7*t))*(t-0.0))+0.35*sin(2*PI*784*(1-0.006*sin(2*PI*0.7*t))*(t-0.0)))*exp(-3.2*(t-0.0))+gte(t\,0.55)*(sin(2*PI*523.25*(1-0.006*sin(2*PI*0.7*t))*(t-0.55))+0.35*sin(2*PI*1046.5*(1-0.006*sin(2*PI*0.7*t))*(t-0.55)))*exp(-3.2*(t-0.55))+gte(t\,1.1)*(sin(2*PI*659.25*(1-0.006*sin(2*PI*0.7*t))*(t-1.1))+0.35*sin(2*PI*1318.5*(1-0.006*sin(2*PI*0.7*t))*(t-1.1)))*exp(-3.2*(t-1.1))+gte(t\,1.65)*(sin(2*PI*587.33*(1-0.006*sin(2*PI*0.7*t))*(t-1.65))+0.35*sin(2*PI*1174.66*(1-0.006*sin(2*PI*0.7*t))*(t-1.65)))*exp(-3.2*(t-1.65))+gte(t\,2.2)*(sin(2*PI*523.25*(1-0.006*sin(2*PI*0.7*t))*(t-2.2))+0.35*sin(2*PI*1046.5*(1-0.006*sin(2*PI*0.7*t))*(t-2.2)))*exp(-3.2*(t-2.2))+gte(t\,2.75)*(sin(2*PI*440*(1-0.006*sin(2*PI*0.7*t))*(t-2.75))+0.35*sin(2*PI*880*(1-0.006*sin(2*PI*0.7*t))*(t-2.75)))*exp(-3.2*(t-2.75))+gte(t\,3.3)*(sin(2*PI*392*(1-0.006*sin(2*PI*0.7*t))*(t-3.3))+0.35*sin(2*PI*784*(1-0.006*sin(2*PI*0.7*t))*(t-3.3)))*exp(-3.2*(t-3.3))):d=4.6:s=$R -af aecho=0.8:0.6:180|330:0.35|0.2,volume=1.2"
                                            # a music box playing a slow seven-note lullaby, a little out of tune (4.6 s, loops)
MAKE[door-slam]="-f lavfi -i aevalsrc=(0.9*sin(2*PI*58*t)+0.6*(random(0)*2-1)*exp(-30*t))*exp(-9*t):d=2:s=$R -af lowpass=f=1000,aecho=0.8:0.6:120|260:0.45|0.3,volume=1.6"
                                            # a heavy door slammed shut in a stairwell, a boom and its echo (2 s)

MAKE[laugh]="-f lavfi -i aevalsrc=(0.45*(random(0)*2-1)+0.7*sin(2*PI*(250+40*sin(2*PI*5*t))*t)+0.3*sin(2*PI*(500+80*sin(2*PI*5*t))*t))*pow(abs(sin(PI*t*4.2))\,3)*exp(-0.45*t)*min(1\,t*5):d=3.2:s=$R -af bandpass=f=900:w=1500,aecho=0.8:0.6:140|300:0.4|0.25,volume=1.8"
                                            # a breathy old woman's laugh, heh-heh-heh, fading into an echo (3.2 s)
MAKE[window-knock]="-f lavfi -i aevalsrc=(0.9*sin(2*PI*85*t)*exp(-22*t)+0.5*(random(0)*2-1)*exp(-45*t)+0.3*sin(2*PI*2200*t)*exp(-16*t))+gte(t\,0.38)*(0.9*sin(2*PI*85*(t-0.38))*exp(-22*(t-0.38))+0.5*(random(0)*2-1)*exp(-45*(t-0.38))+0.3*sin(2*PI*2200*(t-0.38))*exp(-16*(t-0.38))):d=1.3:s=$R -af lowpass=f=5000,volume=1.5"
                                            # a palm slammed twice on a car window: a thud and the glass ringing (1.3 s; at 0 and 0.38 s)
MAKE[riser]="-f lavfi -i aevalsrc=(0.35*sin(2*PI*(70*t+60*t*t))+0.2*sin(2*PI*(105*t+90*t*t))+0.25*(random(0)*2-1)*t/3)*pow(t/3\,1.6):d=3:s=$R -af lowpass=f=3000,aecho=0.8:0.5:90:0.3,volume=1.6"
                                            # tension rising: two sweeping tones and a growing hiss, cut off at the top (3 s)
MAKE[branch-snap]="-f lavfi -i aevalsrc=(0.9*(random(0)*2-1)*exp(-60*t)+0.5*sin(2*PI*180*t)*exp(-30*t))+gte(t\,0.05)*0.6*(random(0)*2-1)*exp(-80*(t-0.05)):d=1:s=$R -af highpass=f=300,lowpass=f=6000,aecho=0.8:0.5:120|260:0.35|0.2,volume=1.4"
                                            # a dry branch snapping underfoot in a quiet wood, its echo (1 s)
MAKE[crackle]="-f lavfi -i aevalsrc=0.7*(random(0)*2-1)*gt(sin(2*PI*9*t)+sin(2*PI*23.3*t)+0.8*sin(2*PI*4.1*t)\,1.2)*min(1\,t*2):d=2.5:s=$R -af highpass=f=900,lowpass=f=7000,volume=1.1"
                                            # something brittle cracking apart, quick dry ticks thickening (2.5 s)
names=(${@:-${(ok)MAKE}})
for n in $names; do
  [[ -n ${MAKE[$n]} ]] || { echo "no sound named $n (have: ${(ok)MAKE})"; exit 1; }
  $F ${(s: :)MAKE[$n]} $n.wav
done
echo "media/sfx: $names"
