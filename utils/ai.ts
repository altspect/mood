import { OpenAI } from 'langchain/llms/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import z from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { TypedPromptInputValues } from '@langchain/core/prompts';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    subject: z
      .string()
      .describe('the mood of the person who wrote the journal entry.'),
    summary: z
      .string()
      .describe('quick summary of the entire entry.'),
    negative: z.boolean().describe('is the journal entry negative? (i.e. does it contain negative emotions?).'),
    color: z
      .string()
      .describe('a hexadecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.')
  })
);

const getPrompt = async (content: any) => {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template: 'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n {format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions }
  });

  const input: any = await prompt.format({
    entry: content,
  });

  return input;
}

export const analyze = async (content) => {
  const input = await getPrompt(content);
  const model: any = new OpenAI( { temperature: 0, modelName: 'gpt-3.5-turbo'});
  const result = await model.call(input);

  try {
    return parser.parse(result);
  } catch (e) {
    console.log(e);
  }
}
