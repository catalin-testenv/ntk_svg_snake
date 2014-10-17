'use strict';
(function () {
    
    var svg = document.querySelector('svg');
    var container = document.querySelector('#container');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    
    function set_dimensions () {
        container.style.width = CONFIG.DOC_WIDTH + 'px';
        container.style.height = CONFIG.DOC_HEIGHT + 'px' ;
        svg.setAttribute('viewBox', '0 0 '+CONFIG.APP_VIEWBOX_WIDTH+' '+CONFIG.APP_VIEWBOX_HEIGHT+'');
    }
    
    
    var make_game_area = (function () {
        var game_area;
        return function () {
            game_area && game_area.remove();
            game_area = undefined;
            game_area = utils.make_SVG('svg', {id:"svg_game_area", x: CONFIG.GAME_AREA_X, y: CONFIG.GAME_AREA_Y, width: CONFIG.GAME_AREA_WIDTH, height: CONFIG.GAME_AREA_HEIGHT});
            game_area.appendChild(utils.make_SVG('use', {x: 0, y: 0, width: '100%', height: '100%', "xlink:href":"#symbol_simple_rect"}));
            svg.appendChild(game_area);
            return game_area;
        }
    })();
    
    var make_controller_area = (function () {
        var controller_area;
        return function () {
            if (!CONFIG.DISPLAY_CONTROLLER) { return; }
            var CONTROLLER_AREA_WIDTH = CONFIG.NON_GAME_2_SIZE;
            var CONTROLLER_AREA_HEIGHT = CONFIG.NON_GAME_2_SIZE ;
            var CONTROLLER_AREA_X = CONFIG.HOW_HANDED == 'right' ? CONFIG.APP_VIEWBOX_WIDTH - CONTROLLER_AREA_WIDTH : 0;
            var CONTROLLER_AREA_Y = CONFIG.APP_VIEWBOX_HEIGHT - CONTROLLER_AREA_HEIGHT;
            
            controller_area && controller_area.remove();
            controller_area = undefined;
            controller_area = utils.make_SVG('svg', {id:"svg_controller_area", x: CONTROLLER_AREA_X, y: CONTROLLER_AREA_Y, width: CONTROLLER_AREA_WIDTH, height: CONTROLLER_AREA_HEIGHT});
            //controller_area.appendChild(utils.make_SVG('use', {x: 0, y: 0, width: '100%', height: '100%', "xlink:href":"#symbol_simple_rect"}));
            controller_area.appendChild(utils.make_SVG('use', {x: 0, y: 0, width: '100%', height: '100%', "xlink:href":"#controller"}));
            svg.appendChild(controller_area);
            return controller_area;
        }
    })();
    
    var make_info_area = (function () {
        var info_area;
        return function () {
            if (CONFIG.ORIENTATION == 'portrait') {
                var INFO_AREA_HEIGHT = CONFIG.NON_GAME_2_SIZE;
                var INFO_AREA_WIDTH = CONFIG.APP_VIEWBOX_WIDTH - (CONFIG.DISPLAY_CONTROLLER ? CONFIG.NON_GAME_2_SIZE : 0);
                var INFO_AREA_X = CONFIG.HOW_HANDED == 'right' ? 0 : (CONFIG.DISPLAY_CONTROLLER ? CONFIG.NON_GAME_2_SIZE : 0);
                var INFO_AREA_Y = CONFIG.APP_VIEWBOX_HEIGHT - INFO_AREA_HEIGHT;
            }
            else {
                var INFO_AREA_HEIGHT = CONFIG.APP_VIEWBOX_HEIGHT -  CONFIG.NON_GAME_1_SIZE - (CONFIG.DISPLAY_CONTROLLER ? CONFIG.NON_GAME_2_SIZE  : 0);
                var INFO_AREA_WIDTH = CONFIG.NON_GAME_2_SIZE;
                var INFO_AREA_X = CONFIG.HOW_HANDED == 'right' ? CONFIG.APP_VIEWBOX_WIDTH - INFO_AREA_WIDTH : 0;
                var INFO_AREA_Y = CONFIG.NON_GAME_1_SIZE;
            }
            
            info_area && info_area.remove();
            info_area = undefined;
            info_area = utils.make_SVG('svg', {id:"svg_info_area", x: INFO_AREA_X, y: INFO_AREA_Y, width: INFO_AREA_WIDTH, height: INFO_AREA_HEIGHT});
            info_area.appendChild(utils.make_SVG('use', {x: 0, y: 0, width: '100%', height: '100%', "xlink:href":"#symbol_simple_rect"}));
            svg.appendChild(info_area);
            return info_area;
        }
    })();
    
    var make_snake_head = (function(){
        var SIZE = CONFIG.SNAKE_CHAIN_SIZE;
        var snake_head;
        return function (game_area) {
            snake_head  && snake_head.remove();
            snake_head = undefined;
            snake_head = utils.make_SVG('svg', {id:"svg_snake_head", x: 0, y: 0, width: SIZE, height: SIZE});
            snake_head.appendChild(utils.make_SVG('use', {x: 0, y: 0, width: '100%', height: '100%', "xlink:href":"#symbol_svg_chain"}))
            game_area.appendChild(snake_head);
            return snake_head;
        }
    })();
    
    function render_game_page() {
        var game_area = make_game_area();
        var controller_area = make_controller_area();
        var info_area = make_info_area();
        var snake_head = make_snake_head(game_area);
        app.run_game({snake_head: snake_head});
    }
    
    function bootstrap () {
        set_dimensions ();
        switch (CONFIG.APP_PAGE) {
            case 'game':
                render_game_page();
                break;
        }
        
    }
    
    window.addEventListener('resize', function(evt){
        bootstrap ();
    });
    
    bootstrap ();
    
})();
