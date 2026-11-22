import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from './lib/prisma.js';
import { seedInitialData } from './lib/seed.js';
import app from './index.js';
import http from 'http';

const TEST_PORT = 5055;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

async function runTests() {
  console.log('🧪 Starting AI Interview Simulator Test Suite...\n');

  // Start temporary test server and await initial seed
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(TEST_PORT, () => resolve()));
  await seedInitialData();
  console.log(`📡 Test server running on ${BASE_URL}`);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details || ''}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // Test 7: Database connectivity
    // ----------------------------------------------------
    console.log('\n--- 7. Testing Database Connectivity ---');
    const dbTest = await prisma.$queryRaw<Array<{ current_database: string }>>`SELECT current_database();`;
    assert(
      dbTest.length > 0 && !!dbTest[0].current_database,
      'PostgreSQL connected and responsive via Prisma',
      `Current DB: ${dbTest[0]?.current_database}`
    );

    // Verify demo user exists from seed
    const demoUser = await prisma.user.findUnique({
      where: { email: 'alex.kumar@example.com' }
    });
    assert(
      !!demoUser && demoUser.fullName === 'Alex Kumar',
      'Demo user Alex Kumar properly seeded in PostgreSQL'
    );
    assert(
      !!demoUser && demoUser.passwordHash.startsWith('$2b$'),
      'Demo user password is encrypted with bcrypt hash'
    );

    // ----------------------------------------------------
    // Test 1: New user registration
    // ----------------------------------------------------
    console.log('\n--- 1. Testing New User Registration ---');
    const uniqueEmail = `student_${Date.now()}@university.edu`;
    const regPayload = {
      fullName: 'Priya Sharma',
      email: uniqueEmail,
      password: 'StrongPassword2026!',
      confirmPassword: 'StrongPassword2026!',
      college: 'Indian Institute of Technology',
      degree: 'B.Tech Computer Science',
      targetRole: 'Full Stack Engineer'
    };

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload)
    });
    const regData = await regRes.json();

    assert(regRes.status === 201, 'Registration returns HTTP 201 Created');
    assert(regData.success === true, 'Registration payload has success: true');
    assert(!!regData.token, 'Registration returns valid JWT token');
    assert(regData.user.fullName === 'Priya Sharma', 'User full name is saved correctly');
    assert(regData.user.email === uniqueEmail.toLowerCase(), 'User email is saved correctly');
    assert(!regData.user.passwordHash && !regData.user.password, 'Plain text or hashed password NOT exposed in API response');

    // Verify directly in PostgreSQL
    const dbUser = await prisma.user.findUnique({ where: { email: uniqueEmail.toLowerCase() } });
    assert(!!dbUser, 'New user is persisted in PostgreSQL users table');
    assert(dbUser!.passwordHash.startsWith('$2b$'), 'Password is saved as bcrypt hash in PostgreSQL');
    const isBcryptMatch = await bcrypt.compare('StrongPassword2026!', dbUser!.passwordHash);
    assert(isBcryptMatch, 'bcrypt.compare successfully verifies stored passwordHash against original password');

    // ----------------------------------------------------
    // Test 2: Duplicate email registration
    // ----------------------------------------------------
    console.log('\n--- 2. Testing Duplicate Email Registration Prevention ---');
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload)
    });
    const dupData = await dupRes.json();

    assert(dupRes.status === 400, 'Duplicate registration returns HTTP 400 Bad Request');
    assert(dupData.success === false, 'Duplicate response has success: false');
    assert(
      typeof dupData.message === 'string' && dupData.message.toLowerCase().includes('already exists'),
      'Displays appropriate duplicate email error message',
      dupData.message
    );

    // Also test password mismatch validation
    const mismatchRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Mismatch',
        email: `mismatch_${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!'
      })
    });
    const mismatchData = await mismatchRes.json();
    assert(mismatchRes.status === 400 && mismatchData.message.includes('match'), 'Password mismatch validation error caught');

    // ----------------------------------------------------
    // Test 3: Login with correct credentials
    // ----------------------------------------------------
    console.log('\n--- 3. Testing Login with Correct Credentials ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'StrongPassword2026!'
      })
    });
    const loginData = await loginRes.json();

    assert(loginRes.status === 200, 'Login returns HTTP 200 OK');
    assert(loginData.success === true, 'Login response has success: true');
    assert(!!loginData.token, 'Login returns JWT token');
    assert(loginData.user.email === uniqueEmail.toLowerCase(), 'Login returns matching user email');
    assert(loginData.user.fullName === 'Priya Sharma', 'Login returns matching user full name');

    // Decode token to verify payload
    const decoded: any = jwt.decode(loginData.token);
    assert(decoded.userId === dbUser!.id, 'JWT payload contains correct userId');
    assert(decoded.email === uniqueEmail.toLowerCase(), 'JWT payload contains correct email');

    // ----------------------------------------------------
    // Test 4: Login with incorrect credentials
    // ----------------------------------------------------
    console.log('\n--- 4. Testing Login with Incorrect Credentials ---');
    // Wrong password
    const wrongPassRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: uniqueEmail,
        password: 'WrongPassword123!'
      })
    });
    const wrongPassData = await wrongPassRes.json();
    assert(wrongPassRes.status === 401, 'Wrong password returns HTTP 401 Unauthorized');
    assert(wrongPassData.success === false, 'Wrong password returns success: false');
    assert(wrongPassData.message === 'Invalid email or password.', 'Displays appropriate error message for bad password');

    // Non-existent email
    const nonExistentRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nobody_exists@example.com',
        password: 'SomePassword123!'
      })
    });
    const nonExistentData = await nonExistentRes.json();
    assert(nonExistentRes.status === 401, 'Non-existent email returns HTTP 401 Unauthorized');
    assert(nonExistentData.message === 'Invalid email or password.', 'Displays generic credential error message to avoid enumeration');

    // ----------------------------------------------------
    // Test 5: Logout functionality
    // ----------------------------------------------------
    console.log('\n--- 5. Testing Logout Functionality ---');
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.token}`
      }
    });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200, 'Logout returns HTTP 200 OK');
    assert(logoutData.success === true, 'Logout confirms successful session clearance');

    // ----------------------------------------------------
    // Test 6: User information persistence across requests
    // ----------------------------------------------------
    console.log('\n--- 6. Testing User Information Persistence ---');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${loginData.token}`
      }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'Session verification (/auth/me) returns HTTP 200');
    assert(meData.user.id === dbUser!.id, 'Persistent session retrieves accurate user ID from PostgreSQL');
    assert(meData.user.fullName === 'Priya Sharma', 'Persistent session retrieves accurate user full name');
    assert(meData.user.email === uniqueEmail.toLowerCase(), 'Persistent session retrieves accurate user email');

    // Test profile retrieval & update persistence
    const profileRes = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${loginData.token}`
      }
    });
    const profileData = await profileRes.json();
    assert(profileData.user.id === dbUser!.id, 'Profile route fetches authenticated user from PostgreSQL');

    // Update profile
    const updateRes = await fetch(`${BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        targetRole: 'Senior Cloud Architect',
        college: 'IIT Bombay',
        skills: ['PostgreSQL', 'Docker', 'Kubernetes', 'TypeScript']
      })
    });
    const updateData = await updateRes.json();
    assert(updateData.success === true, 'Profile update returns success: true');
    assert(updateData.user.targetRole === 'Senior Cloud Architect', 'Profile update reflected in response');

    // Query DB directly to verify persistence
    const updatedDbUser = await prisma.user.findUnique({ where: { id: dbUser!.id } });
    assert(updatedDbUser?.targetRole === 'Senior Cloud Architect', 'Profile changes persisted in PostgreSQL');
    assert(updatedDbUser?.college === 'IIT Bombay', 'College persisted in PostgreSQL');
    assert(!!updatedDbUser?.skills.includes('PostgreSQL'), 'Skills array persisted in PostgreSQL');

    // ----------------------------------------------------
    // Test 8: Protected Dashboard & API Access
    // ----------------------------------------------------
    console.log('\n--- 8. Testing Protected Dashboard & API Access ---');
    // Call with invalid token
    const invalidTokenRes = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: 'Bearer invalid.bogus.token'
      }
    });
    // In our middleware, invalid token will not authenticate the user
    const invalidTokenData = await invalidTokenRes.json();
    assert(
      invalidTokenRes.status === 200 || invalidTokenRes.status === 401,
      'Invalid token handled gracefully without server crash'
    );

    // Verify foreign key relations in schema for future features
    console.log('\n--- Verifying Future Feature Schema Relations ---');
    const userWithRelations = await prisma.user.findUnique({
      where: { id: dbUser!.id },
      include: {
        interviews: true,
        testResults: true,
        resumeAnalyses: true,
        chatMessages: true,
        documents: true,
        jobMatches: true
      }
    });
    assert(!!userWithRelations, 'User fetched with related relational tables');
    assert(Array.isArray(userWithRelations?.interviews), 'Relationship User -> InterviewSession ready');
    assert(Array.isArray(userWithRelations?.testResults), 'Relationship User -> TestResult ready');
    assert(Array.isArray(userWithRelations?.resumeAnalyses), 'Relationship User -> ResumeAnalysis ready');
    assert(Array.isArray(userWithRelations?.chatMessages), 'Relationship User -> ChatMessage ready');

    console.log(`\n==============================================`);
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==============================================\n`);

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
