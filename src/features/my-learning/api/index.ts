import {ChildDataProps, graphql} from "react-apollo";
import gql from "graphql-tag";

const query = gql`
    query CoursesQuery {
        courses {
            id
            shortname
            fullname
            description
        }
    }
    `

export type Course = {
  id: number
  shortname: string
  fullname?: string
};

export type Response = {
  courses: Course[];
}

type ChildProps = ChildDataProps<{}, Response>

type Variables = {}

export const courseList = graphql<{}, Response, Variables, ChildProps>(query)

//export const courseList = graphql(query)
