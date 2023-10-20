import { Prompt } from "@/lib/game/schema/prompt";
/**
 * Profile Image Prompt
 * ====================
 *
 * This prompt belowwill be used to generate the player profile image.
 *
 * When it is run, it will have access to the following variables:
 *
 * - name:         The name of the character.
 * - description:  The description of the character.
 * - background:   The background of the character.
 * - tone:         The tone of the story.
 * - genre:        The genre of the story.
 *
 * To use these variables, enclose them in curly brackets, like this:
 *
 *     (pixel art) 16-bit retro-game style profile picture {name}
 *
 * You do not need to use all/any of the variables in your prompt.
 *
 * Have fun!
 *
 */

const ProfileImagePrompt: Prompt = {
  name: "profile_image_prompt",
  newlines_to_spaces: true,
  value: `
(pixel art) 16-bit retro-game style profile picture of a hero on an adventure.
The hero's name is: {name}.
The hero has the following background: {background}.
The hero has a description of: {description}.
`,
};

export default ProfileImagePrompt;
