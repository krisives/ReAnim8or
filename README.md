## About ReAnim8or
A project I started when I was on vacation. The goal is to re-create some of the simple
editing capabilities of [Anim8or](http://anim8or.com/main/index.html). Steve, sadly,
never open sourced the original client.

### Live Demo
You can see a live demo of whatever I consider "stable" here:

* http://krisives.github.com/ReAnim8or/

### So, what can it do?

Right now just about nothing besides basic camera movement, UI, and a few other odd
features.

### How can I help?

Press fork, make code.

### How do I add a Tool?

Make a new `.js` file inside `js/Tools`, then add it to the `defaultTools.txt` file. Make sure to call
`Tool.construct` when extending it!
