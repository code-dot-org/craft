import CommandState from "./CommandState.js";
import BaseCommand from "./BaseCommand.js";

export default class RepeatCommand extends BaseCommand {
  constructor(gameController, highlightCallback, actionCallback, targetEntity, iteration) {
    super(gameController, highlightCallback, targetEntity);
    this.actionCallback = actionCallback;
    this.iteration = iteration;
  }

  tick() {
    // do stuff
  }

  begin() {
    super.begin();
    this.succeeded();
    this.addRepeatCommand();
    }      

    addRepeatCommand()
    {
        var entity = this.GameController.levelEntity.entityMap.get(this.target);
        entity.queue.addRepeatCommands(this.actionCallback,this.iteration);
    }
}

