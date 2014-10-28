collisions
==========

Latency-aware collision library written for node.js games!

Uses a discrete time-step interpolation scheme to "fill in" missing data from past location packets in order to catch collisions that should have happened.

Why?
--
I wrote this during Hacker School (Summer 2013) to implement a multiplayer "zombie tag" game. I never got the game fully working like I wanted (mostly, the movement wasn't 100% smooth) but the LACE collision engine using Socket.io on Node.js turned out to be an awesome gem of code that I extracted and made open source.

Is it production ready?
--

Nope! It's good, but it needs some performance tweaking. Pretty good for writing it in a couple of days, though!

How it works
--

Let's say we have object G and object B. Object G sends position updates regularly (good connection). Object B sends position updates every once in a while. We don't want object B to be able to "glitch" or "lag" through a collision. So:

Recieve intial updates:

    [BG]

Recieve updates from G every other "frame"

    [BG][][G][][G][][G]

Recieve another update from B:

    [BG][][G][][G][][G][B]

Backfill interpolated data between the two points and check for past collisions

    [BG][BG][BG][BG][BG][BG][BG][B]

Clean up past data we no longer need

    [BG][B]

Voila! The idea is to do that fast enough that the user doesn't notice.

