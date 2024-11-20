import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import TemplateApiResponse from '../interfaces/TemplateAPIResponse';

const validateTemplateController = (req: Request, res: Response) => {
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

export default validateTemplateController