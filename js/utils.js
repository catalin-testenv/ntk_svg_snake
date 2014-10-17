'use strict';

/* ================================== PATCHES =============================================*/

if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

Element.prototype.remove = Element.prototype.remove || function () {
    this.parentNode && this.parentNode.removeChild(this);
}

NodeList.prototype.remove = NodeList.prototype.remove || function () {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentNode) {
            this[i].parentNode.removeChild(this[i]);
        }
    }
}

/* ================================== END PATCHES =============================================*/


window.CONFIG = {
    LOG_LEVELS: {
        DEBUG: 1, INFO: 2, NOTICE: 4, WARNING: 8, ERROR: 16
    },
    LOG_LEVEL: 'DEBUG',
    
    get HOW_HANDED () { return 'right'; },
    GAME_SPEED: 4,
    get SNAKE_CHAIN_SIZE () { return 15 ; },
    get APP_PAGE () { return 'game'; },

    get DOC_WIDTH () { return document.documentElement.clientWidth; },
    get DOC_HEIGHT () { return document.documentElement.clientHeight; },
    get APP_ABS_ASPECT_RATIO () { return document.documentElement.clientHeight/document.documentElement.clientWidth >= 1 ? document.documentElement.clientHeight/document.documentElement.clientWidth : document.documentElement.clientWidth/document.documentElement.clientHeight; },
    get ORIENTATION () { return document.documentElement.clientWidth/document.documentElement.clientHeight >= 1 ? 'landscape' : 'portrait' ; },
    
    get APP_VIEWBOX_WIDTH () { return this.DOC_WIDTH; }, // 600
    get APP_VIEWBOX_HEIGHT () { return this.DOC_HEIGHT; }, // 900
    
    NON_GAME_1_SIZE: 30, // smaller
    NON_GAME_2_SIZE: 100, // larger
    
    get NON_GAME_ALL_SIZE () { return this.NON_GAME_1_SIZE + this.NON_GAME_2_SIZE},
    
    get GAME_AREA_WIDTH  () {
        return this.ORIENTATION == 'landscape' ? this.APP_VIEWBOX_WIDTH - this.NON_GAME_2_SIZE : this.APP_VIEWBOX_WIDTH ; 
    }, 
    get GAME_AREA_HEIGHT () {
        return this.ORIENTATION == 'landscape' ? this.APP_VIEWBOX_HEIGHT - this.NON_GAME_1_SIZE: this.APP_VIEWBOX_HEIGHT - this.NON_GAME_ALL_SIZE;
    }, 
    get GAME_AREA_X      () {
        if ( this.HOW_HANDED == 'right') { return 0; }
        else { return this.ORIENTATION == 'landscape' ? this.APP_VIEWBOX_WIDTH - this.GAME_AREA_WIDTH : 0; }
    }, 
    get GAME_AREA_Y      () { 
        return this.NON_GAME_1_SIZE;
    }, 
    
    get DISPLAY_CONTROLLER () {return true;},
    
    NOTHING:0
};

