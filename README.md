# AI N8N Mail - Contact Form Integration

A simple, responsive HTML/CSS/JavaScript contact form that integrates with n8n workflows for automated email processing and data storage.

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Validation**: Client-side form validation with visual feedback
- **N8N Integration**: Seamlessly sends form data to n8n webhooks
- **Professional UI**: Modern, clean design with smooth animations
- **Demo Mode**: Test the form functionality without n8n setup
- **Comprehensive Data**: Captures form fields plus metadata (timestamp, user agent, etc.)

## 📋 Form Fields

- **Name** (required)
- **Email** (required, validated)
- **Subject** (required)
- **Message** (required, minimum 10 characters)
- **Phone** (optional)
- **Company/Organization** (optional)

## 🛠️ Setup Instructions

### 1. Clone and Serve the Files

```bash
# Clone the repository
git clone https://github.com/crsnc/ai-n8nmail.git
cd ai-n8nmail

# Serve the files using any HTTP server
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js (if you have http-server installed)
npx http-server

# Option 3: PHP
php -S localhost:8000
```

### 2. Configure N8N Integration

1. **Create an N8N Workflow:**
   - Add a **Webhook** node as the trigger
   - Set the webhook method to `POST`
   - Copy the webhook URL

2. **Update the Configuration:**
   Open `script.js` and update the configuration:
   ```javascript
   const CONFIG = {
       N8N_WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/contact-form',
       // Optional: Add API key if your webhook requires authentication
       // API_KEY: 'your-api-key-here'
   };
   ```

3. **Test the Integration:**
   - Open `index.html` in your browser
   - Fill out and submit the form
   - Check your n8n workflow execution

## 🔧 N8N Workflow Examples

### Basic Email Notification Workflow

```
Webhook → Email Node
```

1. **Webhook Node**: Receives the form data
2. **Email Node**: Sends notification email

### Advanced Workflow with Google Docs

```
Webhook → Google Sheets → Google Docs → Email
```

1. **Webhook Node**: Receives the form data
2. **Google Sheets Node**: Stores form submission in a spreadsheet
3. **Google Docs Node**: Creates a document with the submission details
4. **Email Node**: Sends notification with document link

### Sample N8N Workflow Configuration

**Webhook Node Settings:**
- HTTP Method: `POST`
- Path: `/webhook/contact-form`
- Response Mode: `On Received`

**Email Node Example:**
```json
{
  "to": "admin@yourcompany.com",
  "subject": "New Contact Form Submission: {{$node[\"Webhook\"].json[\"data\"][\"subject\"]}}",
  "text": "Name: {{$node[\"Webhook\"].json[\"data\"][\"name\"]}}\nEmail: {{$node[\"Webhook\"].json[\"data\"][\"email\"]}}\n\nMessage:\n{{$node[\"Webhook\"].json[\"data\"][\"message\"]}}"
}
```

## 📊 Data Structure

The form sends data in the following JSON structure:

```json
{
  "formType": "contact",
  "source": "ai-n8nmail-form",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Website Inquiry",
    "message": "I'm interested in your services...",
    "phone": "+1234567890",
    "company": "Example Corp",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "url": "https://yoursite.com"
  }
}
```

## 🎨 Customization

### Styling
- Modify `style.css` to match your brand colors and design
- The CSS uses CSS Grid and Flexbox for responsive layouts
- Color scheme uses CSS custom properties for easy theming

### Form Fields
- Add or remove form fields by editing `index.html`
- Update the validation logic in `script.js` accordingly
- Ensure required fields are marked in both HTML and JavaScript

### JavaScript Configuration
- Update `CONFIG` object in `script.js` for your n8n settings
- Customize validation rules in the `validateFormData` function
- Modify success/error messages as needed

## 🧪 Testing

### Demo Mode
The form automatically enables demo mode if no valid n8n webhook URL is configured. This allows you to test the form functionality without setting up n8n.

### Manual Testing Checklist
- [ ] Form displays correctly on different screen sizes
- [ ] All validation works (required fields, email format)
- [ ] Loading states show during submission
- [ ] Success/error messages display properly
- [ ] Form resets after successful submission

## 🚀 Deployment

### Static Hosting
Deploy to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

### CDN Integration
For better performance, consider using a CDN for assets or hosting the entire site on a CDN.

## 🔒 Security Considerations

- **Input Sanitization**: Always sanitize data in your n8n workflow
- **Rate Limiting**: Implement rate limiting in n8n to prevent spam
- **CORS**: Configure CORS properly if hosting on a different domain
- **HTTPS**: Always use HTTPS for form submissions
- **Validation**: Server-side validation in n8n is essential

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source. Feel free to use, modify, and distribute as needed.

## 🆘 Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Verify your n8n webhook URL is correct
3. Test the n8n workflow independently
4. Check network requests in browser dev tools

---

**Made with ❤️ for seamless form-to-workflow integration**