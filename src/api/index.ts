import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import TemplateApiResponse from '../interfaces/TemplateAPIResponse';

const router = express.Router();

router.post('/validate-template',
  body('template').isString(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: TemplateApiResponse = { success: false, errors: errors.array() };
      return res.status(400).json(response);
    }

    const { template } = req.body;
    const placeholderRegex = /{{\s*[a-zA-Z_][a-zA-Z_0-9]*\s*}}/g;
    const placeholders = template.match(placeholderRegex);

    if (!placeholders) {
      const response: TemplateApiResponse = { success: false, message: 'Invalid template format' };
      if (template.includes('{{') && !template.includes('}}')) {
        response.message = 'Invalid template format: missing closing "}}" for a placeholder';
      } else if (template.match(/{{\s*[^a-zA-Z_][^}]*\s*}}/g) || template.match(/{{\s*[a-zA-Z_]*\d+[a-zA-Z_]*\s*}}/g)) {
        response.message = 'Invalid template format: placeholders must start with a letter and cannot contain special characters or numbers';
      }
      return res.status(400).json(response);
    }

    const uniquePlaceholders = [...new Set(placeholders.map((ph: string) => ph.slice(2, -2).trim()))];
    const response: TemplateApiResponse = { success: true, data: { placeholders: uniquePlaceholders } };
    res.json(response);
  }
);

router.post('/generate-preview',
  body('template').isString(),
  body('variables').isObject(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: TemplateApiResponse = { success: false, errors: errors.array() };
      return res.status(400).json(response);
    }

    const { template, variables } = req.body;
    console.log(req.body);
    const placeholderRegex = /{{\s*[a-zA-Z_][a-zA-Z_0-9]*\s*}}/g;
    let preview = template;

    if (template.includes('{{') && !template.includes('}}')) {
      const response: TemplateApiResponse = { success: false, message: 'Invalid template format: missing closing "}}" for a placeholder' };
      return res.status(400).json(response);
    } else if (template.match(/{{\s*[^a-zA-Z_][^}]*\s*}}/g) || template.match(/{{\s*[a-zA-Z_]*\d+[a-zA-Z_]*\s*}}/g)) {
      const response: TemplateApiResponse = { success: false, message: 'Invalid template format: placeholders must start with a letter and cannot contain special characters or numbers' };
      return res.status(400).json(response);
    }

    const placeholders = template.match(placeholderRegex);
    if (placeholders) {
      for (const ph of placeholders) {
        const key = ph.slice(2, -2).trim();
        if (!(key in variables)) {
          const response: TemplateApiResponse = { success: false, message: `Missing variable for placeholder: ${key}` };
          return res.status(400).json(response);
        }

        if (variables[key] === '' || variables[key] === null || variables[key] === undefined) {
          const response: TemplateApiResponse = { success: false, message: `Invalid variable value for placeholder: ${key}` };
          return res.status(400).json(response);
        }
        preview = preview.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), variables[key]);
      }
    } else {
      const response: TemplateApiResponse = { success: false, message: 'No placeholders found in the template' };
      return res.status(400).json(response);
    }

    const response: TemplateApiResponse = { success: true, data: { preview } };
    res.json(response);
  }
);

export default router;