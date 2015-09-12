import BaseCommand from "./BaseCommand";
import CommandState from "./CommandState.js";
//import DebugCommand from "./DebugCommand";


export default class CommandQueue {
    constructor(phaserApp) {
        this.phaserApp = phaserApp;
        this.game = phaserApp.game;
        this.state = CommandState.NOT_STARTED;
        this.currentCommand = null;

        this.commandList_ = [];
    }

    addCommand(command) {
        this.commandList_.push(command);
    }

    pushBackCommand(command) {
        this.commandList_.push(command);
    }

    pushFrontCommand(command) {
        this.commandList_.unshift(command);
    }

    begin() {
        this.state = CommandState.WORKING;
        console.log("Debug Queue: BEGIN");
    }

    reset() {
        this.state = CommandState.NOT_STARTED;
        this.commandList_ = [];
    }

    tick() {
        // do stuff
        
        if (this.state === CommandState.WORKING ) {

            if (this.currentCommand == null) {
                if(this.commandList_.length === 0) {
                    this.state = CommandState.SUCCESS;
                    return;
                }
                this.currentCommand = this.commandList_.shift();
            }

            if (!this.currentCommand.isStarted()) {
                this.currentCommand.begin();
            } else {
                this.currentCommand.tick();
            }

            // check if command is done 
            if (this.currentCommand.isSucceeded()) {
                this.currentCommand = null;
            } else if (this.currentCommand.isFailed()) {
                this.state = CommandState.FAILURE;
            } 

        }
    };

    /**
     * Whether the command has started working.
     * @returns {boolean}
     */
    isStarted() {
        return this.state !== CommandState.NOT_STARTED;
    }

    /**
     * Whether the command has succeeded or failed, and is
     * finished with its work.
     * @returns {boolean}
     */
    isFinished() {
        return this.isSucceeded() || this.failed();
    }
    
    /**
     * Whether the command has finished with its work and reported success.
     * @returns {boolean}
     */
    isSucceeded() {
        return this.state === CommandState.SUCCESS;
    }

    /**
     * Whether the command has finished with its work and reported failure.
     * @returns {boolean}
     */
    isFailed() {
        return this.state === CommandState.FAILURE;
    }
}