window.utils = (function () {
    
    var log = (function () {
        function logger (log_level, msg) {
            (log_level >= CONFIG.LOG_LEVELS[CONFIG.LOG_LEVEL]) && console.log(msg);
        }
        return {
            debug: logger.bind(null, 1),
            info: logger.bind(null, 2),
            notice: logger.bind(null, 4),
            warning: logger.bind(null, 8),
            error: logger.bind(null, 16)
        }
    })();
    
    var make_SVG = (function () {
        var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
        var NAMESPACES = {'xlink':'http://www.w3.org/1999/xlink'};
        return function _makeSVG (tag, attrs) {
                attrs = attrs || {};
                var el= document.createElementNS(SVG_NAMESPACE, tag);
                for (var key in attrs) {
                    var ns, k, ns_k;
                    ns_k = key.split(':');
                    if (ns_k.length == 2) {
                        ns = ns_k[0];
                        k = ns_k[1];
                    }
                    else {
                        k = ns_k[0];
                    }
                    ns ? el.setAttributeNS(NAMESPACES[ns], k, attrs[key]) : el.setAttribute(key, attrs[key]);
                }
                return el;
            }
    })();
    
    
    
    
    var animate = (function () {
        
        window.requestAnimationFrame = (function () {
            return  window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    function (callback) {
                        return window.setTimeout(callback, 1000 / 60); 
                    };
        })();
        
        window.cancelAnimationFrame = (function () {
            return  window.cancelAnimationFrame ||
                    window.webkitCancelAnimationFrame ||
                    window.mozCancelAnimationFrame ||
                    window.oCancelAnimationFrame ||
                    function (id) {
                        window.clearTimeout(id);
                    };
        })();
        
        /**
        @param {Callback} callback Callback to be called for every anymation frame
        @param {Int} seconds_to_run Seconds to run the animation
        @param {Array} args Arguments to be passed to Callback when called
        */
        function Animation (callback, seconds_to_run, run_every, args) {
            this.callback = callback;
            this.seconds_to_run = seconds_to_run ? seconds_to_run * 1000 : 0;
            this.run_every = run_every || 1;
            this.args = args || [];
            
            this.animationId = null;
            this.startime = 0;
            this.elapsed_time = 0;
            this.frames_count = 0;
        }
        
        Animation.prototype.start = function start () {
            var $this = this;
            $this.startime = window.performance.now ? window.performance.now() :  Date.now();
            
            function frame (timestamp) {
                $this.elapsed_time = timestamp - $this.startime;
                //console.log($this.startime + ' : ' + timestamp + ' = ' + $this.elapsed_time);
                
                if ($this.seconds_to_run === 0 || $this.seconds_to_run > $this.elapsed_time) {
                    $this.frames_count += 1;
                    !($this.run_every - $this.frames_count) && $this.callback.apply(null, $this.args);
                    $this.animationId = requestAnimationFrame(frame);
                    $this.frames_count == $this.run_every && ($this.frames_count = 0);
                }
                
            };
            $this.animationId = requestAnimationFrame(frame);
        };
        
        Animation.prototype.stop = function stop () {
            var current_animation_id = this.animationId;
            current_animation_id && cancelAnimationFrame(current_animation_id);
            this.animationId = null;
        };
            
        return function _animate (callback, seconds_to_run, args) {
            return new Animation(callback, seconds_to_run, args);
        };
        
    })();
    
    
    var animator = (function () {
        /**
        @param {Object} el Element to animate | <circle>
        @param {Object} attrs Attributes to animate | {cx: function (args) { return value; }}}
        @param {Array} args Arguments to be passed to attrs closures used to return values
        @returns undefined
        */
        return function _animator (el, attrs, args) {
            args = args || [];
            for (var k in attrs) {
                el.setAttribute(k, attrs[k].apply(null, args));
            }
        };
    })();
    
    /**
    usage: get_next_point_on_path.bind(path)(start, is_loop)(advance)
    ex:
    var point_on_path_animation_1 = utils.animate(function (path, get_next_position) {
                                    utils.animator(
                                                    circle_1,
                                                    {
                                                        cx: function (point) {
                                                            return point.x ; 
                                                        },
                                                        cy: function (point) {
                                                            return point.y ;
                                                        }
                                                    },
                                                    [path.getPointAtLength(get_next_position(-3))]
                                                );
    }, 2, [path, utils.get_next_point_on_path.bind(path)(100, true)]);
    point_on_path_animation_1.start();
    */
    var get_next_point_on_path = (function () {
        return function (start, is_loop) {
            is_loop = is_loop === undefined ? false : is_loop;
            var pos = start || 0;
            var $this = this;
            return function (advance) {
                var total_length = $this.getTotalLength();
                pos += advance;
                if (advance > 0 && pos >= total_length) { pos = is_loop ? 0 : total_length ; }
                else if (advance < 0 && pos <= 0) { pos = is_loop ? total_length : 0; }
                return pos;
            }
        }
    })();
    
    var event = (function () {
        var listeners = {};
        function register (evt_name, callback) {
            listeners[evt_name] ? listeners[evt_name].push(callback) : listeners[evt_name] = [callback];
        }
        
        function unregister (evt_name, callback) {
            var local_log = 0,
                log_msg = 'utils.event.listeners['+evt_name+'].length: ';
            if (!listeners[evt_name]) { local_log && log.debug(log_msg + 0); return; }  
            if (!callback) { listeners[evt_name] = [];  local_log && log.debug(log_msg + listeners[evt_name].length); return;} // 
            var indexOf = listeners[evt_name].indexOf(callback);
            indexOf != -1 && listeners[evt_name].splice(indexOf, 1);
            local_log && log.debug(log_msg + listeners[evt_name].length);
        }
        function fire (evt_name, evt) {
            if (!listeners[evt_name]) { return; }
            listeners[evt_name].forEach(function(listener){
                listener(evt);
            });
        }
        return {
            register: register,
            unregister: unregister,
            fire: fire
        }
    })();
    
    return  {
        make_SVG: make_SVG,
        animate: animate,
        animator: animator,
        get_next_point_on_path: get_next_point_on_path,
        event: event,
        log: log
    }
    
})();

