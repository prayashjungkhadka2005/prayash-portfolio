# 🔍 Complete Dependency Analysis

**Every file's use case and dependencies verified**

---

## 📄 FILE USAGE MAP:

### **ROOT PAGE (/)** - SQL Builder
```
src/app/page.tsx
├─ USES:
│  ├─ ThemeToggle (shared - also in portfolio)
│  ├─ 8 SQL components (sql-builder specific)
│  └─ SQL types (sql-builder specific)
└─ PURPOSE: Main SQL Query Builder landing page
```

### **PORTFOLIO PAGE (/portfolio)**
```
src/app/portfolio/page.tsx
├─ USES:
│  ├─ Navbar (portfolio only)
│  ├─ ThemeToggle (shared - also in SQL)
│  ├─ DevToolbar (portfolio only)
│  └─ 6 sections (portfolio only)
└─ PURPOSE: Personal portfolio showcase
```

---

## 🎯 FEATURE ISOLATION ANALYSIS:

### **1. SQL BUILDER (100% isolated)** ✅
```
Files: 19 total
└─ Used ONLY by root page.tsx

Components (8):
├─ ColumnsSelector.tsx
├─ HelpTooltip.tsx
├─ OrderByBuilder.tsx
├─ QueryPreview.tsx         ← Uses: Toast, useToast
├─ QueryTypeSelector.tsx
├─ QuickTemplates.tsx
├─ TableSelector.tsx
└─ WhereClauseBuilder.tsx

Utils (8):
├─ sql-generator.ts
├─ export-utils.ts
├─ mock-data-generator.ts
└─ mock-data/
    ├─ constants.ts
    ├─ generators.ts
    ├─ factories.ts
    ├─ index.ts
    └─ README.md

Types (1):
└─ sql-builder.ts

Styles (2):
├─ sql-builder.css
└─ SQL_BUILDER_CLASSES.md

VERDICT: Can move to /features/sql-builder/ ✅
```

---

### **2. PORTFOLIO (mostly isolated)** ✅
```
Files: 9 total
└─ Used ONLY by /portfolio page

Components (3):
├─ Navbar.tsx              (only portfolio)
├─ DevToolbar.tsx          (only portfolio, imports dev-tools)
└─ ThemeToggle.tsx         ⚠️ SHARED (also in SQL!)

Sections (6):
├─ Hero.tsx
├─ About.tsx
├─ Experience.tsx
├─ Skills.tsx
├─ Projects.tsx
└─ Contact.tsx

VERDICT: Can move to /features/portfolio/ ✅
         (except ThemeToggle → shared)
```

---

### **3. DEV TOOLS (isolated)** ✅
```
Files: 6 total
└─ Used ONLY by DevToolbar (which is portfolio-only)

Components (6):
├─ Terminal.tsx
├─ ApiTester.tsx
├─ JwtDecoder.tsx
├─ HashGenerator.tsx
├─ JsonFormatter.tsx
└─ CronBuilder.tsx

VERDICT: Can move to /features/dev-tools/ ✅
```

---

### **4. SHARED (used by multiple features)** ⚠️
```
Files: 3 total
└─ Used by BOTH SQL Builder AND Portfolio

Components:
└─ ThemeToggle.tsx        (SQL page + Portfolio page)

UI Components:
└─ Toast.tsx              (ONLY used by SQL QueryPreview)
                          ⚠️ NOT truly shared!

Hooks:
└─ useToast.ts            (ONLY used by SQL QueryPreview)
                          ⚠️ NOT truly shared!

VERDICT:
- ThemeToggle → /shared/components/ ✅
- Toast → /features/sql-builder/components/ui/ ✅
- useToast → /features/sql-builder/hooks/ ✅
```

---

## 🔄 CORRECTED MIGRATION PLAN:

### **SQL Builder Feature** (21 files):
```
/features/sql-builder/
├── components/
│   ├── ColumnsSelector.tsx
│   ├── HelpTooltip.tsx
│   ├── OrderByBuilder.tsx
│   ├── QueryPreview.tsx
│   ├── QueryTypeSelector.tsx
│   ├── QuickTemplates.tsx
│   ├── TableSelector.tsx
│   ├── WhereClauseBuilder.tsx
│   └── ui/
│       └── Toast.tsx           ← Move here (SQL-only)
├── hooks/
│   └── useToast.ts             ← Move here (SQL-only)
├── utils/
│   ├── sql-generator.ts
│   ├── export-utils.ts
│   ├── mock-data-generator.ts
│   └── mock-data/
│       ├── constants.ts
│       ├── generators.ts
│       ├── factories.ts
│       ├── index.ts
│       └── README.md
├── types/
│   └── index.ts               (was sql-builder.ts)
└── styles/
    ├── sql-builder.css
    └── SQL_BUILDER_CLASSES.md
```

### **Portfolio Feature** (9 files):
```
/features/portfolio/
├── components/
│   ├── Navbar.tsx
│   └── DevToolbar.tsx
└── sections/
    ├── Hero.tsx
    ├── About.tsx
    ├── Experience.tsx
    ├── Skills.tsx
    ├── Projects.tsx
    └── Contact.tsx
```

### **Dev Tools Feature** (6 files):
```
/features/dev-tools/
└── components/
    ├── Terminal.tsx
    ├── ApiTester.tsx
    ├── JwtDecoder.tsx
    ├── HashGenerator.tsx
    ├── JsonFormatter.tsx
    └── CronBuilder.tsx
```

### **Shared** (1 file):
```
/shared/
└── components/
    └── ThemeToggle.tsx        ← ONLY truly shared component!
```

---

## 📊 SUMMARY:

| Feature | Files | Truly Isolated? |
|---------|-------|-----------------|
| SQL Builder | 21 | ✅ Yes (100%) |
| Portfolio | 9 | ✅ Yes (uses DevTools) |
| Dev Tools | 6 | ✅ Yes (used by Portfolio) |
| **Shared** | **1** | **✅ ThemeToggle only!** |

---

## ✅ VERIFIED SAFE TO MOVE:

**Total migration:**
- 21 files → /features/sql-builder/
- 9 files → /features/portfolio/
- 6 files → /features/dev-tools/
- 1 file → /shared/

**Zero cross-feature dependencies!** (except ThemeToggle)

---

**Ready to execute?** I'll move files systematically and update all imports. 🚀

