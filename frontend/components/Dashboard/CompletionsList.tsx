import React, { useState } from "react"
import { ApolloClient, gql } from "apollo-boost"
import { Query } from "react-apollo"
import { AllCompletions as AllCompletionsData } from "./__generated__/AllCompletions"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { Typography, CircularProgress } from "@material-ui/core"
import { withRouter } from "next/router"
import CompletionsListWithData from "./CompletionsListWithData"

export const AllCompletionsQuery = gql`
  query AllCompletions($course: String, $cursor: ID) {
    completionsPaginated(course: $course, first: 15, after: $cursor) {
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
              name
            }
          }
        }
        cursor
      }
    }
  }
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textTransform: "uppercase",
      marginTop: "0.7em",
      marginBottom: "0.7em",
    },
  }),
)

interface Variables {
  course: string
}

export interface CompletionsListProps {
  course: string
}
const Completions: React.SFC<CompletionsListProps> = props => {
  const { course } = props
  const [pageNumber, setPageNumber] = useState(1)
  const [prevPage, setPrevPage] = useState()

  return (
    <Query<AllCompletionsData, Variables>
      query={AllCompletionsQuery}
      variables={{ course }}
    >
      {({ loading, error, data, fetchMore }) => {
        if (loading) {
          return <CircularProgress color="secondary" />
        }
        if (error || !data) {
          return (
            <div>
              Error: <pre>{JSON.stringify(error, undefined, 2)}</pre>
            </div>
          )
        }
        const cursor = data.completionsPaginated.pageInfo.endCursor
        console.log("data", data.completionsPaginated)
        return (
          <CompletionsListWithData
            completions={data}
            onLoadMore={() =>
              fetchMore({
                query: AllCompletionsQuery,
                variables: { course: course, cursor: cursor },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  const newCompletions = fetchMoreResult.completionsPaginated
                  const newCursor = newCompletions.pageInfo.endCursor
                  //store the amount of pages gone forward in pagenumber
                  setPageNumber(pageNumber + 1)
                  return {
                    cursor: newCursor,
                    completionsPaginated: {
                      pageInfo: {
                        hasNextPage: newCompletions.pageInfo.hasNextPage,
                        hasPreviousPage: true,
                        startCursor: newCompletions.pageInfo.startCursor,
                        endCursor: newCompletions.pageInfo.endCursor,
                        __typename: "PageInfo",
                      },
                      edges: newCompletions.edges,
                      __typename: "CompletionConnection",
                    },
                  }
                },
              })
            }
            pageNumber={pageNumber}
          />
        )
      }}
    </Query>
  )
}
const CompletionsList = withRouter(props => {
  console.log(props)
  const classes = useStyles()
  const { router } = props
  return (
    <section>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom={true}
        className={classes.title}
      >
        Completions
      </Typography>
      <Completions course={router.query.course} />
    </section>
  )
})

export default CompletionsList
