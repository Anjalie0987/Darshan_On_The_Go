const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function test() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:3001/api/v1/auth/admin/login', {
      email: 'admin@darshanonthego.com',
      password: 'admin_password123'
    });
    const token = loginRes.data.data.accessToken;
    console.log('Got token');

    // 2. Put to the edit endpoint using the mock ID
    const form = new FormData();
    form.append('name', 'Test Update');
    form.append('slug', 'test-update');
    form.append('state', 'Delhi');
    form.append('city', 'delhi');
    form.append('category', 'Shakti Peeth');
    form.append('isActive', 'true');

    const putRes = await axios.put('http://localhost:3001/api/v1/admin/temples/0a51f3bc-6eeb-4213-a45f-0e0c18c8ea6f', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('PUT success:', putRes.status, putRes.data);
  } catch (e) {
    console.error('ERROR STATUS:', e.response?.status);
    console.error('ERROR DATA:', JSON.stringify(e.response?.data, null, 2));
  }
}
test();
