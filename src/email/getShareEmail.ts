export const getShareEmail = (
  senderName: string,
  fileName: string,
  shareUrl: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>PDF Shared with You</h2>
    <p>Hello,</p>
    <p><strong>${senderName}</strong> has shared a PDF document (<strong>${fileName}</strong>) with you.</p>
    <p>Click the button below to access the document:</p>
    <a href="${shareUrl}" class="button">View PDF</a>
    <p>This link will expire in 7 days.</p>
    <p>Best regards,<br>The Paperloom Team</p>
  </div>
</body>
</html>
`;
