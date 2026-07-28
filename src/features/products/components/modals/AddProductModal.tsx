import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Modal } from '../../../../components/ui/Modal';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { useI18n } from '../../../../i18n/i18nContext';
import { addProduct } from '../../api/productsApi';
import type { Product } from '../../../../types/product';

const addProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  brand: z.string().min(1, 'Brand is required'),
  thumbnail: z.string().url('Must be a valid URL').or(z.literal('')),
});

type AddProductFormValues = z.infer<typeof addProductSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

export function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: { title: '', price: 0, description: '', category: '', brand: '', thumbnail: '' },
  });

  const onSubmit = async (values: AddProductFormValues) => {
    try {
      const response = await addProduct({
        title: values.title,
        price: values.price,
        description: values.description,
        category: values.category,
        brand: values.brand,
        thumbnail: values.thumbnail || 'https://placehold.co/400x300?text=No+Image',
        images: values.thumbnail ? [values.thumbnail] : [],
        discountPercentage: 0,
        rating: 0,
        stock: 10,
      });
      onProductAdded(response);
      toast.success(t.toast.productAdded);
      reset();
      onClose();
    } catch {
      toast.error('Failed to add product. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t.addForm.title}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Input placeholder={t.addForm.name} error={errors.title?.message} {...register('title')} />
        <Input
          type="number"
          step="0.01"
          placeholder={t.addForm.price}
          error={errors.price?.message}
          {...register('price')}
        />
        <textarea
          placeholder={t.addForm.description}
          rows={3}
          className="w-full rounded-xl border border-neutral-200 bg-surface px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-surface-elevated dark:text-neutral-50"
          {...register('description')}
        />
        {errors.description && <p className="-mt-2 text-xs text-error">{errors.description.message}</p>}
        <Input placeholder={t.addForm.category} error={errors.category?.message} {...register('category')} />
        <Input placeholder={t.addForm.brand} error={errors.brand?.message} {...register('brand')} />
        <Input placeholder={t.addForm.image} error={errors.thumbnail?.message} {...register('thumbnail')} />

        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
            {t.addForm.cancel}
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? t.addForm.submitting : t.addForm.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
