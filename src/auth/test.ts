import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ProfileInput {
  @Field(() => String)
  propertyName: string;

  // Add other fields as needed
}
