export function get2FAEmail(otp: string, name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paperloom - Verify Your Email</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
            color: #334155;
            line-height: 1.5;
        }
        
        .email-container {
            max-width: 480px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            padding: 30px 0;
            text-align: center;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #2563eb;
            margin: 0;
        }
        
        .content {
            padding: 40px;
        }
        
        h1 {
            color: #1e293b;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 25px;
            text-align: center;
        }
        
        p {
            margin-bottom: 24px;
            font-size: 16px;
            color: #475569;
            text-align: center;
        }
        
        .otp-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 4px;
            color: #2563eb;
            padding: 12px 0;
            display: inline-block;
        }
        
        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 32px 0;
        }
        
        .footer {
            text-align: center;
            padding: 25px;
            color: #64748b;
            font-size: 14px;
            background: #f8fafc;
        }
        
        .highlight {
            color: #2563eb;
            font-weight: 600;
        }
        
        .note {
            background: #f1f5f9;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            text-align: center;
            margin: 30px 0;
        }
        
        @media (max-width: 500px) {
            .content {
                padding: 30px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            h1 {
                font-size: 20px;
            }
            
            .otp-code {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">paperloom</div>
        </div>
        
        <div class="content">
            <h1>Your 2FA Verification Code</h1>
            
            <p>Hi ${name}, here's your 2FA code for secure login:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="note">
                <p>This code is valid for 10 minutes</p>
                <p>Do not share this code with anyone</p>
            </div>
            
            <div class="divider"></div>
            
            <p>
                Best regards,<br>
                <strong>The Paperloom Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Paperloom. All rights reserved.</p>
            <p>This email was sent for security purposes</p>
        </div>
    </div>
</body>
</html>`;
}
