const supabase = require('../config/database');

class User {
  static async findOrCreate(name, email) {    try {
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }

      if (existingUser) {
        return existingUser;      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding or creating user: ${error.message}`);
    }  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
  // Get user by email
  static async getByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }
}

module.exports = User;
