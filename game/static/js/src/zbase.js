export class Ball_battling {
    constructor(id, BBOS) {
        this.id = id;
        this.$bb_game = $('#' + id);

        this.BBOS = BBOS;
        this.menu = new Ball_battling_Menu(this);
        this.playground = new Ball_battling_Playground(this);
        this.settings = new Settings(this);

        this.start();
    }

    start() {

    }
}