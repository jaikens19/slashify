const router = require("express").Router();
const asyncHandler = require("express-async-handler");

const { Like } = require("../../db/models");

router.get(
  "/likes/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { type } = req.query;
    if (id) {
      const where = { userId: id };

      if (type) where.type = type;

      const likes = await Like.findAll({
        where,
      });

      res.json(
        Object.assign(
          ...likes.map((like) => {
            return {
              [like.spotId]: {
                type: like.type,
              },
            };
          })
        )
      );
    }
  })
);

router.post(
  "/likes",
  asyncHandler(async (req, res) => {
    const { userId, type, spotId } = req.body;

    if ((userId, type, spotId)) {
      try {
        const like = await Like.create({ userId, type, spotId });
        res.json(like);
      } catch (error) {
        res.json(error);
      }
    }
  })
);

router.delete(
  "/likes/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId };

    if (id || userId) {
      try {
        const likes = await Like.destroy({
          where: {
            userId,
            spotId: id,
          },
        });

        res.json(likes);
      } catch (error) {
          res.json(error)
      }
    }
  })
);

module.exports = router;
