export const chooseActionSchema = {
  name: "choose_action",
  description: `Decide which JSON structure to return

  rules###
  - keep the language of the user's message
  - always use date in format like YYYY-MM-DD (for example: 2023-12-31)
  `,
  parameters: {
    type: "object",
    properties: {
      tool: {
        type: "string",
        description: `  
        Set tool as following:
        - ToDo if this is a typical task
        - Calendar only if some date (or time) is provided (even in relative format like: Tomorrow)
        
        examples###
        Muszę kupić masło pojutrze
        {"tool": "Calendar"}
        Zanotuj proszę, że muszę wyjść z psami
        {"tool": "ToDo"}
        `,
        enum: ["ToDo", "Calendar"],
      },
      desc: {
        type: "string",
        description: `Convert user prompt to very short task description. Example: Muszę kupić jutro bułki -> Kupić bułki"`,
      },
      date: {
        type: "string",
        format: "YYYY-MM-DD",
        description: `it's an optional property when some date is provided (even in relative format like: Tomorrow)`,
      },
    },
    required: ["tool", "desc"],
  },
};
