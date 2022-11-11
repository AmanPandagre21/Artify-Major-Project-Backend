const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/UOr4hlqlP/",
});

module.exports = (req, res, imgUrl, callback) => {
  model
    .classify({
      imageUrl: imgUrl,
    })
    .then((predictions) => {
      callback(null, predictions);
      res.json({
        success: true,
        predictions,
      });
    })
    .catch((e) => {
      res.json({
        success: false,
        message: e,
      });
    });
};
