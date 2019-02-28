class Slack {
  constructor(config) {
    this.TYPE = require("./../types");
    this.config = config;
    this.request = require("request");
    this.webhook = this.config.log.channels.slack.webhook;
  }

  log(type, func, message) {
    let body = "";
    switch (type) {
      case this.TYPE.INFO:
        body = this.info(type, func, message);
        break;
      case this.TYPE.WARNING:
        body = this.warning(type, func, message);
        break;
      case this.TYPE.ERROR:
        body = this.error(type, func, message);
        break;
      case this.TYPE.DEBUG:
        body = this.debug(type, func, message);
        break;
      default:
        console.error("[SLACK LOG] Type log not found!");
    }
    this.post_log(body);
  }

  post_log(body) {
    this.request.post(
      this.webhook,
      body,
      function (error) {
        if (error) {
          console.error(error);
        }
      }
    );
  }

  info(type, func, message) {
    return {
      json: {
        "attachments": [{
          text: `${type} ${func}: ${message}`,
          color: "good"
        }]
      },
    };
  }

  warning(type, func, message) {
    return {
      json: {
        "attachments": [{
          text: `${type} ${func}: ${message}`,
          color: "warning"
        }]
      },
    };
  }

  error(type, func, message) {
    return {
      json: {
        "attachments": [{
          text: `${type} ${func}: ${message}`,
          color: "danger"
        }]
      },
    };
  }

  debug(type, func, message) {
    return {
      json: {
        "attachments": [{
          text: `${type} ${func}: ${message}`,
          color: "#005dff"
        }]
      },
    };
  }
}

module.exports = config => new Slack(config);
