# Git Hooks Setup Guide

## المشكلة

عند تعديل قاعدة البيانات مباشرة (مثلاً من AI agent أو direct SQL) بدون إنشاء migration file، ينشأ عدم تناسق بين الكود وقاعدة البيانات.

## الحل

Git hooks و CI checks تمنع وتكشف هذه المشكلة.

---

## 1. Git Pre-commit Hook (Local)

### التثبيت:

```bash
# Linux/Mac
chmod +x .githooks/pre-commit-db-check
git config core.hooksPath .githooks

# Windows (PowerShell)
git config core.hooksPath .githooks
```

### ما يفعله:

- يتحقق من وجود migration files
- يتحقق من صحة أسماء الملفات
- يحذرك إذا المشروع مرتبط بـ Supabase cloud

---

## 2. GitHub Actions CI (Automated)

### التفعيل:

الـ workflow موجود في `.github/workflows/db-consistency.yml` وسيعمل تلقائياً على:

- push إلى main/develop
- pull requests

### الفحوصات:

1. **db-consistency**: يأكد أن migration files موجودة
2. **lint-migrations**: يفحص مشاكل SQL
3. **security-scan**: يفحص أفضل الممارسات الأمنية

---

## 3. Supabase CLI Integration

### قبل أي تعديل على DB:

```bash
# 1. تأكد إنك على local database
supabase status

# 2. اعمل تعديلاتك

# 3. تأكد إن التغييرات تعمل
supabase db start

# 4. انشئ migration من التغييرات
supabase db diff --file "description_of_change"

# 5. راجع الـ migration file قبل commit
```

### التحقق من sync:

```bash
# عرض كل الـ migrations
supabase migration list

# مقارنة local مع remote
supabase db diff --dry-run
```

---

## 4. Best Practices

### ❌ لا تفعل:

```bash
# ❌ Never do this - modifies DB directly without migration
psql "connection_string" -c "ALTER TABLE..."

# ❌ Never do this - AI agent modified DB directly
supabase db query "UPDATE..."

# ❌ Never commit without migration
git add . && git commit -m "fixed stuff in DB"
```

### ✅ افعل:

```bash
# ✅ Always create migration first
supabase db diff --file "add_new_column"

# ✅ Review migration before applying
cat supabase/migrations/20260523120000_add_new_column.sql

# ✅ Apply migration
supabase db push

# ✅ Then commit
git add .
git commit -m "add new column to profiles"
```

---

## 5. إذا حدثت المشكلة مرة أخرى

### اكتشاف:

```bash
# Check which migrations are in DB but not in files
supabase migration list
```

### الحل:

```bash
# 1. Export current DB structure
supabase db dump > current_db.sql

# 2. Compare with migrations
diff <(grep "CREATE" supabase/migrations/*.sql) <(grep "CREATE" current_db.sql)

# 3. Create migration for missing changes
supabase db diff --file "fix_missing_migration"
```

---

## 6. Alert System

لإضافة تنبيه عند محاولة push مع DB غير متسق:

```bash
# Add to .git/hooks/pre-push
if [ -n "$(git status --porcelain supabase/migrations/)" ]; then
    echo "⚠️  Warning: Uncommitted migration files"
    read -p "Continue push? (y/n) " -n 1 -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
```

---

## Summary

| Method           | Purpose              | When          |
| ---------------- | -------------------- | ------------- |
| Pre-commit hook  | Local prevention     | Before commit |
| CI workflow      | Automated check      | On push/PR    |
| supabase db diff | Migration generation | Before commit |
| Migration list   | Verification         | Any time      |

**Key Rule:** أي تعديل على DB يجب أن يكون له migration file موافق.
