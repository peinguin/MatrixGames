﻿//* @public
/**
 Enyo supports a set of cross-platform gesture events that work similarly on all supported platforms. These events are 
 provided so that users can write a single set of event handlers for applications that run on both mobile and 
 desktop platforms. They are needed because desktop and mobile platforms handle basic gestures differently.
 For example, desktop platforms provide mouse events while mobile platforms support touch events and a limited 
 set of mouse events for backward compatibility.
 
 The following events are available:

 * "down" - generated when the pointer is pressed down.
 * "up" - generated when the pointer is released up.
 * "tap" - genereted when the pointer is pressed down and released up. The target is the lowest dom element that received both 
 the related down and up events.
 * "move" - generated when the pointer moves.
 * "enter" - generated when the pointer enters a dom node.
 * "leave" - generated when the pointer leaves a dom node.
 * "hold" - generated when the pointer is held down without moving for a short period (about 200ms).
 * "release" - generated when the pointer is released after being held down. The target is the same as the hold event.
 * "holdpulse" - generated when the pointer is held down without moving for a short period and periodically thereafter about every 200ms.
 Use this event to trigger an action after an arbitrary period of time. The holdTime property provides the elapsed time.
 * "flick" - generated when the user flicks the pointer quickly. This event provides flick velocity data: xVelocity is the velocity in the horizontal and
 yVelocity is the vertical velocity.

 These events are synthesized from the available dom events and contain these common properties, when available: "target", 
 relatedTarget", "clientX", "clientY", "pageX", "pageY", "screenX", "screenY", "altKey", "ctrlKey", "metaKey", "shiftKey",
"detail", "identifier."

 Please note that enyo's gesture events are generated on enyo controls, not dom elements.

 */
enyo.gesture = {
	//* @protected
	holdPulseDelay: 200,
	minFlick: 0.1,
	minTrack: 8,
	maxTrack: 32,
	eventProps: ["target", "relatedTarget", "clientX", "clientY", "pageX", "pageY", "screenX", "screenY", "altKey", "ctrlKey", "metaKey", "shiftKey",
		"detail", "identifier", "dispatchTarget"],
	makeEvent: function(inType, inEvent) {
		var e = {type: inType};
		for (var i=0, p; p=this.eventProps[i]; i++) {
			e[p] = inEvent[p];
		}
		return e;
	},
	down: function(inEvent) {
		var e = this.makeEvent("down", inEvent);
		enyo.dispatch(e);
		this.startTracking(e);
		this.target = e.target;
		this.dispatchTarget = e.dispatchTarget;
		this.beginHold(e);
	},
	move: function(inEvent) {
		this.cancelHold();
		var e = this.makeEvent("move", inEvent);
		enyo.dispatch(e);
		if (this.trackInfo) {
			this.track(e);
		}
	},
	up: function(inEvent) {
		this.cancelHold();
		var e = this.makeEvent("up", inEvent);
		var tapPrevented = false;
		e.preventTap = function() {
			tapPrevented = true;
		};
		this.endTracking(e);
		enyo.dispatch(e);
		if (!tapPrevented) {
			this.sendTap(e);
		}
	},
	startTracking: function(e) {
		this.trackInfo = {};
		this.flickable = false;
		this.track(e);
	},
	track: function(inEvent) {
		//this.flickable = false;
		var ti = this.trackInfo;
		var s = ti.last;
		if (s) {
			// setting max hz to 120 helps avoid spaz data
			ti.time = new Date().getTime();
			var dt = ti.dt = Math.max(this.minTrack, ti.time - s.time);
			var x = ti.vx = (inEvent.pageX - s.x) / dt;
			var y = ti.vy = (inEvent.pageY - s.y) / dt;
			var v = ti.v = Math.sqrt(x*x + y*y);
			this.flickable = v > this.minFlick;
		}
		ti.last = {x: inEvent.pageX, y: inEvent.pageY, time: new Date().getTime()};
	},
	endTracking: function(e) {
		if (this.flickable && this.trackInfo && (new Date().getTime() - this.trackInfo.time < this.maxTrack)) {
			this.sendFlick(e);
		}
		this.trackInfo = null;
	},
	over: function(inEvent) {
		enyo.dispatch(this.makeEvent("enter", inEvent));
	},
	out: function(inEvent) {
		enyo.dispatch(this.makeEvent("leave", inEvent));
	},
	beginHold: function(inEvent) {
		this.holdStart = new Date().getTime();
		this.holdJob = setInterval(enyo.bind(this, "sendHoldPulse", inEvent), this.holdPulseDelay);
	},
	cancelHold: function() {
		clearInterval(this.holdJob);
		this.holdJob = null;
		if (this.sentHold) {
			this.sentHold = false;
			this.sendRelease(this.holdEvent);
		}
	},
	sendHoldPulse: function(inEvent) {
		if (!this.sentHold) {
			this.sentHold = true;
			this.sendHold(inEvent);
		}
		var e = this.makeEvent("holdpulse", inEvent);
		e.holdTime = new Date().getTime() - this.holdStart;
		enyo.dispatch(e);
	},
	sendHold: function(inEvent) {
		this.holdEvent = inEvent;
		var e = this.makeEvent("hold", inEvent);
		enyo.dispatch(e);
	},
	sendRelease: function(inEvent) {
		var e = this.makeEvent("release", inEvent);
		enyo.dispatch(e);
	},
	sendTap: function(inEvent) {
		// The common ancestor for the down/up pair is the origin for the tap event
		var t = this.findCommonAncestor(this.target, inEvent.target);
		if (t) {
			var e = this.makeEvent("tap", inEvent);
			e.target = t;
			enyo.dispatch(e);
		}
	},
	findCommonAncestor: function(inA, inB) {
		var p = inB;
		while (p) {
			if (this.isTargetDescendantOf(inA, p)) {
				return p;
			}
			p = p.parentNode;
		}
	},
	isTargetDescendantOf: function(inChild, inParent) {
		var c = inChild;
		while(c) {
			if (c == inParent) {
				return true;
			}
			c = c.parentNode;
		}
	},
	sendFlick: function(inEvent) {
		var e = this.makeEvent("flick", inEvent);
		e.xVelocity = this.trackInfo.vx;
		e.yVelocity = this.trackInfo.vy;
		e.velocity = this.trackInfo.v;
		e.target = this.target;
		enyo.dispatch(e);
	}
};

//* @protected
enyo.dispatcher.features.push(
	function(e) {
		// NOTE: beware of properties in enyo.gesture inadvertantly mapped to event types
		if (enyo.gesture.events[e.type]) {
			return enyo.gesture.events[e.type](e);
		}
	}
);

enyo.gesture.events = {
	mousedown: function(e) {
		enyo.gesture.down(e);
	},
	mouseup: function(e) {
		enyo.gesture.up(e);
	},
	mousemove:  function(e) {
		enyo.gesture.move(e);
	},
	mouseover:  function(e) {
		enyo.gesture.over(e);
	},
	mouseout:  function(e) {
		enyo.gesture.out(e);
	}
}