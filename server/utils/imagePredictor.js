const TeachableMachine = require("@sashido/teachablemachine-node");

const model = new TeachableMachine({
  modelUrl: "https://teachablemachine.withgoogle.com/models/UOr4hlqlP/",
});

module.exports = (req, res, next) => {
  const { imgUrl } = req.body;
  model
    .classify({
      imageUrl: imgUrl,
    })
    .then((predictions) => {
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
