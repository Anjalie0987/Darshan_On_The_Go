import { Client } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:post123@localhost:5433/darshan',
  });

  try {
    await client.connect();
    console.log('Connected to the database.');

    const email = 'darshanonthego88@gmail.com';
    const password = 'Darshanonthego@2026';
    const name = 'Super Admin';
    const role = 'SUPER_ADMIN';

    // Check if admin already exists
    const existingAdmin = await client.query('SELECT * FROM admins WHERE email = $1', [email]);
    
    if (existingAdmin.rows.length > 0) {
      console.log(`Admin with email ${email} already exists. Skipping.`);
      return;
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert admin
    const insertQuery = `
      INSERT INTO admins (email, password_hash, name, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, name, role
    `;
    
    const result = await client.query(insertQuery, [email, passwordHash, name, role, true]);
    
    console.log('Successfully seeded admin:');
    console.log(result.rows[0]);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

seedAdmin();
