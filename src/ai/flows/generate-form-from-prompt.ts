'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates a basic form structure
 * based on a textual description provided by the user. It helps in quickly drafting
 * forms with relevant fields and their properties.
 *
 * - generateFormFromPrompt - The main function to call for generating a form structure.
 * - GenerateFormFromPromptInput - The input type for the function.
 * - GenerateFormFromPromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the schema for a single form field.
 */
const FieldSchema = z.object({
  label: z.string().describe('The display label for the form field.'),
  name: z
    .string()
    .describe(
      'A unique programmatic name for the field (e.g., "firstName"). Should be camelCase.'
    ),
  type: z
    .enum([
      'text',
      'email',
      'number',
      'textarea',
      'select', // For dropdowns
      'radio',
      'checkbox',
      'date',
    ])
    .describe('The type of input field.'),
  placeholder:
    z.string().optional().describe('Text displayed in the input field when no value is present.'),
  required:
    z.boolean().default(false).describe('Whether the field is mandatory for submission.'),
  options:
    z.array(z.string()).optional().describe('Required for "select" and "radio" types. An array of string options for the user to choose from.'),
});

/**
 * Defines the input schema for the generateFormFromPrompt flow.
 */
const GenerateFormFromPromptInputSchema = z
  .string()
  .describe('A textual description of the form purpose.');

export type GenerateFormFromPromptInput = z.infer<
  typeof GenerateFormFromPromptInputSchema
>;

/**
 * Defines the output schema for the generated form structure.
 */
const GenerateFormFromPromptOutputSchema = z.object({
  title: z.string().describe('A concise title for the form.'),
  description:
    z.string().optional().describe('A brief description of the form purpose.'),
  fields: z.array(FieldSchema).describe('An array of field definitions for the form.'),
});

export type GenerateFormFromPromptOutput = z.infer<
  typeof GenerateFormFromPromptOutputSchema
>;

/**
 * Wrapper function to generate a form structure from a prompt.
 * @param input The textual description of the form purpose.
 * @returns A promise that resolves to the generated form structure.
 */
export async function generateFormFromPrompt(
  input: GenerateFormFromPromptInput
): Promise<GenerateFormFromPromptOutput> {
  return generateFormFromPromptFlow(input);
}

/**
 * Defines the Genkit prompt for generating a form structure.
 */
const generateFormFromPromptPrompt = ai.definePrompt({
  name: 'generateFormFromPromptPrompt',
  input: {schema: GenerateFormFromPromptInputSchema},
  output: {schema: GenerateFormFromPromptOutputSchema},
  prompt: `You are an AI assistant specialized in designing user forms.
Your task is to generate a JSON object representing a basic form structure based on the following user's textual description.
Infer the form's purpose and suggest relevant fields, labels, types, placeholders, and whether they are required.
For 'select' and 'radio' field types, generate a list of appropriate options if applicable. Ensure each field has a unique, camelCase 'name' property.

User description: {{{this}}}
`,
});

/**
 * Defines the Genkit flow for generating a form structure from a prompt.
 */
const generateFormFromPromptFlow = ai.defineFlow(
  {
    name: 'generateFormFromPromptFlow',
    inputSchema: GenerateFormFromPromptInputSchema,
    outputSchema: GenerateFormFromPromptOutputSchema,
  },
  async input => {
    const {output} = await generateFormFromPromptPrompt(input);
    if (!output) {
      throw new Error('Failed to generate form structure.');
    }
    return output;
  }
);
