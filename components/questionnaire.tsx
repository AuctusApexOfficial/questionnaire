"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronRight, Send, Loader2 } from "lucide-react"
import Image from "next/image"
import { sendQuestionnaireEmail } from "@/actions/send-email"

export function Questionnaire({
  firstName,
  fullName,
  isNamedUrl = false,
}: {
  firstName?: string
  fullName?: string
  isNamedUrl?: boolean
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "Prospect", // Pre-filled with placeholder
    email: "prospect@example.com", // Pre-filled with placeholder
    company: "Prospect Company", // Pre-filled with placeholder
    industry: "Technology", // Pre-filled with placeholder
    projectType: "", // Changed from array to string
    budget: "",
    timeline: "",
    goals: "",
    challenges: "",
    additionalInfo: "",
    // New fields for conditional step 3
    automationOptions: [] as string[], // Array for multiple selections
    bespokeAutomation: "", // Text field for bespoke option
    marketingChannels: [] as string[], // Changed to array for multiple selections
    targetAudience: "",
    designPreferences: "",
    websiteFunctionality: [] as string[], // Changed to array for multiple selections
    // New fields for step 4
    timelineOption: "",
    investmentRange: "",
    // URL-based information
    urlFirstName: firstName || "",
    urlFullName: fullName || "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [showContactStep, setShowContactStep] = useState(!isNamedUrl)

  const questionnaireTopRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        [name]: [...(prev[name as keyof typeof formData] as string[]), value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: (prev[name as keyof typeof formData] as string[]).filter((item) => item !== value),
      }))
    }
  }

  const handleServiceSelect = (service: string) => {
    setFormData((prev) => ({ ...prev, projectType: service }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
    // Scroll to the top of the questionnaire
    if (questionnaireTopRef.current) {
      questionnaireTopRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
    // Scroll to the top of the questionnaire
    if (questionnaireTopRef.current) {
      questionnaireTopRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Function to check if page 3 selections are valid
  const isPage3Valid = () => {
    if (formData.projectType === "Intelligent AI Automation") {
      return formData.automationOptions.length > 0
    } else if (formData.projectType === "Strategic Digital Marketing") {
      return formData.marketingChannels.length > 0
    } else if (formData.projectType === "Bespoke Web Design & Development") {
      return formData.websiteFunctionality.length > 0
    }
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted, sending email...")

    // If we need to show the contact step and we're not already showing it,
    // show it instead of submitting
    if (showContactStep && currentStep !== 6) {
      setCurrentStep(6) // Go to contact info step
      if (questionnaireTopRef.current) {
        questionnaireTopRef.current.scrollIntoView({ behavior: "smooth" })
      }
      return
    }

    // Validate based on current step
    if (currentStep === 5 && (formData.goals === "" || formData.challenges === "")) {
      console.log("Required fields missing")
      alert("Please fill in all required fields before submitting.")
      return
    }

    if (currentStep === 6 && (formData.name === "" || formData.email === "")) {
      console.log("Required contact fields missing")
      alert("Please provide your name and email address.")
      return
    }

    // Reset error state
    setSubmitError(null)

    // Set loading state
    setIsSubmitting(true)

    try {
      // For development/demo purposes, simulate a successful submission if no API key
      if (process.env.NODE_ENV === "development" && !process.env.RESEND_API_KEY) {
        console.log("Development mode: Simulating successful email submission")
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setSubmitted(true)
        return
      }

      // Send the email using Resend
      console.log("Calling sendQuestionnaireEmail with form data:", formData)
      const result = await sendQuestionnaireEmail(formData)
      console.log("Email send result:", result)

      if (!result.success) {
        console.error("Failed to send email:", result.error)
        setSubmitError(
          typeof result.error === "string"
            ? result.error
            : "There was an issue sending your submission. Please try again or contact us directly.",
        )
        setIsSubmitting(false)
        return
      }

      // If successful, update the UI
      console.log("Email sent successfully")
      setIsSubmitting(false)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError("There was an error processing your submission. Please try again later.")
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white border border-[#d3c5a6]/30 rounded-lg p-12 shadow-sm text-center">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Auctus Apex" width={90} height={90} className="h-[90px] w-auto" />
        </div>
        <h3 className="text-3xl font-serif text-[#333] mb-6 tracking-wide font-light">Thank You</h3>
        <p className="text-[#666] mb-8 font-body text-xl tracking-wide leading-relaxed">
          Your responses have been submitted successfully. Our team will review your information and prepare for our
          upcoming consultation.
        </p>
        <div className="elegant-divider w-48 mx-auto mb-8"></div>
        <p className="text-[#b39656] italic font-accent text-xl tracking-wide">
          "Ad astra per aspera" • To the stars through difficulties
        </p>
      </div>
    )
  }

  return (
    <div ref={questionnaireTopRef} className="bg-white border border-[#d3c5a6]/30 rounded-lg p-8 md:p-10 shadow-sm">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex flex-col items-center ${currentStep === step ? "opacity-100" : "opacity-50"}`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                  currentStep >= step ? "bg-[#b39656] text-white" : "bg-[#f0ebe0] text-[#b39656]"
                }`}
              >
                <span className="font-serif">{step}</span>
              </div>
              <div className="text-sm text-[#666] hidden md:block font-body tracking-wide small-caps">
                {step === 1
                  ? "Introduction"
                  : step === 2
                    ? "Service Selection"
                    : step === 3
                      ? "Service Details"
                      : step === 4
                        ? "Timeline & Budget"
                        : "Goals & Challenges"}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1 bg-[#f0ebe0] rounded-full">
          <div
            className="h-1 bg-[#b39656] rounded-full transition-all duration-300"
            style={{ width: `${(Math.min(currentStep - 1, 4) / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {submitError && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
          <p className="font-body">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-[#333] text-xl font-body mb-6 leading-relaxed">
                Thanks again for booking a meeting with us at Auctus Apex
                {firstName ? ` ${firstName}` : ""} — we're excited to learn more about your business.
              </p>

              <p className="text-[#333] text-xl font-body mb-6 leading-relaxed">
                To make the most of our call, please take a minute to answer a few quick questions. This will help us
                tailor the conversation to your goals in Web Development, Marketing, or AI Automation.
              </p>

              <p className="text-[#b39656] text-xl font-serif italic mt-8 mb-4">— The Auctus Apex Team</p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 bg-[#b39656] text-white rounded-md hover:bg-[#a38646] transition-colors flex items-center font-serif tracking-wide luxury-button mx-auto"
              >
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#333] mb-6 tracking-wide font-light">Project Details</h3>

            <div>
              <label
                className="block text-xl font-serif text-[#333] mb-6 tracking-wide font-light"
                style={{ letterSpacing: "0.02em" }}
              >
                Which area are you most interested in exploring? <span className="text-[#b39656]">*</span>
              </label>
              <div className="grid grid-cols-1 gap-6">
                {[
                  {
                    title: "Intelligent AI Automation",
                    description:
                      "Thoughtfully designed systems that reduce manual effort, improve consistency, and quietly power growth behind the scenes.",
                  },
                  {
                    title: "Strategic Digital Marketing",
                    description:
                      "Carefully crafted strategies to communicate your brand with clarity, reach the right audience, and build momentum through precision.",
                  },
                  {
                    title: "Bespoke Web Design & Development",
                    description:
                      "Tailored digital experiences that combine aesthetic harmony with functional intent — designed to reflect the essence of your brand.",
                  },
                ].map((option) => (
                  <div
                    key={option.title}
                    className={`border rounded-lg p-5 transition-all duration-200 cursor-pointer ${
                      formData.projectType === option.title
                        ? "border-[#b39656] bg-[#fcfaf5]"
                        : "border-[#d3c5a6]/30 hover:border-[#b39656]/50"
                    }`}
                    onClick={() => handleServiceSelect(option.title)}
                  >
                    <div className="flex items-start">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="radio"
                          id={option.title.replace(/\s+/g, "-").toLowerCase()}
                          name="projectType"
                          value={option.title}
                          checked={formData.projectType === option.title}
                          onChange={handleRadioChange}
                          className="sr-only" // Hide the actual radio button but keep it accessible
                        />
                        <div
                          className={`h-5 w-5 rounded-full border ${
                            formData.projectType === option.title ? "border-[#b39656] bg-[#b39656]" : "border-[#d3c5a6]"
                          }`}
                        ></div>
                        {formData.projectType === option.title && (
                          <div className="absolute h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <label
                          htmlFor={option.title.replace(/\s+/g, "-").toLowerCase()}
                          className={`text-[#333] font-serif text-xl font-light ${
                            formData.projectType === option.title ? "text-[#b39656]" : ""
                          }`}
                        >
                          {option.title}
                        </label>
                        <p className="text-[#666] font-body mt-2">{option.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            {formData.projectType === "Intelligent AI Automation" && (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-serif text-[#333] mb-3 tracking-wide font-light">
                    Which areas of automation are most relevant to you right now?{" "}
                    <span className="text-[#b39656]">*</span>
                  </h3>
                  <p className="text-[#666] font-body text-lg mb-6 italic">Select at least one option</p>
                </div>

                <div className="space-y-4">
                  {[
                    "Streamlining lead intake",
                    "Automating email follow-ups",
                    "Proposal or chatbot assistance",
                    "CRM and workflow refinement",
                    "Something more bespoke (feel free to note)",
                  ].map((option) => (
                    <div key={option} className="flex items-start">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="checkbox"
                          id={option.replace(/\s+/g, "-").toLowerCase()}
                          name="automationOptions"
                          value={option}
                          checked={formData.automationOptions.includes(option)}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 text-[#b39656] border-[#d3c5a6] rounded focus:ring-[#b39656]"
                        />
                      </div>
                      <label
                        htmlFor={option.replace(/\s+/g, "-").toLowerCase()}
                        className="ml-3 text-[#333] font-serif text-xl font-light"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.automationOptions.includes("Something more bespoke (feel free to note)") && (
                  <div className="mt-8 relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4">
                      <div className="w-8 h-[1px] bg-[#d3c5a6]"></div>
                    </div>
                    <div className="border border-[#d3c5a6]/50 rounded-lg px-6 py-3 bg-[#fcfaf5] transition-all duration-300 animate-fadeIn">
                      <p className="text-[#b39656] font-serif text-lg italic mb-2">Share your vision</p>
                      <textarea
                        id="bespokeAutomation"
                        name="bespokeAutomation"
                        value={formData.bespokeAutomation}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-5 py-4 border-0 border-b border-[#d3c5a6]/30 rounded-t-md bg-transparent focus:outline-none focus:ring-0 focus:border-[#b39656] font-body text-lg transition-all duration-200"
                        placeholder="We'd love to hear more about any specific automation needs or unique requirements..."
                        style={{
                          boxShadow: "none",
                          background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                        }}
                      ></textarea>
                    </div>
                  </div>
                )}
              </>
            )}

            {formData.projectType === "Strategic Digital Marketing" && (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-serif text-[#333] mb-3 tracking-wide font-light">
                    Which aspects of marketing would you like to focus on? <span className="text-[#b39656]">*</span>
                  </h3>
                  <p className="text-[#666] font-body text-lg mb-6 italic">Select at least one option</p>
                </div>

                <div className="space-y-4">
                  {[
                    "Social media presence",
                    "Targeted advertising (e.g., Google Ads)",
                    "Email engagement strategies",
                    "Funnel architecture",
                    "Content creation",
                    "Other priorities (feel free to note)",
                  ].map((option) => (
                    <div key={option} className="flex items-start">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="checkbox"
                          id={option.replace(/\s+/g, "-").toLowerCase()}
                          name="marketingChannels"
                          value={option}
                          checked={formData.marketingChannels.includes(option)}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 text-[#b39656] border-[#d3c5a6] rounded focus:ring-[#b39656]"
                        />
                      </div>
                      <label
                        htmlFor={option.replace(/\s+/g, "-").toLowerCase()}
                        className="ml-3 text-[#333] font-serif text-xl font-light"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.marketingChannels.includes("Other priorities (feel free to note)") && (
                  <div className="mt-8 relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4">
                      <div className="w-8 h-[1px] bg-[#d3c5a6]"></div>
                    </div>
                    <div className="border border-[#d3c5a6]/50 rounded-lg px-6 py-3 bg-[#fcfaf5] transition-all duration-300 animate-fadeIn">
                      <p className="text-[#b39656] font-serif text-lg italic mb-2">Share your vision</p>
                      <textarea
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-5 py-4 border-0 border-b border-[#d3c5a6]/30 rounded-t-md bg-transparent focus:outline-none focus:ring-0 focus:border-[#b39656] font-body text-lg transition-all duration-200"
                        placeholder="Please share insights about your target audience and any specific marketing goals you're working toward..."
                        style={{
                          boxShadow: "none",
                          background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                        }}
                      ></textarea>
                    </div>
                  </div>
                )}
              </>
            )}

            {formData.projectType === "Bespoke Web Design & Development" && (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-serif text-[#333] mb-3 tracking-wide font-light">
                    What kind of website are you interested in? <span className="text-[#b39656]">*</span>
                  </h3>
                  <p className="text-[#666] font-body text-lg mb-6 italic">Select at least one option</p>
                </div>

                <div className="space-y-4">
                  {[
                    "A professional, informational website",
                    "A full-featured e-commerce website",
                    "A redesign of an existing site",
                    "Ongoing updates or maintenance",
                    "Something more tailored — happy to share more",
                  ].map((option) => (
                    <div key={option} className="flex items-start">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="checkbox"
                          id={option.replace(/\s+/g, "-").toLowerCase()}
                          name="websiteFunctionality"
                          value={option}
                          checked={formData.websiteFunctionality.includes(option)}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 text-[#b39656] border-[#d3c5a6] rounded focus:ring-[#b39656]"
                        />
                      </div>
                      <label
                        htmlFor={option.replace(/\s+/g, "-").toLowerCase()}
                        className="ml-3 text-[#333] font-serif text-xl font-light"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>

                {formData.websiteFunctionality.includes("Something more tailored — happy to share more") && (
                  <div className="mt-8 relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-4">
                      <div className="w-8 h-[1px] bg-[#d3c5a6]"></div>
                    </div>
                    <div className="border border-[#d3c5a6]/50 rounded-lg px-6 py-3 bg-[#fcfaf5] transition-all duration-300 animate-fadeIn">
                      <p className="text-[#b39656] font-serif text-lg italic mb-2">Share your vision</p>
                      <textarea
                        id="designPreferences"
                        name="designPreferences"
                        value={formData.designPreferences}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-5 py-4 border-0 border-b border-[#d3c5a6]/30 rounded-t-md bg-transparent focus:outline-none focus:ring-0 focus:border-[#b39656] font-body text-lg transition-all duration-200"
                        placeholder="Tell us about any design preferences, functionality, or features you envision for your site..."
                        style={{
                          boxShadow: "none",
                          background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                        }}
                      ></textarea>
                    </div>
                  </div>
                )}
              </>
            )}

            {!formData.projectType && (
              <div className="text-center py-8">
                <p className="text-[#666] italic font-body text-xl">
                  Please select a service in the previous step to continue.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-12">
            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-serif text-[#333] mb-3 tracking-wide font-light">
                  Timeline <span className="text-[#b39656]">*</span>
                </h3>
                <p className="text-[#666] font-body text-lg mb-6 italic">
                  Do you have a timeline in mind?
                  <br />
                  Knowing this helps us plan accordingly and ensure alignment.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Within 48 hours",
                  "Within the next 7 days",
                  "Within the next 2 weeks",
                  "Within the next month",
                  "Flexible — no fixed date",
                  "Not sure yet",
                ].map((option) => (
                  <div
                    key={option}
                    className={`border rounded-lg p-5 transition-all duration-200 cursor-pointer ${
                      formData.timelineOption === option
                        ? "border-[#b39656] bg-[#fcfaf5]"
                        : "border-[#d3c5a6]/30 hover:border-[#b39656]/50"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, timelineOption: option }))}
                  >
                    <div className="flex items-start">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="radio"
                          id={`timeline-${option.replace(/\s+/g, "-").toLowerCase()}`}
                          name="timelineOption"
                          value={option}
                          checked={formData.timelineOption === option}
                          onChange={handleRadioChange}
                          className="sr-only" // Hide the actual radio button but keep it accessible
                        />
                        <div
                          className={`h-5 w-5 rounded-full border ${
                            formData.timelineOption === option ? "border-[#b39656] bg-[#b39656]" : "border-[#d3c5a6]"
                          }`}
                        ></div>
                        {formData.timelineOption === option && (
                          <div className="absolute h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <label
                          htmlFor={`timeline-${option.replace(/\s+/g, "-").toLowerCase()}`}
                          className={`text-[#333] font-serif text-xl font-light ${
                            formData.timelineOption === option ? "text-[#b39656]" : ""
                          }`}
                        >
                          {option}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-8">
                <h3 className="text-2xl font-serif text-[#333] mb-3 tracking-wide font-light">
                  Investment Range <span className="text-[#b39656]">*</span>
                </h3>
                <p className="text-[#666] font-body text-lg mb-6 italic">
                  Do you have an investment range in mind?
                  <br />
                  This simply helps us recommend the right path forward — no pressure at all.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Under $3,000",
                  "$3,000 – $7,000",
                  "$7,000 – $15,000",
                  "$15,000+",
                  "I'd prefer to discuss this during the call",
                ].map((option) => (
                  <div
                    key={option}
                    className={`border rounded-lg p-5 transition-all duration-200 cursor-pointer ${
                      formData.investmentRange === option
                        ? "border-[#b39656] bg-[#fcfaf5]"
                        : "border-[#d3c5a6]/30 hover:border-[#b39656]/50"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, investmentRange: option }))}
                  >
                    <div className="flex items-start">
                      <div className="relative flex items-center justify-center mt-1">
                        <input
                          type="radio"
                          id={`investment-${option.replace(/\s+/g, "-").toLowerCase()}`}
                          name="investmentRange"
                          value={option}
                          checked={formData.investmentRange === option}
                          onChange={handleRadioChange}
                          className="sr-only" // Hide the actual radio button but keep it accessible
                        />
                        <div
                          className={`h-5 w-5 rounded-full border ${
                            formData.investmentRange === option ? "border-[#b39656] bg-[#b39656]" : "border-[#d3c5a6]"
                          }`}
                        ></div>
                        {formData.investmentRange === option && (
                          <div className="absolute h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <label
                          htmlFor={`investment-${option.replace(/\s+/g, "-").toLowerCase()}`}
                          className={`text-[#333] font-serif text-xl font-light ${
                            formData.investmentRange === option ? "text-[#b39656]" : ""
                          }`}
                        >
                          {option}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#333] mb-6 tracking-wide font-light">Goals & Challenges</h3>

            <div>
              <label
                htmlFor="goals"
                className="block text-xl font-serif text-[#333] mb-4 tracking-wide font-light"
                style={{ letterSpacing: "0.02em" }}
              >
                What are your primary goals for this project? <span className="text-[#b39656]">*</span>
              </label>
              <div className="border border-[#d3c5a6]/50 rounded-lg bg-[#fcfaf5] transition-all duration-300">
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-5 py-4 border-0 border-b border-[#d3c5a6]/30 rounded-t-md bg-transparent focus:outline-none focus:ring-0 focus:border-[#b39656] font-body text-lg transition-all duration-200"
                  placeholder="Please describe what you hope to achieve..."
                  style={{
                    boxShadow: "none",
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                  }}
                ></textarea>
              </div>
            </div>

            <div>
              <label
                htmlFor="challenges"
                className="block text-xl font-serif text-[#333] mb-4 tracking-wide font-light"
                style={{ letterSpacing: "0.02em" }}
              >
                What challenges are you currently facing? <span className="text-[#b39656]">*</span>
              </label>
              <div className="border border-[#d3c5a6]/50 rounded-lg bg-[#fcfaf5] transition-all duration-300">
                <textarea
                  id="challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-5 py-4 border-0 border-b border-[#d3c5a6]/30 rounded-t-md bg-transparent focus:outline-none focus:ring-0 focus:border-[#b39656] font-body text-lg transition-all duration-200"
                  placeholder="Please describe any obstacles or pain points..."
                  style={{
                    boxShadow: "none",
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                  }}
                ></textarea>
              </div>
            </div>

            <div>
              <label
                htmlFor="additionalInfo"
                className="block text-xl font-serif text-[#333] mb-4 tracking-wide font-light"
                style={{ letterSpacing: "0.02em" }}
              >
                Additional Information (Optional)
              </label>
              <div className="border border-[#d3c5a6]/50 rounded-lg bg-[#fcfaf5] transition-all duration-300">
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-5 py-4 border-0 border-b border-[#d3c5a6]/30 rounded-t-md bg-transparent focus:outline-none focus:ring-0 focus:border-[#b39656] font-body text-lg transition-all duration-200"
                  placeholder="Any other details you'd like to share..."
                  style={{
                    boxShadow: "none",
                    background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))",
                  }}
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-serif text-[#333] mb-6 tracking-wide font-light">Contact Information</h3>
            <p className="text-[#666] font-body text-lg mb-6">
              Please provide your contact details so we can follow up with you.
            </p>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xl font-serif text-[#333] mb-2 tracking-wide font-light"
                  style={{ letterSpacing: "0.02em" }}
                >
                  Full Name <span className="text-[#b39656]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border border-[#d3c5a6]/30 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#b39656] focus:border-[#b39656] font-body text-lg transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xl font-serif text-[#333] mb-2 tracking-wide font-light"
                  style={{ letterSpacing: "0.02em" }}
                >
                  Email Address <span className="text-[#b39656]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border border-[#d3c5a6]/30 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#b39656] focus:border-[#b39656] font-body text-lg transition-all duration-200"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-xl font-serif text-[#333] mb-2 tracking-wide font-light"
                  style={{ letterSpacing: "0.02em" }}
                >
                  Company (Optional)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-[#d3c5a6]/30 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#b39656] focus:border-[#b39656] font-body text-lg transition-all duration-200"
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="px-8 py-3 border border-[#d3c5a6] text-[#b39656] rounded-md hover:bg-[#f9f7f2] transition-colors font-serif tracking-wide luxury-button"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep > 1 && currentStep < 5 ? (
            <button
              type="button"
              onClick={() => {
                // For page 3, check if at least one option is selected based on project type
                if (currentStep === 3 && !isPage3Valid()) {
                  alert("Please select at least one option to continue.")
                  return
                }

                // For page 4, check if both timeline and investment range are selected
                if (currentStep === 4 && (!formData.timelineOption || !formData.investmentRange)) {
                  alert("Please select both a timeline and investment range to continue.")
                  return
                }

                // First increment the step
                setCurrentStep((prev) => prev + 1)

                // Then scroll to the top of the questionnaire
                if (questionnaireTopRef.current) {
                  setTimeout(() => {
                    questionnaireTopRef.current?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }
              }}
              disabled={
                (currentStep === 3 && !isPage3Valid()) ||
                (currentStep === 4 && (!formData.timelineOption || !formData.investmentRange))
              }
              className={`px-8 py-3 bg-[#b39656] text-white rounded-md hover:bg-[#a38646] transition-colors flex items-center font-serif tracking-wide luxury-button ${
                (currentStep === 3 && !isPage3Valid()) ||
                (currentStep === 4 && (!formData.timelineOption || !formData.investmentRange))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          ) : currentStep === 5 || currentStep === 6 ? (
            <button
              type="submit"
              className="px-8 py-3 bg-[#b39656] text-white rounded-md hover:bg-[#a38646] transition-colors flex items-center font-serif tracking-wide luxury-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Submit <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </form>
    </div>
  )
}

export default Questionnaire
