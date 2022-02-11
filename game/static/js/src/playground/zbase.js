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
}