import { z } from 'zod';

export const createCategorySchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Category name is required').max(100, 'Category name too long'),
  active: z.boolean().optional().default(true),
});

export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, 'Category name is required')
      .max(100, 'Category name too long')
      .optional(),
    active: z.boolean().optional(),
  })
  .refine(data => data.name !== undefined || data.active !== undefined, {
    message: 'At least one field (name or active) must be provided',
  });

export const categoryIdSchema = z.object({
  categoryId: z.string().min(1, 'Category ID is required'),
});

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type CategoryIdRequest = z.infer<typeof categoryIdSchema>;
