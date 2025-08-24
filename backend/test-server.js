import fetch from 'node-fetch';

async function testServer() {
  try {
    console.log('🧪 Testing TalentHub Backend Server...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:8000/health');
    const healthData = await healthResponse.json();
    
    console.log('✅ Health Check:', healthData);
    
    // Test jobs endpoint
    const jobsResponse = await fetch('http://localhost:8000/api/jobs');
    const jobsData = await jobsResponse.json();
    
    console.log('✅ Jobs Endpoint:', jobsData.jobs ? `${jobsData.jobs.length} jobs found` : 'No jobs');
    
    console.log('🎉 Server is running successfully!');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    console.log('💡 Make sure the server is running on port 8000');
  }
}

testServer();
