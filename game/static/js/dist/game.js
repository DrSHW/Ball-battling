class Ball_battling_Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
        <div class="bb-game-menu">
            <div class="bb-game-menu-field">
                <div class="bb-game-menu-field-item bb-game-menu-field-item-solo-mode">
                    单人模式
                </div>
                <br>
                <div class="bb-game-menu-field-item bb-game-menu-field-item-muti-mode">
                    多人模式
                </div>
                <br>
                <div class="bb-game-menu-field-item bb-game-menu-field-item-settings">
                    设置
                </div>
                <br>
            </div>
        </div>
        `);
        this.root.$bb_game.append(this.$menu);
        this.$solo_mode = this.$menu.find('.bb-game-menu-field-item-solo-mode');
        this.$muti_mode = this.$menu.find('.bb-game-menu-field-item-muti-mode');
        this.$settings = this.$menu.find('.bb-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let self = this;
        this.$solo_mode.click(function(){
            self.hide();
            self.root.playground.show();
        });
        this.$muti_mode.click(function(){
            console.log("2");
        });
        this.$settings.click(function(){
            console.log("3");
        });
    }
    
    show() {    // 显示 menu 界面
        this.$menu.show();
    }

    hide() {    // 隐藏 menu 界面
        this.$menu.hide();
    }
}
class Ball_battling_Playground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
        <div>游戏界面</div>
        `);

        this.hide();
        this.root.$bb_game.append(this.$playground);

        this.start();
    }

    start() {
        
    }

    show() {    // 显示 playground 界面
        this.$playground.show();
    }

    hide() {    // 隐藏 playground 界面
        this.$playground.hide();
    }
}class Ball_battling {
    constructor(id) {
        this.id = id;
        this.$bb_game = $('#' + id);
        this.menu = new Ball_battling_Menu(this);
        this.playground = new Ball_battling_Playground(this);

        this.start();
    }

    start() {

    }
}