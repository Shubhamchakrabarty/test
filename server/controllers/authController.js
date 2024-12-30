// server/controllers/authController.js
const { generateAndSendOTP, otpCache } = require('../utils/otpUtils');
const userService = require('../services/userService');
const clientUserService = require('../services/clientUserService');
const { sendSignupEmail } = require('../jobs/emailSendJob');

const signUp = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, state, city, experienceLevel } = req.body;
  console.log(`Received sign-up request: ${JSON.stringify(req.body)}`);
  // dummy object to store whether sms and email OTP sent or not
  let smsSent = false;
  let emailSent = false;
  try {
    console.log('Checking if the user already exists...');
    const existingUser = await userService.findUserByEmailOrPhone(email, phoneNumber);

    if (existingUser) {
      console.log('User already exists.');
      return res.status(400).json({ message: 'User with this email or phone number already exists.' });
    }

    console.log('Sending OTP...');
    try {
      const otpResponse = await generateAndSendOTP(phoneNumber, email);
      smsSent = otpResponse.smsSent;
      emailSent = otpResponse.emailSent;
      console.log(`OTP sent response: ${JSON.stringify(otpResponse)}`);
    } catch (otpError) {
      if (otpError.message.includes('OTP limit reached')) {
        console.error('OTP limit reached during signup:', otpError.message);
        return res.status(429).json({ message: 'OTP limit reached. Please wait 30 minutes before trying again.', smsSent: false, emailSent: false });
      }
      throw otpError;
    }

    console.log('Creating new user...');
    const newUser = await userService.createUser({
      firstName, lastName, email, phoneNumber, state, city, experienceLevel, address: address || null, isVerified: false
    });

    // Send welcome email
    await sendSignupEmail({
      firstName,
      lastName,
      email
    });

    console.log(`New user created: ${JSON.stringify(newUser)}`);

    res.status(200).json({ success: true, message: 'OTP sent successfully.', smsSent, emailSent, user: newUser });
  } catch (error) {
    console.error('Error in sign-up process:', error.message || error);
    res.status(500).json({ success: false, message: error.message || 'Error sending OTP.' });
  }
};


const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  console.log(`Received OTP verification request: ${JSON.stringify(req.body)}`);

  try {
    // Check OTP from cache using phone number as the key
    const storedOtp = otpCache.get(phoneNumber);
    console.log(`OTP in cache: ${storedOtp}`);

    if (storedOtp && storedOtp.toString() === otp.toString()) {
      console.log('OTP matched.');

      // OTP is valid, update verification status in PostgreSQL
      const user = await userService.findUserByPhoneNumber(phoneNumber);

      if (user) {
        await userService.updateUserVerificationStatus(user);
        console.log(`User verification status updated: ${JSON.stringify(user)}`);

        res.status(200).json({ message: 'Phone number verified successfully.', user });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid OTP or OTP expired.' });
    }
  } catch (error) {
    console.error('Error in OTP verification process:', error.message || error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

const login = async (req, res) => {
  const { phoneNumber } = req.body;
  // dummy object to store whether sms and email OTP sent or not 
  let smsSent = false;
  let emailSent = false;
  console.log(`Received login request: ${JSON.stringify(req.body)}`);

  try {
    const user = await userService.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      return res.status(404).json({ message: 'No account associated with this phone number.', smsSent: false, emailSent: false });
    }

    console.log('Sending OTP...');
    try {
      const otpResponse = await generateAndSendOTP(phoneNumber, user.email);
      smsSent = otpResponse.smsSent;
      emailSent = otpResponse.emailSent;
      console.log(`OTP sent response: ${JSON.stringify(otpResponse)}`);
    } catch (otpError) {
      if (otpError.message.includes('OTP limit reached')) {
        console.error('OTP limit reached during login:', otpError.message);
        return res.status(429).json({ message: 'OTP limit reached. Please wait 30 minutes before trying again.', smsSent: false, emailSent: false });
      }
      throw otpError;
    }

    const userDetails = {
      firstName: user.firstName,
      email: user.email,
    };

    res.status(200).json({ message: 'OTP sent successfully.', userDetails, smsSent, emailSent });
  } catch (error) {
    console.error('Error in login process:', error.message || error);
    res.status(500).json({ message: error.message || 'Error sending OTP.' });
  }
};


const resendOTP = async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(`Received resend OTP request: ${JSON.stringify(req.body)}`);
  let smsSent = false;
  let emailSent = false;
  try {
    const user = await userService.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      return res.status(404).json({ message: 'No account associated with this phone number.' });
    }
    try {
      const otpResponse = await generateAndSendOTP(phoneNumber, user.email);
      console.log(`OTP sent response: ${JSON.stringify(otpResponse)}`);
      smsSent = otpResponse.smsSent;
      emailSent = otpResponse.emailSent;
    }
    catch (otpError) {
      if (otpError.message.includes('OTP limit reached')) {
        console.error('OTP limit reached during resend OTP:', otpError.message);
        return res.status(429).json({ message: 'OTP limit reached. Please try again after 30 minutes.', smsSent: false, emailSent: false });
      }
      throw otpError;
    }

    res.status(200).json({ message: 'OTP sent successfully.', smsSent, emailSent });
  } catch (error) {
    console.error('Error in resending OTP:', error.message || error);
    res.status(500).json({ message: 'Error resending OTP.' });
  }
};



