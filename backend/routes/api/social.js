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
        likes.length > 0 ?
        Object.assign(
          ...likes.map((like) => {
            return {
              [like.spotId]: {
                type: like.type,
              },
            };
          })
        )
        : {}
      );
    }
  })
);

router.post(
  "/likes",
  asyncHandler(async (req, res) => {
    const { userId, type, spotId } = req.body;

    if ((userId && type && spotId)) {
      try {
        const like = await Like.create({ userId, type, spotId });
        res.status(200).json({[spotId]: { type }});
      } catch (error) {
        res.status(500).json(error);
      }
    } else res.status(400).json({message: 'MISSING "USERID", "TYPE" and/or "SPOTID"'})
  })
);

router.delete(
  "/likes/:spotId",
  asyncHandler(async (req, res) => {
    const { spotId } = req.params;
    const { userId } = req.body

    if (spotId && userId) {
      try {
        const likes = await Like.destroy({
          where: {
            userId,
            spotId
          },
        });

        res.status(likes > 0 ? 200 : 204).json({status:`SUCCESSFULLY deleted ${likes} entries`, spotId});
      } catch (error) {
          res.status(500).json({error})
      }
    } else res.status(400).json({message: 'MISSING "id" and or userid'})
  })
);

module.exports = router;
