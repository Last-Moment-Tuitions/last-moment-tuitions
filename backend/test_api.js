const baseUrl = process.env.API_URL || 'http://localhost:3000';

const request = async (path, payload) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  return { status: res.status, body };
};

const main = async () => {
  console.log('--- TESTING API ---');
  console.log(`Base URL: ${baseUrl}`);

  const rand = Math.floor(Math.random() * 10000);
  const user = {
    firstName: 'Test',
    lastName: `User${rand}`,
    email: `testuser${rand}@example.com`,
    phone: `123456${rand}`,
    password: 'password123'
  };

  console.log(`\n1. Testing Registration for: ${user.email}`);
  try {
    const regRes = await request('/api/auth/register', user);
    console.log(`Status: ${regRes.status}`);
    console.log('Response:', regRes.body);
  } catch (err) {
    console.error('Registration Failed (Is server running?):', err.message);
    return;
  }

  console.log(`\n2. Testing Login for: ${user.email}`);
  try {
    const loginRes = await request('/api/auth/login', { identifier: user.email, password: user.password });
    console.log(`Status: ${loginRes.status}`);
    console.log('Response:', loginRes.body);

    if (loginRes.body && loginRes.body.token) {
      console.log('\nSUCCESS: Token received!');
    }
  } catch (err) {
    console.error('Login Failed:', err.message);
  }
};

main();
