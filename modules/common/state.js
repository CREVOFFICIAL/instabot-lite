const STATE = {
  OK: 1,
  ERROR: 0,
  READY: 3,
  STOP_BOT: -1,
  OK_NEXT_VERIFY: 2,
  START: null
};

const EVENTS = {
  CHANGE_STATUS: "change_status"
};

const event_emitter = require("events").EventEmitter;
class Manager_state extends event_emitter {
  constructor(params) {
    super(params);
    this._status = STATE.START;
    this.register_handler();
  }

  register_handler() {
    this.on(EVENTS.CHANGE_STATUS, (status) => {
      this._status = status;
      console.log(status + "changed")
    });
  }

  get_status() {
    return this._status;
  }

  is_ready() {
    return this._status === STATE.READY;
  }

  is_not_ready() {
    return this._status !== STATE.READY;
  }

  is_ok() {
    return this._status === STATE.OK;
  }

  is_error() {
    return this._status === STATE.ERROR;
  }

  is_stop_bot() {
    return this._status === STATE.STOP_BOT;
  }

  is_ok_nextverify() {
    return this._status === STATE.OK_NEXT_VERIFY;
  }

  is_start() {
    return this._status === STATE.START;
  }
}

module.exports = {
  STATE: STATE,
  EVENTS: EVENTS,
  Manager_state: Manager_state
};
