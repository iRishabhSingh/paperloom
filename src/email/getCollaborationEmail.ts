export function getCollaborationEmail(
  pdfTitle: string,
  acceptUrl: string,
  inviterName: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
          display: inline-block; 
          padding: 12px 24px; 
          background-color: #3B82F6; 
          color: white; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: bold; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Collaboration Invitation</h2>
        <p>${inviterName} has invited you to collaborate on the document: <strong>${pdfTitle}</strong></p>
        <p>To accept this invitation and access the document:</p>
        <p><a href="${acceptUrl}" class="button">Accept Invitation</a></p>
        <p>If you don't have a Paperloom account yet, you'll be prompted to sign up first.</p>
        <p><em>This invitation will expire in 7 days.</em></p>
      </div>
    </body>
    </html>
  `;
}
