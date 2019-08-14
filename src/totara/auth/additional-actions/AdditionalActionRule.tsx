import React , { ReactNode }from "react";
import { Text } from "react-native";
import { Query } from "react-apollo";
import { Response, QueryMe }  from "./api";

class QueryGQL extends Query<Response> {}

type Params = {
  children : ReactNode
}

const AdditionalActionRule = ({children}: Params) => {
  return (
    <QueryGQL  query = { QueryMe }>
    
    {({ loading, data, error }) => {
      if (loading) return <Text>Loading...</Text>;
      if (error) return <Text>Error!</Text>;
      if (data && (!data.me.system.request_policy_agreement || !data.me.system.request_user_consent || !data.me.system.request_user_fields)) {
        return children
      } else {
        return null;
      }
    }}
  </QueryGQL>
  )
}

  export default AdditionalActionRule;