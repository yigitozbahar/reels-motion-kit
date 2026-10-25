# sound

`sfx.sh`: the sound library. Every effect is synthesised with ffmpeg alone (no downloads, no licences) into
`media/sfx/<name>.wav`, which stays out of git: `./motion sfx` makes them all, `./motion sfx doorbell drone` just those.

Beds: drone, hum, heartbeat. Hits: stinger, light-flicker. Objects: phone-buzz, doorbell, elevator-ding, door-slide,
paper-slide, lock-turn, footsteps-stairs. New sounds go here by name, never by story.
