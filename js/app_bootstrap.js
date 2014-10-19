'use strict';
(function () {
    
    var svg = document.querySelector('svg');
    var container = document.querySelector('#container');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Disables visual
    svg.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
    // Disables menu
    svg.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
    
    
    function set_dimensions () {
        container.style.width = CONFIG.DOC_WIDTH + 'px';
        container.style.height = CONFIG.DOC_HEIGHT + 'px' ;
        svg.setAttribute('viewBox', '0 0 '+CONFIG.APP_VIEWBOX_WIDTH+' '+CONFIG.APP_VIEWBOX_HEIGHT+'');
    }
    
    var make_game_area = (function () {
        var game_area;
        return function () {
            game_area = svg.querySelector('#svg_game_area');
            game_area.x.baseVal.value = CONFIG.GAME_AREA_X;
            game_area.y.baseVal.value = CONFIG.GAME_AREA_Y;
            game_area.width.baseVal.value = CONFIG.GAME_AREA_WIDTH;
            game_area.height.baseVal.value = CONFIG.GAME_AREA_HEIGHT;
            game_area.style.display = 'block';
            return game_area;
        }
    })();
    
    var make_controller_area = (function () {
        var controller_area;
        return function () {
            if (!CONFIG.DISPLAY_CONTROLLER) { return controller_area; }
            var CONTROLLER_AREA_WIDTH = CONFIG.NON_GAME_2_SIZE;
            var CONTROLLER_AREA_HEIGHT = CONFIG.NON_GAME_2_SIZE ;
            var CONTROLLER_AREA_X = CONFIG.HOW_HANDED == 'right' ? CONFIG.APP_VIEWBOX_WIDTH - CONTROLLER_AREA_WIDTH : 0;
            var CONTROLLER_AREA_Y = CONFIG.APP_VIEWBOX_HEIGHT - CONTROLLER_AREA_HEIGHT;

            var controller_area = svg.querySelector('#svg_controller_area');
            controller_area.x.baseVal.value = CONTROLLER_AREA_X;
            controller_area.y.baseVal.value = CONTROLLER_AREA_Y;
            controller_area.width.baseVal.value = CONTROLLER_AREA_WIDTH;
            controller_area.height.baseVal.value = CONTROLLER_AREA_HEIGHT;
            controller_area.style.display = 'block';
            return controller_area;
        }
    })();
    
    var make_small_info_area = (function () {
        var small_info_area;
        return function () {
            
            var SMALL_INFO_AREA_HEIGHT = CONFIG.NON_GAME_1_SIZE;
            var SMALL_INFO_AREA_WIDTH = CONFIG.APP_VIEWBOX_WIDTH ;
            var SMALL_INFO_AREA_X = 0;
            var SMALL_INFO_AREA_Y = 0;
            
            
            var small_info_area = svg.querySelector('#svg_small_info_area');
            small_info_area.x.baseVal.value = SMALL_INFO_AREA_X;
            small_info_area.y.baseVal.value = SMALL_INFO_AREA_Y;
            small_info_area.width.baseVal.value = SMALL_INFO_AREA_WIDTH;
            small_info_area.height.baseVal.value = SMALL_INFO_AREA_HEIGHT;
            small_info_area.style.display = 'block';
            return small_info_area;
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
            
            var info_area = svg.querySelector('#svg_info_area');
            info_area.x.baseVal.value = INFO_AREA_X;
            info_area.y.baseVal.value = INFO_AREA_Y;
            info_area.width.baseVal.value = INFO_AREA_WIDTH;
            info_area.height.baseVal.value = INFO_AREA_HEIGHT;
            info_area.style.display = 'block';
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
        make_controller_area();
        make_small_info_area();
        make_info_area();
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
