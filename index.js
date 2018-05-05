const fixPath = require("fix-path");

var createSbot = require("scuttlebot")
  .use(require("scuttlebot/plugins/master"))
  .use(require("scuttlebot/plugins/gossip"))
  .use(require("scuttlebot/plugins/replicate"))
  .use(require("ssb-friends"))
  .use(require("ssb-blobs"))
  .use(require("ssb-backlinks"))
  .use(require("ssb-private"))
  .use(require("scuttlebot/plugins/invite"))
  .use(require("scuttlebot/plugins/local"))
  .use(require("scuttlebot/plugins/logging"))
  .use(require("ssb-query"))
  .use(require("ssb-about"))
  .use(require("ssb-search"))
  .use(require("ssb-ws"))
  // .use(require('ssb-ebt')) // enable at your own risk!
  .use(require("./sbot"));

fixPath();

module.exports = function (ssbConfig) {
  var context = {
    sbot: createSbot(ssbConfig),
    config: ssbConfig
  }
  ssbConfig.manifest = context.sbot.getManifest()
  fs.writeFileSync(Path.join(ssbConfig.path, 'manifest.json'), JSON.stringify(ssbConfig.manifest))

  // attempt to run git-ssb if it is installed and in path
  var gitSsb = spawn('git-ssb', [ 'web' ], {
    stdio: 'inherit'
  })
  gitSsb.on('error', () => {
    console.log('git-ssb is not installed, or not available in path')
  })
  process.on('exit', () => {
    gitSsb.kill()
  })
}
