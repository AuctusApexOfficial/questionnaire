"use server"

import { Resend } from "resend"

// Initialize Resend with the API key or use a placeholder for development
const API_KEY = process.env.RESEND_API_KEY || ""

// Create a safer initialization of Resend
let resend: Resend | null = null
try {
  if (!API_KEY) {
    console.warn("⚠️ RESEND_API_KEY environment variable is not set. Email functionality will not work.")
  } else {
    resend = new Resend(API_KEY)
  }
} catch (error) {
  console.error("Failed to initialize Resend:", error)
}

export async function sendQuestionnaireEmail(formData: any) {
  try {
    console.log("Starting email send process")

    // Check if Resend is properly initialized
    if (!resend) {
      console.error("Resend is not initialized. Please set the RESEND_API_KEY environment variable.")
      return {
        success: false,
        error: "Email service is not configured. Please contact the administrator.",
      }
    }

    const name = formData.name || "Prospect"

    // URL-based information
    const urlInfo = formData.urlFullName
      ? `<h2 style="color: #333; border-bottom: 1px solid #d3c5a6; padding-bottom: 10px;">URL Information</h2>
         <p><strong>URL First Name:</strong> ${formData.urlFirstName || "Not specified"}</p>
         <p><strong>URL Full Name:</strong> ${formData.urlFullName || "Not specified"}</p>`
      : ""

    // Create a comprehensive HTML content with all form data
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #b39656; text-align: center; margin-bottom: 30px;">New Questionnaire Submission</h1>
    
    ${urlInfo}
    
    <h2 style="color: #333; border-bottom: 1px solid #d3c5a6; padding-bottom: 10px;">Contact Information</h2>
    <p><strong>Name:</strong> ${formData.name || "Not specified"}</p>
    <p><strong>Email:</strong> ${formData.email || "Not specified"}</p>
    <p><strong>Company:</strong> ${formData.company || "Not specified"}</p>
    <p><strong>Industry:</strong> ${formData.industry || "Not specified"}</p>
    
    <h2 style="color: #333; border-bottom: 1px solid #d3c5a6; padding-bottom: 10px; margin-top: 30px;">Project Details</h2>
    <p><strong>Project Type:</strong> ${formData.projectType || "Not specified"}</p>
    
    ${
      formData.projectType === "Intelligent AI Automation"
        ? `
      <h3 style="color: #666; margin-top: 20px;">Automation Options</h3>
      <ul style="padding-left: 20px;">
        ${
          formData.automationOptions && formData.automationOptions.length > 0
            ? formData.automationOptions.map((option) => `<li>${option}</li>`).join("")
            : "<li>No options selected</li>"
        }
      </ul>
      ${
        formData.bespokeAutomation
          ? `
        <p><strong>Bespoke Automation Details:</strong> ${formData.bespokeAutomation}</p>
      `
          : ""
      }
    `
        : ""
    }
    
    ${
      formData.projectType === "Strategic Digital Marketing"
        ? `
      <h3 style="color: #666; margin-top: 20px;">Marketing Channels</h3>
      <ul style="padding-left: 20px;">
        ${
          formData.marketingChannels && formData.marketingChannels.length > 0
            ? formData.marketingChannels.map((channel) => `<li>${channel}</li>`).join("")
            : "<li>No channels selected</li>"
        }
      </ul>
      ${
        formData.targetAudience
          ? `
        <p><strong>Target Audience Details:</strong> ${formData.targetAudience}</p>
      `
          : ""
      }
    `
        : ""
    }
    
    ${
      formData.projectType === "Bespoke Web Design & Development"
        ? `
      <h3 style="color: #666; margin-top: 20px;">Website Functionality</h3>
      <ul style="padding-left: 20px;">
        ${
          formData.websiteFunctionality && formData.websiteFunctionality.length > 0
            ? formData.websiteFunctionality.map((func) => `<li>${func}</li>`).join("")
            : "<li>No functionality selected</li>"
        }
      </ul>
      ${
        formData.designPreferences
          ? `
        <p><strong>Design Preferences:</strong> ${formData.designPreferences}</p>
      `
          : ""
      }
    `
        : ""
    }
    
    <h2 style="color: #333; border-bottom: 1px solid #d3c5a6; padding-bottom: 10px; margin-top: 30px;">Timeline & Budget</h2>
    <p><strong>Timeline:</strong> ${formData.timelineOption || "Not specified"}</p>
    <p><strong>Investment Range:</strong> ${formData.investmentRange || "Not specified"}</p>
    
    <h2 style="color: #333; border-bottom: 1px solid #d3c5a6; padding-bottom: 10px; margin-top: 30px;">Goals & Challenges</h2>
    <p><strong>Goals:</strong> ${formData.goals || "Not specified"}</p>
    <p><strong>Challenges:</strong> ${formData.challenges || "Not specified"}</p>
    <p><strong>Additional Information:</strong> ${formData.additionalInfo || "None provided"}</p>
  </div>
`

    console.log("Sending email with Resend")

    // Try different approaches to send the email
    let result

    // Determine the subject line based on URL information
    const subjectName = formData.urlFullName || formData.name || "Prospect"
    const emailSubject = `New Questionnaire Submission from ${subjectName}: ${formData.projectType || "Project Inquiry"}`

    try {
      // First attempt: Try with the verified domain
      result = await resend.emails.send({
        from: "Questionnaire <questionnaire@auctusapex.it>",
        to: "info@auctusapex.it",
        subject: emailSubject,
        html: htmlContent,
        reply_to: "info@auctusapex.it",
      })
    } catch (domainError) {
      console.error("Error sending with domain email, falling back to default sender:", domainError)

      // Fallback: Use Resend's default sender
      result = await resend.emails.send({
        from: "Auctus Apex <onboarding@resend.dev>",
        to: "info@auctusapex.it",
        subject: emailSubject,
        html: htmlContent,
        reply_to: "info@auctusapex.it",
      })
    }

    console.log("Resend API response:", result)

    if (result.error) {
      console.error("Error from Resend API:", result.error)
      return { success: false, error: result.error }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Exception in sendQuestionnaireEmail:", error)
    return {
      success: false,
      error: "Failed to send email. Please try again later or contact us directly.",
    }
  }
}
