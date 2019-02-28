module.exports = function (config) {
  this.config = config;
  this.browser = null;

  this.stop = async function () {
    await this.browser.newPage();
    await this.browser.close();
  };

  this.start = async function () {
    var bot = null;
    const fs = require("fs");
    let config = this.config;
    let sqlite3 = require("sqlite3").verbose();
    let db = [];
    const puppeteer = require("puppeteer");
    const version = require("./version");
    const LOG = require("./modules/logger/types");

    let check = require("./modules/common/utils")(bot, null, config);
    if (config.ui !== true) {
      if (!fs.existsSync("./databases")) {
        fs.mkdirSync("./databases");
      }

      if (!fs.existsSync("./logs")) {
        fs.mkdirSync("./logs");
      }
    }
    db["logs"] = new sqlite3.Database(config.logdb_path);
    db["fdf"] = new sqlite3.Database(config.fdfdatabase_path);
    if (config.ui !== true) {
      await check.init_empty();
    } else if (config.ui === true) {
      config = check.fixui(config);
    }
    config = check.fixconfig(config);
    check.donate();
    check.check_updates(version.version);
    if (config.executable_path === "" || config.executable_path === false) {
      this.browser = await puppeteer.launch({
        headless: config.chrome_headless,
        args: config.chrome_options,
        defaultViewport: { "width": 1024, "height": 768 }
      });
    } else {
      this.browser = await puppeteer.launch({
        headless: config.chrome_headless,
        args: config.chrome_options,
        executablePath: config.executable_path,
        defaultViewport: { "width": 1024, "height": 768 }
      });
    }
    bot = await this.browser.newPage();
    bot.setViewport({ "width": 1024, "height": 768 });
    let user_agent = await this.browser.userAgent();
    bot.setUserAgent(user_agent.replace("Headless", ""));

    let routes = require("./routes/strategies");
    let utils = require("./modules/common/utils")(bot, this.browser, config);
    let Log = require("./modules/logger/log");
    let log = new Log("switch_mode", config);
    let login = require("./modules/mode/login.js")(bot, config, utils);
    let twofa = require("./modules/mode/2fa.js")(bot, config, utils);

    async function switch_mode() {
      let strategy = routes[config.bot_mode];
      if (strategy !== undefined) {
        await strategy(bot, config, utils, db).start();
      } else {
        log(LOG.ERROR, "switch_mode", `mode ${strategy} not exist!`);
      }
    }

    await login.start();

    if (login.is_ok()) {
      await twofa.start_twofa_location_check();
    }
    if (twofa.is_ok_nextverify()) {
      await twofa.start_twofa_location();
    }

    if (twofa.is_ok()) {
      await twofa.start_twofa_check();
    }
    if (twofa.is_ok_nextverify()) {
      await twofa.start();
    }

    if (twofa.is_ok()) {
      await switch_mode();
    }

  };

};
