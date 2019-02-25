import {ChildDataProps, graphql} from "react-apollo";
import gql from "graphql-tag";

const query = gql`
  query CurrentLearning {
    currentLearning {
      id
      type
      shortname
      fullname
      summary
      dueDateState
      dueDate
      progressPercentage 
      groupCount
      activities {
        id
        type
        itemName
      }
    }
  }
  `

export type Activity = {
  id: number,
  type: string,
  itemName: string
}

export type LearningItem = {
  id: number
  type: string
  shortname: string
  fullname?: string
  summary?: string
  dueDateState?: string
  dueDate?: Date
  progressPercentage?: number
  groupCount?: number
};

export type Response = {
  currentLearning: LearningItem[];
}

type ChildProps = ChildDataProps<{}, Response>

type Variables = {}

export const learningItemsList = graphql<{}, Response, Variables, ChildProps>(query)

//export const courseList = graphql(query)
