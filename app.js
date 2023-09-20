const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Import the 'path' module
const app = express();
const port = process.env.PORT || 3000;

require('./db');
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Send OTP to the User's Phone Number (Using Twilio)
const twilio = require('twilio');
const TWILIO_SID = 'AC1fdaa4277434340981cd44b0c3ba412';
const TWILIO_AUTH_TOKEN = 'token_value from twilio acc';
const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

app.post('/sendOTP', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = generateOTP(); 
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: '+1 256 598 9445',
      to: phoneNumber,
    });
    console.log(`OTP sent to ${phoneNumber}`);
    console.log(`Twilio Message SID: ${message.sid}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

//Validate OTP and Register the User
app.post('/register', async (req, res) => {
  try {
    const { otp, ipAddress } = req.body;

    //OTP validation
    if (otp !== '123456') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Validate IP address here 
    if (!isValidIpAddress(ipAddress)) {
      return res.status(400).json({ error: 'Invalid IP address' });
    }

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Generate a random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Validate IP address
function isValidIPv4(ipAddress) {
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Pattern.test(ipAddress);
}

