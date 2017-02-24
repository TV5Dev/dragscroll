/**
 * @fileoverview dragscroll - scroll area by dragging
 * @version 0.0.8
 * 
 * @license MIT, see http://github.com/asvd/dragscroll
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var _window = window;
    var _document = document;
    var mousemove = 'mousemove';
    var mouseup = 'mouseup';
    var mousedown = 'mousedown';
    var EventListener = 'EventListener';
    var addEventListener = 'add'+EventListener;
    var removeEventListener = 'remove'+EventListener;
    var newScrollX, newScrollY;

    var dragged = [];
    var reset = function(i, el) {
        for (i = 0; i < dragged.length;) {
            el = dragged[i++];
            el = el.container || el;
            el[removeEventListener](mousedown, el.md, 0);
            _window[removeEventListener](mouseup, el.mu, 0);
            _window[removeEventListener](mousemove, el.mm, 0);
        }

		var addScrolling = function(array, scrollOnX, scrollOnY) {
			for (i = 0; i < array.length;) {
				(function(el, lastClientX, lastClientY, pushed, scroller, cont){
					(cont = el.container || el)[addEventListener](
						mousedown,
						cont.md = function(e) {
							if (!el.hasAttribute('nochilddrag') ||
								_document.elementFromPoint(
									e.pageX, e.pageY
								) == cont
							) {
								pushed = 1;
								if (scrollOnX) {
									lastClientX = e.clientX;
								}
								if (scrollOnY) {
									lastClientY = e.clientY;
								}

								e.preventDefault();
							}
						}, 0
					);

					_window[addEventListener](
						mouseup, cont.mu = function() {pushed = 0;}, 0
					);

					_window[addEventListener](
						mousemove,
						cont.mm = function(e) {
							if (pushed) {
								if (scrollOnX) {
									(scroller = el.scroller||el).scrollLeft -=
										newScrollX = (- lastClientX + (lastClientX=e.clientX));
								}
								if (scrollOnY) {
									scroller.scrollTop -=
										newScrollY = (- lastClientY + (lastClientY=e.clientY));
								}
								if (el == _document.body) {
									if (scrollOnX) {
										(scroller = _document.documentElement).scrollLeft -= newScrollX;
									}
									if (scrollOnY) {
										scroller.scrollTop -= newScrollY;
									}
								}
							}
						}, 0
					);
				 })(array[i++]);
			}
		}
		
        // cloning into array since HTMLCollection is updated dynamically
        dragged = [].slice.call(_document.getElementsByClassName('dragscroll'));
        
		var draggedX = [].slice.call(_document.getElementsByClassName('dragscroll-x'));
		var draggedY = [].slice.call(_document.getElementsByClassName('dragscroll-y'));
		
		addScrolling(dragged, true, true);
		addScrolling(draggedX, true, false);
		addScrolling(draggedY, false, true);
		
		dragged = dragged.concat(draggedX).concat(draggedY);
    }

      
    if (_document.readyState == 'complete') {
        reset();
    } else {
        _window[addEventListener]('load', reset, 0);
    }

    exports.reset = reset;
}));

