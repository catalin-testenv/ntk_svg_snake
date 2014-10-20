'use strict';
/**
depends:  utils.event
handles: controller events
*/
(function () {

    var UNDEFINED_EVENT = function () { return {direction:undefined}; };
    var events = [];
    var last_event = UNDEFINED_EVENT();
    
    document.documentElement.addEventListener('keydown', function (evt) {
        var event_obj = UNDEFINED_EVENT();
        var key = evt.keyCode;
        [37,65,   38,87,   39,68,  40,83].indexOf(key) != -1 && evt.preventDefault();
        switch (key) {
            case 37:
            case 65:
                event_obj.direction  = 'left';
                break;
            case 38:
            case 87:
                event_obj.direction  = 'up';
                break;
            case 39:
            case 68:
                event_obj.direction = 'right';
                break;
            case 40:
            case 83:
                event_obj.direction = 'down';
                break;
        }
        if(event_obj.direction && event_obj.direction != last_event.direction) {
            utils.event.fire('controller_event', event_obj);
            events.push(event_obj);
            last_event = event_obj;
        }
    });
    
    document.documentElement.addEventListener('keyup', function (evt) {
        var event_obj = UNDEFINED_EVENT();
        var key = evt.keyCode;
        [37,65,   38,87,   39,68,  40,83].indexOf(key) != -1 && evt.preventDefault();
        switch (key) {
            case 37:
            case 65:
                event_obj.direction  = 'left';
                break;
            case 38:
            case 87:
                event_obj.direction  = 'up';
                break;
            case 39:
            case 68:
                event_obj.direction  = 'right';
                break;
            case 40:
            case 83:
                event_obj.direction = 'down';
                break;
        }
        if (events.length) {
            var _last_event = events.pop();
            if (event_obj.direction == last_event.direction) {
                if (events.length) {
                    var to_fire = events[events.length-1];
                    utils.event.fire('controller_event', to_fire);
                    last_event = to_fire;
                }
                else {
                    //last_event = UNDEFINED_EVENT();
                }
            }
        }
    });
    
    
    var info_text = document.querySelector('#info_text') || {};
    
    var hammered_game_area = new Hammer(document.querySelector('#svg_game_area'), {});
    hammered_game_area.get('swipe').set({ direction: Hammer.DIRECTION_ALL, velocity: 0.2 });
    hammered_game_area.on('swipeleft swiperight swipeup swipedown', function(evt) {
        evt.preventDefault();
        var event = evt.type;
        info_text.textContent = event;
        var new_event = UNDEFINED_EVENT();
        switch (event) {
                case 'swipeup':
                    new_event.direction = 'up';
                    break;
                case 'swiperight':
                    new_event.direction = 'right';
                    break;
                case 'swipedown':
                    new_event.direction = 'down';
                    break;
                case 'swipeleft':
                    new_event.direction = 'left';
                    break;
            }
            console.log(new_event);
            utils.event.fire('controller_event', new_event);
    });
    
    
    Array.prototype.slice.call(document.querySelectorAll('#controller use'), 0).forEach(function(el){
        var hammered_controller_element = new Hammer(el, {});
        hammered_controller_element.on('tap', function (evt) {
            evt.preventDefault();
            var event = evt.target.id;
            info_text.textContent = event;
            var new_event = UNDEFINED_EVENT();
            switch (event) {
                case 'controller_side_up':
                    new_event.direction = 'up';
                    break;
                case 'controller_side_right':
                    new_event.direction = 'right';
                    break;
                case 'controller_side_down':
                    new_event.direction = 'down';
                    break;
                case 'controller_side_left':
                    new_event.direction = 'left';
                    break;
            }
            console.log(new_event);
            utils.event.fire('controller_event', new_event);
        });
    });
        
})();


var app = (function () {

    var make_game = (function () {

        function game (elements) {
            var snake_head = elements.snake_head;
            //utils.log.debug(snake_head);
            var animation;
            var last_event;
            
            return function (evt) {
                if (last_event) {
                    var
                    evt_direction = evt.direction,
                    last_event_direction = last_event.direction;
                    if      (evt_direction == 'up'   && last_event_direction == 'down')  { return; }
                    else if (evt_direction == 'down'  && last_event_direction == 'up')   { return; }
                    else if (evt_direction == 'left'  && last_event_direction == 'right') { return; }
                    else if (evt_direction == 'right' && last_event_direction == 'left')  { return; }
                }
                last_event = evt;
                
                animation && animation.stop();
                
                var rot_point_x = snake_head.firstChild.x.baseVal.value + snake_head.firstChild.width.baseVal.value/2;
                var rot_point_y = snake_head.firstChild.y.baseVal.value + snake_head.firstChild.height.baseVal.value/2;
                var rot_ang = (evt.direction == 'top' ? 0 : evt.direction == 'right' ? 90 : evt.direction == 'down' ? 180 : evt.direction == 'left' ? -90 : 0)
                snake_head.firstChild.setAttribute("transform", "rotate("+rot_ang+" "+rot_point_x+" "+rot_point_y+")");
                
                animation = utils.animate(function(){
                    utils.animator(snake_head,    {
                                            x: function(evt){
                                                return snake_head.x.baseVal.value + (evt.direction == 'left' ? -snake_head.width.baseVal.value : evt.direction == 'right' ? snake_head.width.baseVal.value : 0);
                                            },
                                            y: function(evt){
                                                return snake_head.y.baseVal.value + (evt.direction == 'down' ? snake_head.height.baseVal.value : evt.direction == 'up' ? -snake_head.height.baseVal.value : 0);
                                            }
                                        }, [evt]);
                }, 0, CONFIG.GAME_SPEED);
                animation.start();
            }
        };
        return game;
    })();
    
    function run_game (elements) {
        var game = make_game(elements);
        utils.event.unregister('controller_event');
        utils.event.register('controller_event', game);
    }
    
    return  {
        run_game: run_game
    }
      
})();
    
