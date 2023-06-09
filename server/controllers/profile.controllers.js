const { User, Rating, sequelize } = require('../db/models');

exports.GetUser = async (req, res) => {
  const {
    id, name, surname, email, bio,
  } = req.body;

  try {
    const profile = await User.update(
      {
        userpic: req.body.user.avatar,
        name: req.body.user.name,
        surname: req.body.user.surname,
        email: req.body.user.email,
        bio: req.body.user.bio,
      },
      {
        where: { id: req.body.user.id },
        returning: true,
        plain: true,
      },
    );

    res.json(profile);
  } catch (error) {
    console.log('User: ', error);
    res.status(501).json({ err: 'something wrong with the Db :(' });
  }
};

exports.findUser = async (req, res) => {
  const { user } = req.session;

  try {
    const userRecord = await User.findOne({
      attributes: ['id', 'name', 'surname', 'email', 'bio', 'userpic', 'cash'],
      where: { id: user.id },
      returning: true,
      plain: true,
    });

    const data = delete userRecord.password;

    console.log(userRecord, '++++++++++++HERE');

    res.json(userRecord);
  } catch (error) {
    console.log('User: ', error);
    res.status(501).json({ err: 'something wrong with the Db :(' });
  }
};

exports.FindCurrentUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId, 'req params');

  try {
    const currentUser = await User.findOne(
      {
        where: { id: userId },
        returning: true,
        plain: true,
      },
    );

    const result = delete currentUser.password;

    const averageRating = await Rating.findAll({
      attributes: ['expertId',
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
      ],
      where: { expertId: userId },
      group: ['expertId'],
      raw: true,
      nested: true,
    });
    console.log(averageRating, '=====>averageRating');
    // { averageRating: averageRating?.at(0)?.averageRating }

    res.json({ currentUser, averageRating });
  } catch (error) {
    res.status(501).json({ err: 'something wrong with the Db :(' });
  }
};

exports.findUserInfo = async (req, res) => {
  const { user } = req.session;

  try {
    const userInfo = await User.findOne({
      attributes: ['id', 'name', 'surname', 'email', 'bio', 'userpic', 'cash'],
      where: { id: user.id },
      returning: true,
      plain: true,
    });

    const data = delete userInfo.password;

    res.json(userInfo);
  } catch (error) {
    console.log('User: ', error);
    res.status(501).json({ err: 'something wrong with the Db :(' });
  }
};
