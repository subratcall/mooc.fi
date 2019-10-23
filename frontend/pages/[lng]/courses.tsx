import * as React from "react"
import { Typography } from "@material-ui/core"
import { NextPageContext as NextContext } from "next"
import { isSignedIn, isAdmin } from "/lib/authentication"
import redirect from "/lib/redirect"
import { AllEditorCourses } from "/static/types/generated/AllEditorCourses"
import { useQuery } from "@apollo/react-hooks"
import CourseGrid from "/components/CourseGrid"
import AdminError from "/components/Dashboard/AdminError"
import { WideContainer } from "/components/Container"
import styled from "styled-components"
import Spinner from "/components/Spinner"
import DashboardBreadCrumbs from "/components/Dashboard/DashboardBreadCrumbs"

import { AllEditorCoursesQuery } from "/graphql/queries/courses"

const Header = styled(Typography)`
  margin-top: 1em;
`

const Courses = (admin: boolean) => {
  const { loading, error, data } = useQuery<AllEditorCourses>(
    AllEditorCoursesQuery,
  )

  if (error) {
    ;<div>
      Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
    </div>
  }

  if (!admin) {
    return <AdminError />
  }

  if (loading || !data) {
    return <Spinner />
  }

  return (
    <section>
      <DashboardBreadCrumbs />
      <WideContainer>
        <Header component="h1" variant="h2" gutterBottom={true} align="center">
          All Courses
        </Header>
        <CourseGrid courses={data.courses} />
      </WideContainer>
    </section>
  )
}

Courses.getInitialProps = function(context: NextContext) {
  const admin = isAdmin(context)
  if (!isSignedIn(context)) {
    redirect(context, "/sign-in")
  }
  return {
    admin,
  }
}

export default Courses
