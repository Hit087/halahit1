"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { createCategory, updateCategory } from "@/server/actions/admin-categories";
import type { Category } from "@prisma/client";

export function CategoryForm({
  category,
  compact,
}: {
  category?: Category;
  compact?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "حدث خطأ");
      return;
    }
    router.refresh();
    if (!category) (e.target as HTMLFormElement).reset();
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
      <Input name="name" label="الاسم (عربي)" defaultValue={category?.name} required />
      <Input name="nameEn" label="الاسم (إنجليزي)" defaultValue={category?.nameEn} required />
      <Input name="slug" label="Slug" defaultValue={category?.slug} required />
      <Input
        name="sortOrder"
        type="number"
        label="الترتيب"
        defaultValue={category?.sortOrder ?? 0}
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="hidden" name="active" value="false" />
        <input
          type="checkbox"
          name="active"
          value="true"
          defaultChecked={category?.active ?? true}
        />
        نشط
      </label>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <Button
        type="submit"
        variant={compact ? "outline" : "accent"}
        size="sm"
        loading={loading}
      >
        {category ? "تحديث" : "إضافة"}
      </Button>
    </form>
  );

  if (compact) return form;
  return <Card>{form}</Card>;
}