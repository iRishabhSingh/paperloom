export const getShareNotificationEmail = (
  ownerName: string,
  pdfTitle: string,
  action: "added" | "removed",
  actionUrl: string,
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
    <h2>Collaboration Update</h2>
    <p>Hello,</p>
    <p><strong>${ownerName}</strong> has ${action} you to ${action === "added" ? "the" : "a"} PDF collaboration: <strong>${pdfTitle}</strong>.</p>
    <a href="${actionUrl}" class="button">View PDF</a>
    <p>Best regards,<br>The Paperloom Team</p>
  </div>
</body>
</html>
`;