// Client User Login
const clientLogin = async (req, res) => {
  const { phoneNumber, email } = req.body;
  console.log(`Received client login request: ${JSON.stringify(req.body)}`);
  let smsSent = false;
  let emailSent = false;
  try {
    // Find the client user by both phone number and email
    const clientUser = await clientUserService.findClientUserByPhoneAndEmail(phoneNumber, email);

    if (!clientUser) {
      return res.status(404).json({ message: 'No account associated with this phone number or email.' });
    }

    try {
      const otpResponse = await generateAndSendOTP(phoneNumber, email);
      smsSent = otpResponse.smsSent;
      emailSent = otpResponse.emailSent;
      console.log(`OTP sent response: ${JSON.stringify(otpResponse)}`);
    } catch (otpError) {
      if (otpError.message.includes('OTP limit reached')) {
        console.error('OTP limit reached during login:', otpError.message);
        return res.status(429).json({ message: 'OTP limit reached. Please try again after 30 minutes.' });
      }
      throw otpError;
    }


    // Extract the client name from the associated Client model
    const clientDetails = await clientUser.getClient();  // Fetch the associated Client model

    // Prepare user details including client name
    const clientUserDetails = {
      clientId: clientUser.client_id,
      clientUserId: clientUser.id,
      userName: clientUser.user_name,
      email: clientUser.email,
      clientName: clientDetails ? clientDetails.name : 'Unknown Client',  // Return client name or fallback
    };

    res.status(200).json({ message: 'OTP sent successfully.', clientUserDetails, smsSent, emailSent });
  } catch (error) {
    console.error('Error in client login process:', error.message || error);
    res.status(500).json({ message: 'Error sending OTP.' });
  }
};

// Client User OTP Verification
const clientVerifyOTP = async (req, res) => {
  const { phoneNumber, email, otp } = req.body;
  console.log(`Received client OTP verification request: ${JSON.stringify(req.body)}`);

  try {
    const storedOtp = otpCache.get(phoneNumber);
    console.log(`OTP in cache: ${storedOtp}`);

    if (storedOtp && storedOtp.toString() === otp.toString()) {
      console.log('OTP matched.');

      const clientUser = await clientUserService.findClientUserByPhoneAndEmail(phoneNumber, email);

      if (clientUser) {
        res.status(200).json({ message: 'Phone number verified successfully.', clientUser });
      } else {
        res.status(404).json({ message: 'Client user not found.' });
      }
    } else {
      res.status(400).json({ message: 'Invalid OTP or OTP expired.' });
    }
  } catch (error) {
    console.error('Error in OTP verification process:', error.message || error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Client User Resend OTP
const clientResendOTP = async (req, res) => {
  const { phoneNumber, email } = req.body;
  console.log(`Received client resend OTP request: ${JSON.stringify(req.body)}`);
  let smsSent = false;
  let emailSent = false;
  try {
    const clientUser = await clientUserService.findClientUserByPhoneAndEmail(phoneNumber, email);

    if (!clientUser) {
      return res.status(404).json({ message: 'No account associated with this phone number.', smsSent, emailSent });
    }

    try {
      const otpResponse = await generateAndSendOTP(phoneNumber, email);
      smsSent = otpResponse.smsSent;
      emailSent = otpResponse.emailSent;
      console.log(`OTP sent response: ${JSON.stringify(otpResponse)}`);
    } catch (otpError) {
      if (otpError.message.includes('OTP limit reached')) {
        console.error('OTP limit reached during login:', otpError.message);
        return res.status(429).json({ message: 'OTP limit reached. Please try again after 30 minutes.' });
      }
      throw otpError;
    }

    res.status(200).json({ message: 'OTP sent successfully.', smsSent, emailSent });
  } catch (error) {
    console.error('Error in resending OTP:', error.message || error);
    res.status(500).json({ message: 'Error resending OTP.' });
  }
};

const createUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, address, state, city, experienceLevel } = req.body;
  console.log(`Received sign-up request: ${JSON.stringify(req.body)}`);

  try {
    // Check if the user already exists- postgres
    console.log('Checking if the user already exists...');
    const existingUser = await userService.findUserByEmailOrPhone(email, phoneNumber);

    if (existingUser) {
      console.log('User already exists.');
      return res.status(400).json({ message: 'User with this email or phone number already exists.', user: existingUser });
    }

    console.log('Creating new user...');
    // Address is optional, so it can be conditionally included or set to null
    const newUser = await userService.createUser({
      firstName, lastName, email, phoneNumber, state, city, experienceLevel, address: address || null, isVerified: false
    });
    console.log(`New user created: ${JSON.stringify(newUser)}`);

    res.status(200).json({ success: true, message: 'User created successfully', user: newUser }); // Send JSON response
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in sign-up process' }); // Send JSON response
  }
}

const checkUserExists = async (req, res) => {
  const { phoneNumber } = req.params;
  console.log(`Received check user request: ${phoneNumber}`);

  try {
    // Check if the user already exists- postgres
    console.log('Checking if the user already exists...');
    const existingUser = await userService.findUserByPhoneNumber(phoneNumber);

    if (existingUser) {
      console.log('User already exists.');
      return res.status(200).json({ message: 'User with this phone number already exists.', user: existingUser });
    }

    console.log('User does not exist.');
    return res.status(404).json({ message: 'User with phone number does not exist.' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Error while checking if user exists ' }); // Send JSON response
  }
}


module.exports = { signUp, verifyOTP, login, resendOTP, clientLogin, clientVerifyOTP, clientResendOTP, checkUserExists, createUser };