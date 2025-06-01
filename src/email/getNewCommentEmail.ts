export const getNewCommentEmail = (
  pdfTitle: string,
  commenterName: string,
  comment: string,
  pdfUrl: string,
) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .comment { background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Comment on Your PDF</h2>
    <p>Hello,</p>
    <p><strong>${commenterName}</strong> has commented on your PDF document: <strong>${pdfTitle}</strong>.</p>
    <div class="comment">
      <p>${comment}</p>
    </div>
    <a href="${pdfUrl}" class="button">View PDF with Comments</a>
    <p>Best regards,<br>The Paperloom Team</p>
  </div>
</body>
</html>
`;
