async function testAdminLogin() {
  try {
    const loginResponse = await fetch('http://localhost:3001/api/v1/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@darshan.com',
        password: 'Admin123!',
      }),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Login failed with status ${loginResponse.status}: ${errorText}`);
    }

    const loginData = await loginResponse.json();
    console.log('Login Response Status:', loginResponse.status);
    console.log('Login successful.');
    console.log('Login Data:', loginData);
    
    const token = loginData.data.accessToken;
    console.log('Token string:', token);
    const decoded = require('jsonwebtoken').decode(token);
    console.log('Decoded Token:', decoded);

    const meResponse = await fetch('http://localhost:3001/api/v1/admin/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!meResponse.ok) {
      const errorText = await meResponse.text();
      throw new Error(`Me API failed with status ${meResponse.status}: ${errorText}`);
    }

    const meData = await meResponse.json();
    console.log('Me Response Status:', meResponse.status);
    console.log('Admin Profile Data:', meData.data);
    console.log('Successfully verified backend admin authentication.');
  } catch (error: any) {
    console.error('Authentication test failed:', error.message);
  }
}

testAdminLogin();
