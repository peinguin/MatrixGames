﻿//* @protected
enyo.requiresWindow(function() {
	// add touch-specific gesture feature
	var gesture = enyo.gesture;
	//
	gesture.events.touchstart = function(e) {
		gesture.events = touchGesture;
		gesture.events.touchstart(e);
	}
	//
	var touchGesture = {
		// FIXME: for touchmove to fire on Android, must prevent touchstart event.
		// However, it's problematic to systematize this because preventing touchstart
		// stops native scrolling and prevents focus changes.
		touchstart: function(inEvent) {
			this.excludedTarget = null;
			var e = this.makeEvent(inEvent);
			gesture.down(e);
			this.overEvent = e;
			gesture.over(e);
		},
		touchmove: function(inEvent) {
			// NOTE: allow user to supply a node to exclude from event 
			// target finding via the drag event.
			var de = gesture.drag.dragEvent;
			this.excludedTarget = de && de.dragInfo && de.dragInfo.node;
			var e = this.makeEvent(inEvent);
			gesture.move(e);
			// synthesize over and out (normally generated via mouseout)
			if (this.overEvent && this.overEvent.target != e.target) {
				this.overEvent.relatedTarget = e.target;
				e.relatedTarget = this.overEvent.target;
				gesture.out(this.overEvent);
				gesture.over(e);
			}
			this.overEvent = e;
		},
		touchend: function(inEvent) {
			gesture.up(this.makeEvent(inEvent));
			// FIXME: in touch land, there is no distinction between
			// a pointer enter/leave and a drag over/out.
			// While it may make sense to send a leave event when a touch
			// ends, it does not make sense to send a dragout.
			// We avoid this by processing out after up, but
			// this ordering is ad hoc.
			gesture.out(this.overEvent);
		},
		makeEvent: function(inEvent) {
			var e = enyo.clone(inEvent.changedTouches[0]);
			e.target = this.findTarget(null, e.pageX, e.pageY);
			//console.log("target for " + inEvent.type + " at " + e.pageX + ", " + e.pageY + " is " + (e.target ? e.target.id : "none"));
			return e;
		},
		calcNodeOffset: function(inNode) {
			if (inNode.getBoundingClientRect) {
				var o = inNode.getBoundingClientRect();
				return {
					left: o.left + window.pageXOffset || document.body.scrollLeft,
					top: o.top + window.pageYOffset || document.body.scrollTop,
					width: o.width,
					height: o.height
				}
			}
		},
		// NOTE: will find only 1 element under the touch and 
		// will fail if an element is positioned outside the bounding box of its parent
		findTarget: function(inNode, inX, inY) {
			var n = inNode || document.body;
			var o = this.calcNodeOffset(n);
			if (o && n != this.excludedTarget) {
				var x = inX - o.left;
				var y = inY - o.top;
				//console.log("test: " + n.id + " (left: " + o.left + ", top: " + o.top + ", width: " + o.width + ", height: " + o.height + ")");
				if (x>0 && y>0 && x<=o.width && y<=o.height) {
					//console.log("IN: " + n.id + " -> [" + x + "," + y + " in " + o.width + "x" + o.height + "] (children: " + n.childNodes.length + ")");
					var target;
					for (var n$=n.childNodes, i=n$.length-1, c; c=n$[i]; i--) {
						target = this.findTarget(c, inX, inY);
						if (target) {
							return target;
						}
					}
					return n;
				}
			}
		},
		connect: function() {
			document.ontouchstart = enyo.dispatch;
			document.ontouchmove = enyo.dispatch;
			document.ontouchend = enyo.dispatch;
			document.ongesturestart = enyo.dispatch;
			document.ongesturechange = enyo.dispatch;
			document.ongestureend = enyo.dispatch;
		}
	};
	//
	touchGesture.connect();
});