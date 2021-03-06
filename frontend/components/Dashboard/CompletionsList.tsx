import React, { useState } from "react"
import { gql } from "apollo-boost"
import {
  AllCompletions as AllCompletionsData,
  AllCompletions_completionsPaginated_edges,
} from "/static/types/generated/AllCompletions"
import { AllCompletionsPrevious as AllCompletionsPreviousData } from "/static/types/generated/AllCompletionsPrevious"
import { CircularProgress } from "@material-ui/core"
import { useRouter } from "next/router"
import CompletionsListWithData from "./CompletionsListWithData"
import CourseLanguageContext from "/contexes/CourseLanguageContext"
import { useQuery } from "@apollo/react-hooks"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"

export const AllCompletionsQuery = gql`
  query AllCompletions(
    $course: String
    $cursor: ID
    $completionLanguage: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completionLanguage
      first: 15
      after: $cursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          email
          completion_language
          created_at
          user {
            id
            first_name
            last_name
            student_number
          }
          course {
            id
            name
          }
          completions_registered {
            id
            organization {
              id
              slug
            }
          }
        }
      }
    }
  }
`
export const PreviousPageCompletionsQuery = gql`
  query AllCompletionsPrevious(
    $course: String
    $cursor: ID
    $completionLanguage: String
  ) {
    completionsPaginated(
      course: $course
      completion_language: $completionLanguage
      last: 15
      before: $cursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          email
          completion_language
          created_at
          user {
            id
            first_name
            last_name
            student_number
          }
          course {
            id
            name
          }
          completions_registered {
            id
            organization {
              id
              slug
            }
          }
        }
      }
    }
  }
`
const CompletionsList = () => {
  const router = useRouter()
  const completionLanguage = React.useContext(CourseLanguageContext)

  const course: string | string[] = router?.query?.id ?? ""

  interface queryDetailsInterface {
    start: string | null
    end: string | null
    back: boolean
    page: number
  }

  const [queryDetails, setQueryDetails] = useState<queryDetailsInterface>({
    start: null,
    end: null,
    back: false,
    page: 1,
  })

  const query = queryDetails.back
    ? PreviousPageCompletionsQuery
    : AllCompletionsQuery

  const cursor = queryDetails.back ? queryDetails.end : queryDetails.start

  interface Variables {
    cursor: string | null
    course: string | string[]
    completionLanguage?: string
  }

  const variables: Variables = {
    cursor,
    course,
    completionLanguage:
      completionLanguage !== "" ? completionLanguage : undefined,
  }

  const { data, loading, error } = useQuery<
    AllCompletionsData | AllCompletionsPreviousData
  >(query, {
    variables,
    fetchPolicy: "network-only",
  })

  if (!course) {
    return <div>no course!</div>
  }

  if (loading) {
    return <CircularProgress color="secondary" />
  }
  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  if (!data) {
    return <div>no data</div>
  }

  const completions = data.completionsPaginated.edges.map(
    (edge: AllCompletions_completionsPaginated_edges) => edge.node,
  )
  const startCursor = data.completionsPaginated.pageInfo.startCursor
  const endCursor = data.completionsPaginated.pageInfo.endCursor

  return (
    <CompletionsListWithData
      completions={completions}
      onLoadMore={() =>
        setQueryDetails({
          start: endCursor,
          end: startCursor,
          back: false,
          page: queryDetails.page + 1,
        })
      }
      onGoBack={() =>
        setQueryDetails({
          start: endCursor,
          end: startCursor,
          back: true,
          page: queryDetails.page - 1,
        })
      }
      pageNumber={queryDetails.page}
    />
  )
}

export default CompletionsList
