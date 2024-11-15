import sendgrid from "@sendgrid/mail";
import { format } from "date-fns";
sendgrid.setApiKey(process.env.SGMAIL);

interface attachmentProps {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

const emailTemplate = (
  receiver: string,
  subject: string,
  htmlContent: string,
  attachment?: attachmentProps[]
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
      attachments: attachment,
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
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
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
                      beehired.careers@gmail.com.
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
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
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
                      support team at beehired.careers@gmail.com. We are here to assist
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
          background-color: #f1f5f9;
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
                        beehired.careers@gmail.com. We are here to help and ensure a
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
          background-color: #f1f5f9;
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
                        beehired.careers@gmail.com
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

export async function ApplicantPending(
  email: string,
  fullname: string,
  jobType: string,
  companyName: string
) {
  return emailTemplate(
    email,
    "Your Application Has Been Submitted",
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">
                      Thank you for applying for the<b>${jobType}</b> position at
                      <b>${companyName}!</b> We’re thrilled to receive your
                      application and appreciate the time and effort you’ve
                      invested in pursuing this opportunity with us.:
                    </p>
                    <p style="color: #000001;">
                      Our team will begin the review process soon, and we’ll keep
                      you updated every step of the way. In the meantime, if you
                      have any questions or need further information, please don’t
                      hesitate to reach out to us. We’re here to help and ensure
                      your experience with us is as smooth as possible.
                    </p>
                    <p style="color: #000001;">Best Regards,</p>
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

export async function ApplicantReview(
  email: string,
  fullname: string,
  jobType: string,
  companyName: string
) {
  return emailTemplate(
    email,
    "Your Application is Under Review",
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">
                      We wanted to let you know that your application for the <b>${jobType}</b> position at <b>${companyName}</b> is currently under review.
                    </p>
                    <p style="color: #000001;">
                      Our hiring team is working diligently to review all
                      candidates to identify the best match for the role. This
                      process may take some time as we want to ensure a thorough
                      evaluation. Rest assured, we’ll keep you informed every step
                      of the way.
                    </p>
                    <p style="color: #000001;">
                      Our hiring team is working diligently to review all
                      candidates to identify the best match for the role. This
                      process may take some time as we want to ensure a thorough
                      evaluation. Rest assured, we’ll keep you informed every step
                      of the way.</p>
                    <p></p>
                    <p style="color: #000001;">
                      We appreciate your patience and continued interest in joining <b>${companyName}</b>. If you have any questions or need further assistance, feel free to contact our support team at beehired.careers@gmail.com
                    </p>
                    <p style="color: #000001;">Best Regards,</p>
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

export async function ApplicantHired(
  email: string,
  fullname: string,
  jobtype: string,
  companyName: string,
  pdf: attachmentProps[]
) {
  return emailTemplate(
    email,
    `Congratulations, You’ve Been Hired for the ${jobtype} Position!`,
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">Welcome to the team!</p>
                    <p style="color: #000001;">
                      We are happy to welcome you to <b>${companyName}!</b> Your
                      skills, experience, and passion truly stood out during the
                      selection process, and we are confident that you will be a
                      great addition to the company
                    </p>
                    <p style="color: #000001;">
                      Attached is your official offer letter, which includes all
                      the details about your new role. We encourage you to review
                      the document thoroughly.
                    </p>
                    <p style="color: #000001;">
                      Thank you for choosing to take the next step in your career
                      with <b>${companyName}</b>. We are excited to see the impact you
                      will make and to support your growth within our company.
                    </p>
                    <p style="color: #000001;">
                      Please respond to this email to confirm your acceptance, and
                      feel free to reach out if you have any questions or need any
                      further clarification.
                    </p>
                    <p style="color: #000001;">Best Regards,</p>
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
</html>`,
    pdf
  );
}

export async function ApplicantInterview(
  email: string,
  fullname: string,
  jobType: string,
  companyName: string,
  startDate: string,
  startTime: string,
  meetingLink: string
) {
  return emailTemplate(
    email,
    `Virtual Interview Scheduled for ${jobType} Position 
`,
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">
                      We’re excited to move forward with your application for the
                      <b>${jobType}</b> position at <b>${companyName}!</b> We
                      would like to schedule a virtual interview with you and our
                      team to learn more about your qualifications and how you
                      could contribute to our company.
                    </p>
                    <div>
                      <p style="font-weight: 700; color: #000001">Interview Details:</p>
                      <p style="color: #000001;"><b>Date:</b> ${format(
                        new Date(startDate),
                        "MMMM dd, yyyy"
                      )}</p>
                      <p style="color: #000001;"><b>Time:</b> ${startTime}</p>
                      <p style="color: #000001;">
                        <b>Virtual Meeting Link:</b> ${meetingLink}
                      </p>
                    </div>
                    <p style="color: #000001;">
                      Please reply to this email to confirm your availability for
                      the proposed time. If this time doesn’t work for you, kindly
                      suggest alternative dates and times that suit your schedule,
                      and we will coordinate with our team.
                    </p>
                    <div>
                      <p style="font-weight: 700; color: #000001;">Interview Preparation:</p>
                      <div style="padding-left: 4px; padding-right: 4px">
                        <ul>
                          <li style="color: #000001;">
                            Ensure you have a stable internet connection and a
                            quiet space for the interview.
                          </li>
                          <li style="color: #000001;">
                            Test the meeting link before the scheduled time to
                            avoid any technical issues.
                          </li>
                          <li style="color: #000001;">
                            Have your resume and any relevant documents ready to
                            discuss.
                          </li>
                          <li style="color: #000001;">
                            Prepare any questions you may have about the role or
                            our company.
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p style="color: #000001;">
                      We’re looking forward to your response and to getting to
                      know you better!
                    </p>
                    <p style="color: #000001;">Best Regards,</p>
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

export async function ApplicantReject(
  email: string,
  fullname: string,
  jobType: string,
  companyName: string
) {
  return emailTemplate(
    email,
    `Thank You for Your Application `,
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">
                      Thank you for taking the time to apply for the <b>${jobType}</b>
                      position at <b>${companyName}</b>. We truly appreciate the effort
                      you put into your application and the interest you’ve shown
                      in joining our company.
                    </p>
                    <p style="color: #000001;">
                      After careful consideration, we’ve decided to move forward
                      with another candidate whose experience more closely aligns
                      with our current needs. Please know that this decision was
                      not easy, as we received applications from many qualified
                      individuals like yourself.
                    </p>
                    <p style="color: #000001;">
                      While we won’t be moving forward together at this time, we
                      were genuinely impressed by your background and encourage
                      you to keep an eye on our future openings. We believe you
                      have much to offer, and we’d love to stay connected for any
                      upcoming opportunities that better match your unique skills
                      and experience.
                    </p>
                    <p style="color: #000001;">
                      We wish you all the best in your job search and hope to
                      cross paths again in the future
                    </p>
                    <p style="color: #000001;"></p>
                    Thank you once again for your interest in <b>${companyName}!</b>
                    <p></p>
                    <p style="color: #000001;">Warm regards,</p>
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

export async function ChangeEmailAddress(
  email: string,
  fullname: string,
  userid: string
) {
  return emailTemplate(
    email,
    "Verify Your Email Address Change",
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">
                      You recently requested to change the email address
                      associated with your account on BeeHired. To
                      complete this update, please verify your new email address
                      by clicking the link below:
                    </p>
                    <div style="padding-top: 16px; padding-bottom: 16px">
                      <a href="http://localhost:3000/auth/verification?userid=${userid}" style="
                        cursor: pointer;
                        border-radius: 6px;
                        border-width: 0px;
                        background-color: gold;
                        padding: 12px;
                        font-weight: 600;
                        color: #000001;
                        text-decoration: none;
                      ">Verify Email Address</a>
                    </div>
                    <p style="color: #000001;">
                      If you did not request this change, please disregard this
                      email or contact our support team at
                      beehired.careers@gmail.com.
                    </p>
                    <p style="color: #000001;">Best Regards,</p>
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

export async function AccountDeactivation(email: string, fullname: string) {
  return emailTemplate(
    email,
    "Important Notice: Account Deactivation",
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #f1f5f9; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">We hope this message finds you well.</p>
                    <p style="color: #000001;">
                      We’re reaching out to inform you of our account deactivation. If your account remains inactive for over 30 days,
                      it will be automatically deleted.
                    </p>
                    <p style="color: #000001;">
                      However, you can restore access to your account within this
                      30-day period simply by logging back in. This will
                      reactivate your account and preserve your data and content.
                    </p>
                    <p style="color: #000001;">
                      If you have any questions or need assistance, please don’t
                      hesitate to contact our support team.
                    </p>
                    <p style="color: #000001;">Best Regards,</p>
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

export async function JobApplicationClose(
  email: string,
  fullname: string,
  jobTitle: string
) {
  return emailTemplate(
    email,
    "Job Opportunity Update – Position No Longer Available",
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
  <title>Submitted Application</title>
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
  <div role="article" aria-roledescription="email" aria-label="Submitted Application" lang="en">
    <div class="sm-px-4" style="background-color: #e2e8f0; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif">
      <table align="center" cellpadding="0" cellspacing="0" role="none">
        <tr>
          <td style="width: 600px; max-width: 100%">
            <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
              <tr>
                <td class="sm-py-8 sm-px-6" style="padding: 48px; text-align: center">
                  <a href="http://localhost:3000">
                    <img src="http://cdn.mcauto-images-production.sendgrid.net/c19fbca0252c8257/aa48b7bb-ae11-47bc-b675-9622627de953/500x500.png" width="120" style="max-width: 100%; vertical-align: middle" alt="">
                  </a>
                </td>
              </tr>
              <tr>
                <table style="width: 100%;" cellpadding="0" cellspacing="0" role="none">
                  <td class="sm-px-6" style="border-radius: 8px; background-color: #fffffe; padding: 40px 48px">
                    <p style="color: #000001">Dear ${fullname},</p>
                    <p style="color: #000001;">
                      Thank you for your interest in the ${jobTitle} opportunity
                      on BeeHired. We appreciate the time and effort you invested
                      in preparing your application, and we recognize the
                      dedication it takes to apply for new roles and explore
                      exciting job opportunities.
                    </p>
                    <p style="color: #000001;">
                      We are reaching out to inform you that the job posting for
                      ${jobTitle} has recently been updated, and, unfortunately,
                      the position is no longer available. This may be because the
                      position has already been filled or the employer has decided
                      to remove the job post.
                    </p>
                    <p style="color: #000001;">
                      BeeHired regularly updates job openings that may fit your
                      skill set and profession perfectly. You can browse for other
                      positions of interest that better suit your skills.
                    </p>
                    <p style="color: #000001;">
                      Thank you again for choosing BeeHired as your freelancing
                      platform. We wish you the best of luck in your job search!
                    </p>
                    <p style="color: #000001;">Warm Regards,</p>
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
