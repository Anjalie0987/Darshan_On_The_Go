const axios = require('axios');
(async () => {
  try {
    const login = await axios.post('http://localhost:3001/api/v1/admin/auth/login', {
      email: 'darshanonthego88@gmail.com',
      password: 'Darshanonthego@2026'
    });
    const token = login.data.data.accessToken;
    console.log('Login successful');
    const res = await axios.post('http://localhost:3001/api/v1/admin/temples', {
      name: 'Test Temple 2',
      slug: 'test-temple-2',
      description: 'Test description',
      state: 'Jammu & Kashmir',
      city: 'Jammu',
      category: 'Other',
      youtubeChannelUrl: 'https://www.youtube.com/@test'
    }, {
      headers: { Authorization: 'Bearer ' + token }
    });
    console.log(res.status, res.data);
  } catch(e) { console.error(e.response?.status, e.response?.data); }
})();
