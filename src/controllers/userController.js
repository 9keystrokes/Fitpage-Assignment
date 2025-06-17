const User = require('../models/User');

class UserController {
  // Create or find user
  static async createOrFindUser(req, res) {
    try {
      const { name, email } = req.body;
      
      const user = await User.findOrCreate(name, email);
      
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
      });
    } catch (error) {
      console.error('Error creating/finding user:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }  }
}

module.exports = UserController;
