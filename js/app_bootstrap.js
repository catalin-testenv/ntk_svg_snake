'use strict';
(function () {
    
    var svg = document.querySelector('#main');
    var ads_area = document.querySelector('#ads_area');
    var container = document.querySelector('#container');
    svg.setAttribute('preserveAspectRatio', 'none');
    
    // Disables visual
    svg.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
    // Disables menu
    svg.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);
    
    
    function set_dimensions () {
        //utils.info('d_width:' + CONFIG.DOC_WIDTH + ', d_height:' + CONFIG.DOC_HEIGHT + ', g_width:' + CONFIG.GAME_AREA_WIDTH + ', g_height:' + CONFIG.GAME_AREA_HEIGHT + ', w_reminder: ' + CONFIG.GAME_WIDTH_REMINDER + ', h_reminder: ' + CONFIG.GAME_HEIGHT_REMINDER);
        container.style.width = CONFIG.APP_VIEWBOX_WIDTH+'px';
        container.style.height = CONFIG.DOC_HEIGHT+'px' ;
        svg.style.width = CONFIG.APP_VIEWBOX_WIDTH+'px';
        svg.style.height = CONFIG.APP_VIEWBOX_HEIGHT+'px';
        svg.setAttribute('viewBox', '0 0 '+CONFIG.APP_VIEWBOX_WIDTH+' '+CONFIG.APP_VIEWBOX_HEIGHT+'');
        ads_area.style.height = CONFIG.ADS_AREA_HEIGHT+'px';
    }
    
    var make_info_area = (function () {
        var info_area;
        return function () {
            var INFO_AREA_X = 0;
            var INFO_AREA_Y = 0;
            var INFO_AREA_WIDTH = CONFIG.APP_VIEWBOX_WIDTH ;
            var INFO_AREA_HEIGHT = CONFIG.INFO_AREA_HEIGHT;

            var info_area = svg.querySelector('#svg_info_area');
            info_area.x.baseVal.value = INFO_AREA_X;
            info_area.y.baseVal.value = INFO_AREA_Y;
            info_area.width.baseVal.value = INFO_AREA_WIDTH;
            info_area.height.baseVal.value = INFO_AREA_HEIGHT;
            info_area.style.display = 'block';
            return info_area;
        }
    })();
    
    var make_game_area = (function () {
        var game_area;
        return function () {
            var GAME_AREA_X = CONFIG.GAME_AREA_X;
            var GAME_AREA_Y = CONFIG.GAME_AREA_Y;
            var GAME_AREA_WIDTH = CONFIG.GAME_AREA_WIDTH ;
            var GAME_AREA_HEIGHT = CONFIG.GAME_AREA_HEIGHT;

            game_area = svg.querySelector('#svg_game_area');
            game_area.x.baseVal.value = GAME_AREA_X;
            game_area.y.baseVal.value = GAME_AREA_Y;
            game_area.width.baseVal.value = GAME_AREA_WIDTH;
            game_area.height.baseVal.value = GAME_AREA_HEIGHT;
            game_area.style.display = 'block';
            return game_area;
        }
    })();

    var make_snake_head = (function(){
        var SIZE = CONFIG.GRID_UNIT;
        var snake_head;
        return function (game_area) {
            snake_head  && snake_head.remove();
            snake_head = undefined;
            snake_head = utils.make_SVG('svg', {id:"svg_snake_head", x: 0, y: 0, width: SIZE, height: SIZE});
            var snake_head_child = utils.make_SVG('use', {x: 0, y: 0, width: '100%', height: '100%', "xlink:href":"#symbol_svg_head"});
            
            // DEBUG
            var snake_head_child_hammered = new Hammer(snake_head_child, {});
            snake_head_child_hammered.on('tap', function(evt) {
                utils.info('tapped');
                utils.log.debug('tapped');
            });
            
            
            snake_head.appendChild(snake_head_child)
            game_area.appendChild(snake_head);
            return snake_head;
        }
    })();
    
    function render_game_page() {
        make_info_area();
        var game_area = make_game_area();
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
