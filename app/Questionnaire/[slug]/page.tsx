import Questionnaire from "@/components/questionnaire"

export default function CustomQuestionnaire({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const fullName = slug.replace(/-/g, " ")
  const firstName = fullName.split(" ")[0]
  const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1)

  return <Questionnaire firstName={capitalized} fullSlug={fullName} />
}
