import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SGMAIL);

const emailTemplate = (
  receiver: string,
  subject: string,
  htmlContent: string
) => {
  try {
    sendgrid.send({
      to: receiver,
      from: process.env.EMAIL_FROM,
      subject: subject,
      content: [
        {
          type: "text/html",
          value: htmlContent,
        },
      ],
    });
  } catch (e) {
    console.log(e);

    if (e.response) {
      console.log(e.response.body);
    }
  }
};

export async function VerificationEmail(
  receiver: string,
  fullname: string,
  userid: string
) {
  return emailTemplate(
    receiver,
    "Account Verification Link",
    `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Segoe UI", sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->
  <title>Verification Email Address</title>
  <style>
    .leading-8 {
      line-height: 32px !important
    }
    @media (max-width: 600px) {
      .sm-px-0 {
        padding-left: 0 !important;
        padding-right: 0 !important
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
      .sm-py-8 {
        padding-top: 32px !important;
        padding-bottom: 32px !important
      }
      .sm-leading-8 {
        line-height: 32px !important
      }
    }
  </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f1f5f9; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
  <div role="article" aria-roledescription="email" aria-label="Verification Email Address" lang="en">
    <div class="sm-px-4" style="background-color: #e2e8f0; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120"  style="max-width: 100%; vertical-align: middle">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Hello ${fullname},</p>
                    <p style="color: #000001;">
                      Thank you for registering with BeeHired. To
                      complete your registration, please verify your email address
                      by clicking the link below:
                    </p>
                    <div style="padding-top: 16px; padding-bottom: 16px">
                      <a href="http://localhost:3000/auth/verification?userid=${userid}" style="cursor: pointer; border-radius: 6px; border-width: 0px; background-color: gold; padding: 12px; font-weight: 600; color: #000001; text-decoration: none">Verify Email Address</a>
                    </div>
                    <p style="color: #000001;">
                      Please disregard this email if you have not created an
                      account with us. If you have any questions or need
                      assistance, please contact our support team at
                      beehired@gmail.com.
                    </p>
                    <p style="color: #000001;">Thank you,</p>
                    <p style="color: #000001;">The BeeHired Team</p>
                  </td>
                </table>
              </tr>
              <tr>
                <td class="sm-px-0" style="width: 100%; padding-left: 24px; padding-right: 24px; text-align: left">
                  <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none"></table>
                </td>
              </tr>
              <tr role="separator">
                <td class="sm-leading-8" style="line-height: 48px">&zwj;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`
  );
}

export async function RecruitersInstruction(
  receiver: string,
  fullname: string
) {
  return emailTemplate(
    receiver,
    "Recruiters Instruction",
    `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Segoe UI", sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->
  <title>Reset Password Link</title>
  <style>
    .leading-8 {
      line-height: 32px !important
    }
    @media (max-width: 600px) {
      .sm-px-0 {
        padding-left: 0 !important;
        padding-right: 0 !important
      }
      .sm-px-4 {
        padding-left: 16px !important;
        padding-right: 16px !important
      }
      .sm-px-6 {
        padding-left: 24px !important;
        padding-right: 24px !important
      }
      .sm-py-8 {
        padding-top: 32px !important;
        padding-bottom: 32px !important
      }
      .sm-leading-8 {
        line-height: 32px !important
      }
    }
  </style>
</head>
<body style="margin: 0; width: 100%; background-color: #f1f5f9; padding: 0; -webkit-font-smoothing: antialiased; word-break: break-word">
  <div role="article" aria-roledescription="email" aria-label="Reset Password Link" lang="en">
    <div class="sm-px-4" style="background-color: #e2e8f0; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Hello ${fullname},</p>
                    <p style="color: #000001;">
                      Thank you for registering as an employer with BeeHired!
                    </p>
                    <p style="color: #000001;">
                      To finalize your account setup and gain full access to our
                      platform, please follow the steps below:
                    </p>
                    <div>
                      <p style="font-weight: 700; color: #000001">
                        1. Verify Your Email Address
                      </p>
                      <p style="padding-left: 16px; padding-right: 16px; color: #000001">
                        <b>Verification Link:</b> Click the verification link sent
                        to your email to confirm your registration. If you did not
                        receive the email, please check your spam folder or
                        request a new verification link.
                      </p>
                    </div>
                    <div>
                      <p style="font-weight: 700; color: #000001;">
                        2. Upload Required Documents:
                      </p>
                      <p style="color: #000001;">
                        To complete your registration, please upload the following
                        documents:
                      </p>
                      <ul>
                        <li style="color: #000001;">
                          <b>Valid Business Permit:</b> Proof of legal operation
                          of your business.
                        </li>
                        <li style="color: #000001;">
                          <b>Bureau of Internal Revenue (BIR) Permit:</b>
                          Verification of tax compliance.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p style="font-weight: 700; color: #000001;">How to Upload Documents:</p>
                      <ul>
                        <ol type="1">
                          <li style="color: #000001;">
                            <b>Log in to Your Account:</b> Access your BeeHired
                            account at
                            <a href="/" style="font-weight: 700; color: gold">BeeHired Login</a>
                          </li>
                          <li style="color: #000001;">
                            <b>Go to Document Upload Section:</b> Navigate to your
                            account dashboard's “Documents” or “Verification”
                            section.
                          </li>
                          <li style="color: #000001;">
                            <b>Upload Documents:</b> Follow the prompts to upload
                            clear and legible copies of the required documents.
                          </li>
                        </ol>
                      </ul>
                    </div>
                    <div>
                      <p style="font-weight: 700; color: #000001;">Important Notes:</p>
                      <ul>
                        <li style="color: #000001;">
                          Ensure that all documents are in a supported file format
                          (e.g., PDF, JPG, PNG) and are easily readable.
                        </li>
                        <li style="color: #000001;">
                          Uploaded documents will be reviewed, and you will
                          receive a confirmation email once your account is fully
                          approved.
                        </li>
                      </ul>
                    </div>
                    <p style="color: #000001;">
                      If you encounter any issues or questions, please contact our
                      support team at beehired@gmail.com. We are here to assist
                      you through this process.
                    </p>
                    <p style="color: #000001;">Thank you,</p>
                    <p style="color: #000001;">The BeeHired Team</p>
                  </td>
                </table>
              </tr>
              <tr>
                <td class="sm-px-0" style="width: 100%; padding-left: 24px; padding-right: 24px; text-align: left">
                  <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none"></table>
                </td>
              </tr>
              <tr role="separator">
                <td class="sm-leading-8" style="line-height: 48px">&zwj;</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </div>
</body>
</html>`
  );
}

