const axios = require('axios');

exports.sendforgetmail = async (req, res) => {
  console.log('hi');
  const { forgottenmail } = req.body;
  console.log(forgottenmail);
  
  try {
    const mailres = await axios.post(
      'https://api.sendinblue.com/v3/smtp/email',
      {
        sender: { email: "yogeshsri1209@gmail.com", name: "Yogesh" },
        to: [{ email: forgottenmail }],
        subject: "Requesting new password",
        htmlContent: `  <!-- Corrected from 'htmlcontent' to 'htmlContent' -->
          <body>
            <h1>Change password</h1>
            <p>You have forgotten your login password. Please reset it.</p>
          </body>
        `,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.SENDINBLUE_API_KEY,
        },
      }
    );

    console.log("Mail sent", mailres.data);
    //res.status(200).json({ message: "Email sent successfully!" });
    
  } catch (err) {
    console.log('Error sending password reset email', err);
    res.status(500).json({ message: "Failed to send email" });
  }
};
