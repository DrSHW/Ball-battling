export class Ball_battling {
    constructor(id) {
        this.id = id;
        this.$bb_game = $('#' + id);
        // this.menu = new Ball_battling_Menu(this);
        this.playground = new Ball_battling_Playground(this);

        this.start();
    }

    start() {

    }
}