import Template from "../types/Template"
import { prisma } from "../../../generated/prisma-client"

export class Grade extends Template {
  async resolve() {
    const course = (
      await prisma.courses({
        where: { completion_email: { id: this.emailTemplate.id } },
      })
    )[0]
    if (!course) {
      return ""
    }
    const grade = (
      await prisma.completions({
        where: { user: { id: this.user.id }, course: { id: course.id } },
        orderBy: "completion_date_DESC",
      })
    )[0]?.grade
    return `${grade}`
  }
}
