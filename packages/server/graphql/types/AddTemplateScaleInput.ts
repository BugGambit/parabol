import {GraphQLBoolean, GraphQLInputObjectType, GraphQLNonNull, GraphQLString} from 'graphql'

const AddTemplateScaleInput = new GraphQLInputObjectType({
  name: 'AddTemplateScaleInput',
  description: 'Input for adding a new scale',
  fields: () => ({
    color: {
      description: 'The color used to visually group a scale value',
      type: new GraphQLNonNull(GraphQLString)
    },
    label: {
      description: 'The label for this value, e.g., XS, M, L',
      type: new GraphQLNonNull(GraphQLString)
    },
    isSpecial: {
      description: 'True if this is a special scale value; false/null otherwise',
      type: GraphQLBoolean
    }
  })
})

export default AddTemplateScaleInput
