import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TemplateApiResponse from '../interfaces/TemplateAPIResponse';

const generatePreviewController = (req: Request, res: Response) => {
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

export default generatePreviewController