export async function FreelancerVerificationEmail(
  receiver: string,
  fullname: string
) {
  return emailTemplate(
    receiver,
    "Valid IDs Verification ",
    `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">

    <title>Recruiter Email</title>
    <style>
      .leading-8 {
        line-height: 32px !important;
      }
      @media (max-width: 600px) {
        .sm-px-0 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .sm-px-4 {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .sm-px-6 {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
        .sm-py-8 {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }
        .sm-leading-8 {
          line-height: 32px !important;
        }
      }
    </style>
  </head>
  <body style="
      margin: 0;
      width: 100%;
      background-color: #f1f5f9;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      word-break: break-word;
    ">
    <div role="article" aria-roledescription="email" aria-label="Reset Password Link" lang="en">
      <div class="sm-px-4" style="
          background-color: #e2e8f0;
          font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
            sans-serif;
        ">
        <table align="center" cellpadding="0" cellspacing="0" role="none">
          <tr>
            <td style="width: 600px; max-width: 100%">
              <table style="width: 100%" cellpadding="0" cellspacing="0" role="none">
                <tr>
                  <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                    <a href="http://localhost:3000">
                      <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120"  style="max-width: 100%; vertical-align: middle">
                    </a>
                  </td>
                </tr>
                <tr>
                  <table style="width: 100%" cellpadding="0" cellspacing="0" role="none">
                    <td class="sm-px-6" style="
                        border-radius: 8px;
                        background-color: #fffffe;
                        padding: 40px 48px;
                      ">
                      <p style="color: #000">Hello ${fullname},</p>
                      <p style="color: #000">
                        Thank you for submitting your identification documents
                        for verification.
                      </p>
                      <p style="color: #000">
                        We have received your documents and are currently
                        processing them to complete your registration on
                        BeeHired. Please be aware that this verification process
                        may take up to 3-5 business days.
                      </p>
                      <p style="font-weight: bold; color: #000">
                        What to Expect:
                      </p>
                      <div class="px-4">
                        <ul>
                          <li style="color: #000">
                            <b>Review Process: </b>Our team will carefully
                            review the documents you have provided to ensure
                            they meet our verification requirements.
                          </li>
                          <li style="color: #000">
                            <b>Confirmation:</b> You will receive a confirmation
                            email once your ID has been successfully verified or
                            if additional information is needed.
                          </li>
                          <li style="color: #000">
                            <b>Pending Status:</b> You may log in to your
                            BeeHired account to check your verification status.
                          </li>
                        </ul>
                      </div>
                      <p style="color: #000">
                        If you have any questions or need further assistance,
                        please do not hesitate to contact our support team at
                        beehired@gmail.com. We are here to help and ensure a
                        smooth verification process.
                      </p>
                      <p style="color: #000">
                        Thank you for your patience and being part of the
                        BeeHired community!
                      </p>
                      <p style="color: #000">The BeeHired Team</p>
                    </td>
                  </table>
                </tr>
                <tr>
                  <td class="sm-px-0" style="
                      width: 100%;
                      padding-left: 24px;
                      padding-right: 24px;
                      text-align: left;
                    ">
                    <table style="width: 100%" cellpadding="0" cellspacing="0" role="none"></table>
                  </td>
                </tr>
                <tr role="separator">
                  <td class="sm-leading-8" style="line-height: 48px">&zwj;</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>
`
  );
}
export async function ResetPasswordLink(
  receiver: string,
  resetLink: string,
  fullname: string,
  userid: string
) {
  return emailTemplate(
    receiver,
    "Reset Password Link",
    `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no, url=no"
    />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings
            xmlns:o="urn:schemas-microsoft-com:office:office"
          >
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <style>
        td,
        th,
        div,
        p,
        a,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Segoe UI", sans-serif;
          mso-line-height-rule: exactly;
        }
      </style>
    <![endif]-->
    <title>Reset Password Link</title>
    <style>
      .leading-8 {
        line-height: 32px !important;
      }
      @media (max-width: 600px) {
        .sm-px-0 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .sm-px-4 {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        .sm-px-6 {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }
        .sm-py-8 {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }
        .sm-leading-8 {
          line-height: 32px !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      width: 100%;
      background-color: #f1f5f9;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      word-break: break-word;
    "
  >
    <div
      role="article"
      aria-roledescription="email"
      aria-label="Reset Password Link"
      lang="en"
    >
      <div
        class="sm-px-4"
        style="
          background-color: #e2e8f0;
          font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
            sans-serif;
        "
      >
        <table align="center" cellpadding="0" cellspacing="0" role="none">
          <tr>
            <td style="width: 600px; max-width: 100%">
              <table
                style="width: 100%"
                cellpadding="0"
                cellspacing="0"
                role="none"
              >
                <tr>
                  <td
                    class="sm-py-8 sm-px-6"
                    style="padding: 48px; text-align: center"
                  >
                    <a href="http://localhost:3000">
                      <img
                        src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png"
                        width="120"
                        style="max-width: 100%; vertical-align: middle"
                      />
                    </a>
                  </td>
                </tr>
                <tr>
                  <table
                    style="width: 100%"
                    cellpadding="0"
                    cellspacing="0"
                    role="none"
                  >
                    <td
                      class="sm-px-6"
                      style="
                        border-radius: 8px;
                        background-color: #fffffe;
                        padding: 40px 48px;
                      "
                    >
                      <p style="color: #000001">Hello ${fullname},</p>
                      <p style="color: #000001">
                        We received a request to reset your password for your
                        BeeHired account.
                      </p>
                      <p style="color: #000001">
                        To reset your password, click the link below:
                      </p>
                      <div style="padding-top: 16px; padding-bottom: 16px">
                        <a
                          href="http://localhost:3000/auth/forgotpassword/resetpassword/${resetLink}?userid=${userid}"
                          style="
                            cursor: pointer;
                            border-radius: 6px;
                            border-width: 0px;
                            background-color: gold;
                            padding: 12px;
                            font-weight: 600;
                            color: #000001;
                            text-decoration: none;
                          "
                          >Reset Password</a
                        >
                      </div>
                      <p style="color: #000001">
                        If you did not request a password reset, please ignore
                        this email. Your password will remain unchanged.
                      </p>
                      <p style="color: #000001">
                        For your security, the link will expire in 1 hour
                      </p>
                      <p style="color: #000001">
                        If you have any questions or need further assistance,
                        feel free to contact our support team at
                        beehired@gmail.com
                      </p>
                      <p style="color: #000001">Thank you,</p>
                      <p style="color: #000001">The BeeHired Team</p>
                    </td>
                  </table>
                </tr>
                <tr>
                  <td
                    class="sm-px-0"
                    style="
                      width: 100%;
                      padding-left: 24px;
                      padding-right: 24px;
                      text-align: left;
                    "
                  >
                    <table
                      style="width: 100%"
                      cellpadding="0"
                      cellspacing="0"
                      role="none"
                    ></table>
                  </td>
                </tr>
                <tr role="separator">
                  <td class="sm-leading-8" style="line-height: 48px">&zwj;</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </body>
</html>
`
  );
}

export async function OTPEmail(receiver: string) {
  return emailTemplate(receiver, "One-Time Password", "");
}
